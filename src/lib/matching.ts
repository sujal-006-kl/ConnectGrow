import { UserProfile, MatchScore } from '@/types';

export function calculateMatchScore(userA: UserProfile, userB: UserProfile): MatchScore {
  // 1. Calculate 60% SIMILARITY SCORE (Common Ground)
  // Shared Interests
  const setAInterests = new Set(userA.interests.map(i => i.toLowerCase().trim()));
  const sharedInterests = userB.interests.filter(i => setAInterests.has(i.toLowerCase().trim()));
  
  const interestSimilarityRatio = userA.interests.length > 0 
    ? sharedInterests.length / Math.max(userA.interests.length, userB.interests.length) 
    : 0;
  
  // Shared Skills (skills both possess)
  const userASkillNames = userA.skills.map(s => s.name.toLowerCase().trim());
  const userBSkillNames = userB.skills.map(s => s.name.toLowerCase().trim());
  
  const sharedSkills = userB.skills
    .filter(s => userASkillNames.includes(s.name.toLowerCase().trim()))
    .map(s => s.name);

  const skillSimilarityRatio = userASkillNames.length > 0 
    ? sharedSkills.length / Math.max(userASkillNames.length, userBSkillNames.length) 
    : 0;

  // Similarity component (out of 60 points max)
  // 35 points max from interests, 25 points max from shared skills
  const interestPoints = Math.min(35, Math.round(interestSimilarityRatio * 45));
  const skillPoints = Math.min(25, Math.round(skillSimilarityRatio * 35));
  const similarityScore = Math.min(60, interestPoints + skillPoints);

  // 2. Calculate 40% GROWTH ALIGNMENT SCORE (Complementary Synergies)
  // Check skill exchange: User A wants to learn what User B can teach
  const userAWantsToLearn = userA.skills.filter(s => s.wantsToLearn).map(s => s.name.toLowerCase().trim());
  const userBCanTeach = userB.skills.filter(s => s.canTeach).map(s => s.name.toLowerCase().trim());
  
  const learnableSkillsForA = userB.skills
    .filter(s => s.canTeach && userAWantsToLearn.includes(s.name.toLowerCase().trim()))
    .map(s => s.name);

  // Check reverse skill exchange: User B wants to learn what User A can teach
  const userBWantsToLearn = userB.skills.filter(s => s.wantsToLearn).map(s => s.name.toLowerCase().trim());
  const userACanTeach = userA.skills.filter(s => s.canTeach).map(s => s.name.toLowerCase().trim());
  
  const learnableSkillsForB = userA.skills
    .filter(s => s.canTeach && userBWantsToLearn.includes(s.name.toLowerCase().trim()))
    .map(s => s.name);

  const allLearnableSkills = Array.from(new Set([...learnableSkillsForA, ...learnableSkillsForB]));

  // Skill Exchange Score (up to 25 points out of 40)
  let skillExchangePoints = 0;
  if (learnableSkillsForA.length > 0 && learnableSkillsForB.length > 0) {
    // Mutual high-value skill exchange!
    skillExchangePoints = 25;
  } else if (learnableSkillsForA.length > 0 || learnableSkillsForB.length > 0) {
    // One-way learning exchange
    skillExchangePoints = 18;
  } else if (allLearnableSkills.length > 0) {
    skillExchangePoints = 12;
  } else {
    skillExchangePoints = 5;
  }

  // Goal Synergy (up to 15 points out of 40)
  let goalPoints = 10;
  let goalSynergy = 'General networking & learning exchange';

  if (userA.primaryGoal === userB.primaryGoal) {
    goalPoints = 15;
    goalSynergy = `Perfect match for ${userA.primaryGoal}`;
  } else if (
    (userA.primaryGoal === 'Skill Exchange' && userB.primaryGoal === 'Peer Learning') ||
    (userA.primaryGoal === 'Co-Founder Search' && userB.primaryGoal === 'Networking & Collaboration') ||
    (userA.primaryGoal === 'Mentorship & Advice' && userB.primaryGoal === 'Skill Exchange')
  ) {
    goalPoints = 14;
    goalSynergy = `High synergy between ${userA.primaryGoal} and ${userB.primaryGoal}`;
  }

  const growthScore = Math.min(40, skillExchangePoints + goalPoints);

  // 3. Total Match Score (0 - 100%)
  const totalMatch = Math.min(100, Math.max(15, similarityScore + growthScore));

  return {
    totalMatch,
    similarityScore,
    growthScore,
    sharedInterests,
    sharedSkills,
    learnableSkills: allLearnableSkills,
    goalSynergy
  };
}
