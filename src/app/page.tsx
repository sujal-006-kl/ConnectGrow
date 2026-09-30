'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  Target, 
  Zap, 
  MessageSquare, 
  Award, 
  TrendingUp,
  BrainCircuit,
  HeartHandshake
} from 'lucide-react';

export default function Home() {
  const journeySteps = [
    { title: 'Discover', desc: 'Find ConnectGrow online', icon: Sparkles, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { title: 'Sign Up', desc: 'Create account in seconds', icon: UserPlus, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    { title: 'Build Profile', desc: 'Add Interests, Skills & Goals', icon: Target, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { title: '60-40 Matches', desc: '60% Similarity + 40% Growth', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { title: 'Connect & AI Icebreaker', desc: 'Break the ice effortlessly', icon: BrainCircuit, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { title: 'Chat & Learn', desc: 'Real-time conversation & exchange', icon: MessageSquare, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { title: 'Feedback & Grow', desc: 'Endorse skills & continue networking', icon: Award, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-100/80 text-indigo-700 border border-indigo-200 shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <span>The Next Generation Networking Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Connect with People. <br className="hidden sm:inline" />
          <span className="gradient-text">Learn, Chat & Grow Together.</span>
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          ConnectGrow matches you based on a weighted <strong>60-40 algorithm</strong>: 
          60% shared interests & similarity, plus 40% complementary skills and growth goals.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white gradient-badge shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition-all"
          >
            Explore 60-40 Matches
          </Link>
        </div>
      </section>

      {/* The Journey Infographic Timeline */}
      <section className="space-y-8 glass-card p-8 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">The Entire Journey in One Flow</h2>
          <p className="text-slate-500 text-sm">How ConnectGrow brings meaningful connections to life</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 relative">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${step.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">STEP 0{idx + 1}</div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Breakdown Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 rounded-2xl space-y-3 border border-indigo-100 hover:border-indigo-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">60-40 Smart Matching Engine</h3>
          <p className="text-sm text-slate-600">
            60% score evaluates shared hobbies, skills & domain context. 40% evaluates skill-exchange opportunity where one person teaches what the other wants to learn.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border border-rose-100 hover:border-rose-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">AI Icebreaker Generation</h3>
          <p className="text-sm text-slate-600">
            Never struggle with awkward first messages. Our AI analyzes both profile bios and goals to craft 3 tailor-made conversation starters instantly.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-3 border border-purple-100 hover:border-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Learn, Endorse & Grow</h3>
          <p className="text-sm text-slate-600">
            Provide feedback post-chat, endorse skills learned from peers, and build your digital reputation network over time.
          </p>
        </div>
      </section>

      {/* CTA Box */}
      <section className="rounded-3xl gradient-badge p-10 text-white text-center space-y-6 shadow-2xl shadow-indigo-500/20">
        <h2 className="text-3xl font-extrabold">Ready to Find Your Next 60-40 Growth Match?</h2>
        <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base">
          Join developers, designers, founders, and learners who connect and elevate each other every day.
        </p>
        <div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg transition-transform hover:scale-105"
          >
            Create Your Profile Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
