'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Connection, UserProfile } from '@/types';
import { INITIAL_CURRENT_USER, MOCK_USERS, MOCK_INITIAL_CONNECTIONS } from '@/lib/data';
import { Award, Star, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

function FeedbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const connectionId = searchParams.get('connectionId') || MOCK_INITIAL_CONNECTIONS[0].id;

  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CURRENT_USER);
  const [connections, setConnections] = useState<Connection[]>(MOCK_INITIAL_CONNECTIONS);
  const [rating, setRating] = useState<number>(5);
  const [learnedSomething, setLearnedSomething] = useState<boolean>(true);
  const [endorsedSkills, setEndorsedSkills] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

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

  const activeConnection = connections.find(c => c.id === connectionId) || connections[0];
  const peerUserId = activeConnection 
    ? (activeConnection.requesterId === currentUser.id ? activeConnection.receiverId : activeConnection.requesterId)
    : MOCK_USERS[0].id;

  const peerUser = MOCK_USERS.find(u => u.id === peerUserId) || MOCK_USERS[0];

  const toggleEndorseSkill = (skillName: string) => {
    if (endorsedSkills.includes(skillName)) {
      setEndorsedSkills(endorsedSkills.filter(s => s !== skillName));
    } else {
      setEndorsedSkills([...endorsedSkills, skillName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-200">
          <Award className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Connection & Learning Feedback</h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Rate your connection with <strong>{peerUser.name}</strong> and endorse skills you learned or discussed!
        </p>
      </div>

      {submitted ? (
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 border border-emerald-200 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Thank You for Your Feedback!</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Your feedback helps refine 60-40 match accuracy and builds a trusted growth community.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => router.push('/discover')}
              className="px-6 py-3 rounded-xl gradient-badge text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              Continue Discovering Matches
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {/* Peer Info Header */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <img src={peerUser.avatar} alt={peerUser.name} className="w-12 h-12 rounded-xl object-cover" />
            <div>
              <div className="font-bold text-slate-900 text-sm">{peerUser.name}</div>
              <div className="text-xs text-slate-500">{peerUser.headline}</div>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-2 text-center">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Overall Connection Quality
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1.5 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Learned Something Checkbox */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Did you exchange skills or learn something new?
              </div>
              <div className="text-[11px] text-slate-500">
                Helps track mutual learning milestones.
              </div>
            </div>
            <input
              type="checkbox"
              checked={learnedSomething}
              onChange={(e) => setLearnedSomething(e.target.checked)}
              className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
            />
          </div>

          {/* Endorse Peer Skills */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Endorse {peerUser.name}'s Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {peerUser.skills.map((skill) => {
                const isSelected = endorsedSkills.includes(skill.name);
                return (
                  <button
                    type="button"
                    key={skill.name}
                    onClick={() => toggleEndorseSkill(skill.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                    }`}
                  >
                    {isSelected ? '✓ Endorsed: ' : '+ Endorse: '}{skill.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Feedback Notes / Testimonial
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share key takeaways from your chat or how this connection helped your growth..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl gradient-badge text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-95"
          >
            Submit Feedback & Save Learning Outcome
          </button>
        </form>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading Feedback Form...
      </div>
    }>
      <FeedbackContent />
    </Suspense>
  );
}
