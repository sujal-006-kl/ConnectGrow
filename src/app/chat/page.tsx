'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Connection, Message, UserProfile } from '@/types';
import { INITIAL_CURRENT_USER, MOCK_USERS, MOCK_INITIAL_CONNECTIONS, MOCK_INITIAL_MESSAGES } from '@/lib/data';
import { generateAIIcebreakers } from '@/lib/ai-icebreaker';
import { calculateMatchScore } from '@/lib/matching';
import { Sparkles, Send, MessageSquare, Bot, RefreshCw, Zap } from 'lucide-react';

function ChatContent() {
  const searchParams = useSearchParams();
  const initialConnId = searchParams.get('connectionId') || MOCK_INITIAL_CONNECTIONS[0].id;

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [connections, setConnections] = useState<Connection[]>(MOCK_INITIAL_CONNECTIONS);
  const [activeConnId, setActiveConnId] = useState<string>(initialConnId);
  const [messages, setMessages] = useState<Message[]>(MOCK_INITIAL_MESSAGES);
  const [inputContent, setInputContent] = useState<string>('');
  
  // AI Icebreaker state
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('connect_grow_user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }

    const savedConns = localStorage.getItem('connect_grow_connections');
    if (savedConns) {
      try { setConnections(JSON.parse(savedConns)); } catch (e) {}
    }

    const savedMsgs = localStorage.getItem('connect_grow_messages');
    if (savedMsgs) {
      try { setMessages(JSON.parse(savedMsgs)); } catch (e) {}
    }
  }, []);

  const activeConnection = connections.find(c => c.id === activeConnId) || connections[0];
  
  const peerUserId = activeConnection 
    ? (activeConnection.requesterId === currentUser.id ? activeConnection.receiverId : activeConnection.requesterId)
    : MOCK_USERS[0].id;
  
  const peerUser = MOCK_USERS.find(u => u.id === peerUserId) || MOCK_USERS[0];

  // Load or generate AI Icebreakers when active connection changes
  useEffect(() => {
    if (activeConnection) {
      if (activeConnection.aiIcebreakers && activeConnection.aiIcebreakers.length > 0) {
        setIcebreakers(activeConnection.aiIcebreakers);
      } else {
        loadAIIcebreakers();
      }
    }
  }, [activeConnId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConnId]);

  const loadAIIcebreakers = async () => {
    if (!peerUser) return;
    setIsGeneratingAI(true);
    const score = calculateMatchScore(currentUser, peerUser);
    const generated = await generateAIIcebreakers(currentUser, peerUser, score);
    setIcebreakers(generated);
    setIsGeneratingAI(false);
  };

  const activeMessages = messages.filter(m => m.connectionId === activeConnId);

  const handleSendMessage = (textToSend?: string, isIcebreaker = false) => {
    const text = textToSend || inputContent;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      connectionId: activeConnId,
      senderId: currentUser.id,
      content: text.trim(),
      timestamp: new Date().toISOString(),
      isIcebreaker
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem('connect_grow_messages', JSON.stringify(updated));
    if (!textToSend) setInputContent('');

    // Simulate instant friendly response from peer user after 1.5 seconds!
    setTimeout(() => {
      const simulatedReply: Message = {
        id: `msg_reply_${Date.now()}`,
        connectionId: activeConnId,
        senderId: peerUser.id,
        content: `Thanks for messaging! I'm really excited about exchanging skills on ${peerUser.interests[0] || 'tech'} and ${currentUser.interests[0] || 'projects'}. What time works for a quick chat?`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => {
        const nextMsgs = [...prev, simulatedReply];
        localStorage.setItem('connect_grow_messages', JSON.stringify(nextMsgs));
        return nextMsgs;
      });
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] min-h-[550px] glass-card rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar - Connection List */}
      <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Conversations ({connections.length})
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {connections.map((conn) => {
            const otherId = conn.requesterId === currentUser.id ? conn.receiverId : conn.requesterId;
            const u = MOCK_USERS.find(user => user.id === otherId);
            if (!u) return null;
            const isActive = conn.id === activeConnId;

            return (
              <button
                key={conn.id}
                onClick={() => setActiveConnId(conn.id)}
                className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                  isActive ? 'bg-white shadow-sm font-medium border-l-4 border-indigo-600' : 'hover:bg-slate-100/60'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-xs truncate">{u.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{u.headline}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Active Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <img src={peerUser.avatar} alt={peerUser.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20" />
            <div>
              <h2 className="font-bold text-slate-900 text-sm">{peerUser.name}</h2>
              <p className="text-[11px] text-slate-500">{peerUser.headline} • {peerUser.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
              60-40 Matched
            </span>
          </div>
        </div>

        {/* AI Icebreaker Suggestions Panel */}
        <div className="p-4 bg-gradient-to-r from-indigo-50/90 via-purple-50/90 to-pink-50/90 border-b border-indigo-100 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>AI Icebreaker Assistant</span>
            </div>
            <button
              onClick={loadAIIcebreakers}
              disabled={isGeneratingAI}
              className="text-[11px] text-indigo-700 hover:text-indigo-900 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              Regenerate Prompts
            </button>
          </div>

          {isGeneratingAI ? (
            <div className="text-xs text-indigo-600 font-medium py-2 text-center animate-pulse">
              Gemini AI is analyzing profile compatibility & generating smart conversation starters...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {icebreakers.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(promptText, true)}
                  className="p-2.5 rounded-xl bg-white/90 border border-indigo-200/80 text-left hover:border-indigo-400 hover:shadow-md transition-all group space-y-1"
                >
                  <div className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Option 0{idx + 1}
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-tight group-hover:text-indigo-900">
                    "{promptText}"
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Timeline */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
          {activeMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Bot className="w-8 h-8 text-indigo-400 mx-auto" />
              <p>No messages yet. Click any AI Icebreaker above to start the conversation!</p>
            </div>
          ) : (
            activeMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/10' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.isIcebreaker && (
                      <div className={`text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 ${isMe ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        <Sparkles className="w-3 h-3" />
                        AI Icebreaker Sent
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 px-1 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${peerUser.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl gradient-badge text-white shadow-md hover:opacity-95 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading Chat & AI Assistant...
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
