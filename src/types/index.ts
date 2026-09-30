export type GoalType = 
  | 'Skill Exchange'
  | 'Co-Founder Search'
  | 'Mentorship & Advice'
  | 'Peer Learning'
  | 'Networking & Collaboration';

export interface UserSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  canTeach: boolean;
  wantsToLearn: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatar: string;
  location: string;
  primaryGoal: GoalType;
  interests: string[];
  skills: UserSkill[];
  joinedDate: string;
  rating?: number;
  connectionCount?: number;
}

export interface MatchScore {
  totalMatch: number; // 0 to 100
  similarityScore: number; // 0 to 60 component
  growthScore: number; // 0 to 40 component
  sharedInterests: string[];
  sharedSkills: string[];
  learnableSkills: string[]; // Skills User B knows that User A wants to learn
  goalSynergy: string;
}

export interface MatchResult {
  user: UserProfile;
  score: MatchScore;
}

export interface Connection {
  id: string;
  requesterId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  aiIcebreakers?: string[];
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isIcebreaker?: boolean;
}

export interface ConnectionFeedback {
  id: string;
  connectionId: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5
  learnedSomething: boolean;
  skillsEndorsed: string[];
  comment: string;
  createdAt: string;
}
