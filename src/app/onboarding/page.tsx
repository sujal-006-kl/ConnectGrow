'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, GoalType, UserSkill } from '@/types';
import { INITIAL_CURRENT_USER } from '@/lib/data';
import { User, Sparkles, Plus, X, ArrowRight, ArrowLeft, Check, Target, BookOpen } from 'lucide-react';

const SUGGESTED_INTERESTS = [
  'Artificial Intelligence', 'React', 'Startups', 'Product Design', 
  'Web3', 'Python', 'Growth Marketing', 'Figma', 'TypeScript', 
  'Machine Learning', 'Next.js', 'Open Source', 'Data Science', 'UI/UX Design'
];

const GOAL_OPTIONS: GoalType[] = [
  'Skill Exchange',
  'Co-Founder Search',
  'Mentorship & Advice',
  'Peer Learning',
  'Networking & Collaboration'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Profile Form State
  const [name, setName] = useState(INITIAL_CURRENT_USER.name);
  const [headline, setHeadline] = useState(INITIAL_CURRENT_USER.headline);
  const [bio, setBio] = useState(INITIAL_CURRENT_USER.bio);
  const [location, setLocation] = useState(INITIAL_CURRENT_USER.location);
  const [primaryGoal, setPrimaryGoal] = useState<GoalType>(INITIAL_CURRENT_USER.primaryGoal);
  
  // Interests State
  const [interests, setInterests] = useState<string[]>(INITIAL_CURRENT_USER.interests);
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Skills State
  const [skills, setSkills] = useState<UserSkill[]>(INITIAL_CURRENT_USER.skills);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');
  const [newSkillCanTeach, setNewSkillCanTeach] = useState(true);
  const [newSkillWantsToLearn, setNewSkillWantsToLearn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('connect_grow_user');
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        setName(parsed.name);
        setHeadline(parsed.headline);
        setBio(parsed.bio);
        setLocation(parsed.location);
        setPrimaryGoal(parsed.primaryGoal);
        setInterests(parsed.interests);
        setSkills(parsed.skills);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterestInput.trim() && !interests.includes(customInterestInput.trim())) {
      setInterests([...interests, customInterestInput.trim()]);
      setCustomInterestInput('');
    }
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: UserSkill = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      canTeach: newSkillCanTeach,
      wantsToLearn: newSkillWantsToLearn
    };
    setSkills([...skills, newSkill]);
    setNewSkillName('');
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    const updatedUser: UserProfile = {
      ...INITIAL_CURRENT_USER,
      name,
      headline,
      bio,
      location,
      primaryGoal,
      interests,
      skills
    };

    localStorage.setItem('connect_grow_user', JSON.stringify(updatedUser));
    router.push('/discover');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Wizard Header Progress Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-500">STEP {step} OF 4</span>
          <span className="font-bold text-indigo-600">
            {step === 1 && 'Basic Profile'}
            {step === 2 && 'Add Interests'}
            {step === 3 && 'Skills & Learning Goals'}
            {step === 4 && 'Choose Goal'}
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full gradient-badge transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Basic Profile */}
      {step === 1 && (
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-200 shadow-lg">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-600" />
              Create Your Profile
            </h2>
            <p className="text-sm text-slate-500">Introduce yourself to potential 60-40 matches.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Alex Rivera"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Headline / Role</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Full-Stack Developer & AI Enthusiast"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Tell potential connections what you work on and what drives you..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Add Interests */}
      {step === 2 && (
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-200 shadow-lg">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet-600" />
              Select Your Interests
            </h2>
            <p className="text-sm text-slate-500">
              Interests account for up to 35% of your <strong>60% Similarity Match Score</strong>.
            </p>
          </div>

          {/* Selected interests tags */}
          <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-xl bg-slate-100/80 border border-slate-200">
            {interests.map((interest) => (
              <span 
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600 text-white shadow-sm"
              >
                {interest}
                <button onClick={() => toggleInterest(interest)} className="hover:text-indigo-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {interests.length === 0 && (
              <span className="text-xs text-slate-400">Click suggested tags below or add custom ones</span>
            )}
          </div>

          {/* Custom Interest Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customInterestInput}
              onChange={(e) => setCustomInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500"
              placeholder="Add custom interest (e.g., Robotics)..."
            />
            <button
              onClick={addCustomInterest}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Suggested List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Interests</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_INTERESTS.map((item) => {
                const isSelected = interests.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Add Skills & Learning Goals */}
      {step === 3 && (
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-200 shadow-lg">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              Add Skills & Learning Goals
            </h2>
            <p className="text-sm text-slate-500">
              Skills you can teach + skills you want to learn fuel the <strong>40% Growth Alignment Score</strong>.
            </p>
          </div>

          {/* Current Skills List */}
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 text-sm">{skill.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      {skill.level}
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {skill.canTeach && (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Can Teach / Share
                      </span>
                    )}
                    {skill.wantsToLearn && (
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Wants to Learn
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeSkill(index)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Skill Form */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="text-xs font-bold text-slate-600 uppercase">Add New Skill</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill name (e.g. Next.js, UI Design)..."
                className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSkillCanTeach}
                  onChange={(e) => setNewSkillCanTeach(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                I can teach / share this skill
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSkillWantsToLearn}
                  onChange={(e) => setNewSkillWantsToLearn(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                I want to learn / improve this skill
              </label>
            </div>

            <button
              onClick={addSkill}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Skill To Profile
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Choose Primary Goal */}
      {step === 4 && (
        <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-200 shadow-lg">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-600" />
              Choose Your Primary Goal
            </h2>
            <p className="text-sm text-slate-500">
              What are you looking to achieve most on ConnectGrow?
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = primaryGoal === goal;
              return (
                <button
                  key={goal}
                  onClick={() => setPrimaryGoal(goal)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">{goal}</div>
                    <div className="text-xs text-slate-500">
                      {goal === 'Skill Exchange' && 'Trade knowledge with peers to grow technical and design competencies.'}
                      {goal === 'Co-Founder Search' && 'Find strategic partners with complementary skillsets to build projects.'}
                      {goal === 'Mentorship & Advice' && 'Connect with experienced industry seniors for guidance.'}
                      {goal === 'Peer Learning' && 'Study together, solve challenges, and share daily learnings.'}
                      {goal === 'Networking & Collaboration' && 'Expand your professional network across domains.'}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Wizard Footer Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : <div />}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2.5 rounded-xl gradient-badge text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-colors"
          >
            Complete Profile & Get Matches
            <Check className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
