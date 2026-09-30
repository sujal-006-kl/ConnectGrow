'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, MatchResult, Connection } from '@/types';
import { INITIAL_CURRENT_USER, MOCK_USERS, MOCK_INITIAL_CONNECTIONS } from '@/lib/data';
import { calculateMatchScore } from '@/lib/matching';
import { generateAIIcebreakers } from '@/lib/ai-icebreaker';
import { Sparkles, Zap, Heart, Check, Filter, Info, MessageSquare, MapPin, UserPlus, X } from 'lucide-react';

export default function DiscoverPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [connections, setConnections] = useState<Connection[]>(MOCK_INITIAL_CONNECTIONS);
  const [selectedMatchModal, setSelectedMatchModal] = useState<MatchResult | null>(null);
  const [goalFilter, setGoalFilter] = useState<string>('ALL');
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);

  useEffect(() => {
    // Load current user from local storage if available
    const savedUser = localStorage.getItem('connect_grow_user');
    let activeUser = INITIAL_CURRENT_USER;
    if (savedUser) {
      try {
        activeUser = JSON.parse(savedUser);
        setCurrentUser(activeUser);
      } catch (e) {
        console.error(e);
      }
    }

    // Load saved connections
    const savedConns = localStorage.getItem('connect_grow_connections');
    if (savedConns) {
      try {
        setConnections(JSON.parse(savedConns));
      } catch (e) {
        console.error(e);
      }
    }

    // Compute 60-40 matches against mock database profiles
    const computed = MOCK_USERS.map(user => {
      const score = calculateMatchScore(activeUser, user);
      return { user, score };
    });

    // Sort by highest overall match percentage
    computed.sort((a, b) => b.score.totalMatch - a.score.totalMatch);
    setMatchResults(computed);
  }, []);

  const handleConnect = async (targetUser: UserProfile, matchScore: any) => {
    setConnectingUserId(targetUser.id);

    // Generate AI Icebreakers
    const icebreakers = await generateAIIcebreakers(currentUser, targetUser, matchScore);

    const newConn: Connection = {
      id: `conn_${Date.now()}`,
      requesterId: currentUser.id,
      receiverId: targetUser.id,
      status: 'ACCEPTED', // Instant connection for seamless dev experience
      createdAt: new Date().toISOString(),
      aiIcebreakers: icebreakers
    };

    const updatedConns = [...connections, newConn];
    setConnections(updatedConns);
    localStorage.setItem('connect_grow_connections', JSON.stringify(updatedConns));
    setConnectingUserId(null);

    // Navigate to Chat page
    router.push(`/chat?connectionId=${newConn.id}`);
  };

  const filteredMatches = matchResults.filter(res => {
    if (goalFilter === 'ALL') return true;
    return res.user.primaryGoal === goalFilter;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            60-40 Match Recommendation Feed
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Discover Growth Partners for <span className="gradient-text">{currentUser.name}</span>
          </h1>
          <p className="text-xs text-slate-500">
            60% Similarity (Shared Interests & Domain) + 40% Growth Alignment (Complementary Skill Exchange & Goals)
          </p>
        </div>

        {/* Goal Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">All Goals</option>
            <option value="Skill Exchange">Skill Exchange</option>
            <option value="Co-Founder Search">Co-Founder Search</option>
            <option value="Mentorship & Advice">Mentorship & Advice</option>
            <option value="Peer Learning">Peer Learning</option>
          </select>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map(({ user, score }) => {
          const isConnected = connections.some(
            c => (c.requesterId === currentUser.id && c.receiverId === user.id) ||
                 (c.receiverId === currentUser.id && c.requesterId === user.id)
          );

          const isConnecting = connectingUserId === user.id;

          return (
            <div 
              key={user.id}
              className="glass-card rounded-3xl p-6 space-y-5 border border-slate-200/90 shadow-md hover:shadow-xl transition-all relative flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: User Info & Match Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{user.headline}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {user.location}
                      </div>
                    </div>
                  </div>

                  {/* 60-40 Match Score Badge */}
                  <button
                    onClick={() => setSelectedMatchModal({ user, score })}
                    className="flex flex-col items-end px-3 py-1.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex items-center gap-1 font-extrabold text-sm">
                      <Zap className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                      {score.totalMatch}% MATCH
                    </div>
                    <div className="text-[10px] text-indigo-600 font-medium">
                      60% ({score.similarityScore}) + 40% ({score.growthScore})
                    </div>
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  "{user.bio}"
                </p>

                {/* 60% Similarity Highlights */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>60% Common Ground (Similarity)</span>
                    <span className="text-indigo-600">{score.similarityScore}/60 pts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {score.sharedInterests.map((interest) => (
                      <span key={interest} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        ★ {interest}
                      </span>
                    ))}
                    {score.sharedInterests.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Complementary domain background</span>
                    )}
                  </div>
                </div>

                {/* 40% Growth Alignment Highlights */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>40% Growth Synergy (Skill Exchange)</span>
                    <span className="text-emerald-600">{score.growthScore}/40 pts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {score.learnableSkills.map((skill) => (
                      <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ⚡ Learn {skill}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      🎯 Goal: {user.primaryGoal}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedMatchModal({ user, score })}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  Score Math
                </button>

                {isConnected ? (
                  <button
                    onClick={() => {
                      const conn = connections.find(c => c.receiverId === user.id || c.requesterId === user.id);
                      if (conn) router.push(`/chat?connectionId=${conn.id}`);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Chat & AI Icebreakers
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(user, score)}
                    disabled={isConnecting}
                    className="flex-1 py-2.5 rounded-xl gradient-badge text-white text-xs font-bold hover:opacity-95 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-opacity"
                  >
                    {isConnecting ? (
                      <span className="animate-pulse">Generating AI Icebreaker...</span>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        Connect & AI Icebreaker
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Match Details Modal */}
      {selectedMatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedMatchModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={selectedMatchModal.user.avatar}
                alt={selectedMatchModal.user.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  60-40 Match Breakdown with {selectedMatchModal.user.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedMatchModal.user.headline}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Overall Total */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-indigo-600 uppercase">Total Combined Score</div>
                  <div className="text-2xl font-black text-indigo-900">
                    {selectedMatchModal.score.totalMatch}% Match
                  </div>
                </div>
                <Zap className="w-8 h-8 text-indigo-600" />
              </div>

              {/* 60% Similarity Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>60% SIMILARITY SCORE (Common Ground)</span>
                  <span className="text-indigo-600">{selectedMatchModal.score.similarityScore} / 60</span>
                </div>
                <p className="text-xs text-slate-500">
                  Measures overlapping interests ({selectedMatchModal.score.sharedInterests.length} shared) and common skill sets.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedMatchModal.score.sharedInterests.map(i => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-semibold">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              {/* 40% Growth Score Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>40% GROWTH ALIGNMENT (Complementary Synergy)</span>
                  <span className="text-emerald-600">{selectedMatchModal.score.growthScore} / 40</span>
                </div>
                <p className="text-xs text-slate-500">
                  Measures skill exchange opportunity (what they teach that you want to learn) + goal alignment.
                </p>
                <div className="text-xs font-semibold text-emerald-800">
                  Goal Alignment: {selectedMatchModal.score.goalSynergy}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const target = selectedMatchModal.user;
                const score = selectedMatchModal.score;
                setSelectedMatchModal(null);
                handleConnect(target, score);
              }}
              className="w-full py-3 rounded-xl gradient-badge text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:opacity-95"
            >
              Connect & Generate AI Icebreaker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
