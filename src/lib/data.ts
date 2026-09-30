import { UserProfile, Connection, Message } from '@/types';

export const INITIAL_CURRENT_USER: UserProfile = {
  id: 'user_me',
  name: 'Alex Rivera',
  headline: 'Full-Stack Developer & AI Enthusiast',
  bio: 'Building web applications and exploring LLM integrations. Looking to exchange skills in UI design and learn machine learning pipeline optimization.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  location: 'San Francisco, CA',
  primaryGoal: 'Skill Exchange',
  interests: ['Artificial Intelligence', 'React', 'Startups', 'Web3', 'Product Design'],
  skills: [
    { name: 'TypeScript', level: 'Expert', canTeach: true, wantsToLearn: false },
    { name: 'Next.js', level: 'Expert', canTeach: true, wantsToLearn: false },
    { name: 'UI/UX Design', level: 'Beginner', canTeach: false, wantsToLearn: true },
    { name: 'Machine Learning', level: 'Beginner', canTeach: false, wantsToLearn: true },
    { name: 'Tailwind CSS', level: 'Intermediate', canTeach: true, wantsToLearn: false },
  ],
  joinedDate: 'Sept 2026',
  rating: 4.9,
  connectionCount: 14
};

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Sophia Chen',
    headline: 'Senior UI/UX Designer & Product Thinker',
    bio: 'Obsessed with micro-interactions and accessible design systems. Eager to pick up TypeScript & Next.js backend basics!',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    location: 'New York, NY',
    primaryGoal: 'Skill Exchange',
    interests: ['Product Design', 'React', 'Artificial Intelligence', 'Figma', 'User Research'],
    skills: [
      { name: 'UI/UX Design', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'Figma Systems', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'TypeScript', level: 'Beginner', canTeach: false, wantsToLearn: true },
      { name: 'Next.js', level: 'Beginner', canTeach: false, wantsToLearn: true },
    ],
    joinedDate: 'Aug 2026',
    rating: 5.0,
    connectionCount: 28
  },
  {
    id: 'user_2',
    name: 'Marcus Vance',
    headline: 'AI Research Engineer & Python Developer',
    bio: 'Working on model quantization and fine-tuning. Want to collaborate with full-stack engineers to turn ML models into slick SaaS web apps.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    location: 'Austin, TX',
    primaryGoal: 'Co-Founder Search',
    interests: ['Artificial Intelligence', 'Machine Learning', 'Startups', 'Python', 'LLM Agents'],
    skills: [
      { name: 'Machine Learning', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'Python', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'TypeScript', level: 'Intermediate', canTeach: false, wantsToLearn: true },
      { name: 'Product Design', level: 'Beginner', canTeach: false, wantsToLearn: true },
    ],
    joinedDate: 'July 2026',
    rating: 4.8,
    connectionCount: 42
  },
  {
    id: 'user_3',
    name: 'Elena Rostova',
    headline: 'Tech Growth Lead & Community Strategist',
    bio: 'Helping early-stage startups reach their first 10k users. Looking for tech mentors and product engineers to exchange growth strategies.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    location: 'London, UK',
    primaryGoal: 'Mentorship & Advice',
    interests: ['Startups', 'Growth Marketing', 'Product Design', 'Artificial Intelligence'],
    skills: [
      { name: 'Growth Marketing', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'SEO & Analytics', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'Next.js', level: 'Beginner', canTeach: false, wantsToLearn: true },
    ],
    joinedDate: 'Sept 2026',
    rating: 4.9,
    connectionCount: 19
  },
  {
    id: 'user_4',
    name: 'David Kim',
    headline: 'Frontend Developer & Web3 Creator',
    bio: 'Passionate about frontend performance, animation, and decentralized tech. Seeking peer learning partners for AI integrations.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    location: 'Seattle, WA',
    primaryGoal: 'Peer Learning',
    interests: ['React', 'Web3', 'Tailwind CSS', 'Artificial Intelligence', 'Open Source'],
    skills: [
      { name: 'React', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'Tailwind CSS', level: 'Expert', canTeach: true, wantsToLearn: false },
      { name: 'Machine Learning', level: 'Beginner', canTeach: false, wantsToLearn: true },
    ],
    joinedDate: 'June 2026',
    rating: 4.7,
    connectionCount: 31
  }
];

export const MOCK_INITIAL_CONNECTIONS: Connection[] = [
  {
    id: 'conn_1',
    requesterId: 'user_me',
    receiverId: 'user_1',
    status: 'ACCEPTED',
    createdAt: '2026-09-15T10:00:00Z',
    aiIcebreakers: [
      "Hey Sophia! Notice you're an expert in UI/UX and looking to learn Next.js. I'd love to swap Next.js tips for some design advice!",
      "Hi Sophia! Both of us share a passion for Product Design & React. What's your favorite design system project lately?",
      "Hey Sophia! Would love to get your thoughts on crafting intuitive AI interfaces while helping you ramp up on TypeScript!"
    ]
  }
];

export const MOCK_INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    connectionId: 'conn_1',
    senderId: 'user_me',
    content: "Hey Sophia! Notice you're an expert in UI/UX and looking to learn Next.js. I'd love to swap Next.js tips for some design advice!",
    timestamp: '2026-09-15T10:05:00Z',
    isIcebreaker: true
  },
  {
    id: 'msg_2',
    connectionId: 'conn_1',
    senderId: 'user_1',
    content: "Hi Alex! That sounds like an awesome exchange. I've actually been trying to figure out App Router layouts in Next.js. How can I help with your UI/UX work?",
    timestamp: '2026-09-15T10:12:00Z'
  },
  {
    id: 'msg_3',
    connectionId: 'conn_1',
    senderId: 'user_me',
    content: "Awesome! App Router layout nesting is super clean once you get the handle of server vs client components. I can walk you through an example!",
    timestamp: '2026-09-15T10:15:00Z'
  }
];
