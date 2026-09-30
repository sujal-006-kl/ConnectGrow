'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Connection, UserProfile } from '@/types';
import { INITIAL_CURRENT_USER, MOCK_USERS, MOCK_INITIAL_CONNECTIONS } from '@/lib/data';
import { UserCheck, MessageSquare, Award, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>(MOCK_INITIAL_CONNECTIONS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);

  useEffect(() => {
    const savedUser = localStorage.getItem('connect_grow_user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }

    const savedConns = localStorage.getItem('connect_grow_connections');
    if (savedConns) {
      try { setConnections(JSON.parse(savedConns)); } catch (e) {}
    }
  }, []);

  const connectedUsers = connections.map(conn => {
    const otherId = conn.requesterId === currentUser.id ? conn.receiverId : conn.requesterId;
    const user = MOCK_USERS.find(u => u.id === otherId);
    return { conn, user };
  }).filter(item => item.user !== undefined);

  return (
    <div className="space-y-6 py-2">
      <div className="glass-card p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            Your Connections & Learning Network
          </h1>
          <p className="text-xs text-slate-500">
            People you have connected with on ConnectGrow to exchange skills and collaborate.
          </p>
        </div>

        <Link
          href="/discover"
          className="px-4 py-2.5 rounded-xl gradient-badge text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-95 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          Find More 60-40 Matches
        </Link>
      </div>

      {connectedUsers.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl space-y-4 border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No active connections yet</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Head over to the Discover feed to explore 60-40 match recommendations and connect!
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md"
          >
            Explore Matches
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {connectedUsers.map(({ conn, user }) => {
            if (!user) return null;
            return (
              <div 
                key={conn.id}
                className="glass-card p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                      <p className="text-xs text-slate-500">{user.headline}</p>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Connected • Goal: {user.primaryGoal}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{user.bio}"
                  </p>

                  {conn.aiIcebreakers && conn.aiIcebreakers.length > 0 && (
                    <div className="p-3 rounded-xl bg-violet-50/80 border border-violet-100 space-y-1">
                      <div className="text-[11px] font-bold text-violet-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Icebreaker Ready
                      </div>
                      <p className="text-xs text-violet-900 italic line-clamp-1">
                        "{conn.aiIcebreakers[0]}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    href={`/chat?connectionId=${conn.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Chat
                  </Link>

                  <Link
                    href={`/feedback?connectionId=${conn.id}`}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-purple-600" />
                    Give Feedback
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
