import { UserProfile, MatchScore } from '@/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateAIIcebreakers(
  userA: UserProfile, 
  userB: UserProfile, 
  matchScore: MatchScore
): Promise<string[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are ConnectGrow's AI Icebreaker Assistant. Generate 3 engaging, personalized, professional yet warm introductory lines for User A (${userA.name}) to start a conversation with User B (${userB.name}).

User A Profile:
- Headline: ${userA.headline}
- Interests: ${userA.interests.join(', ')}
- Goal: ${userA.primaryGoal}

User B Profile:
- Headline: ${userB.headline}
- Bio: ${userB.bio}
- Interests: ${userB.interests.join(', ')}
- Goal: ${userB.primaryGoal}

Match Synergy:
- Overall Match: ${matchScore.totalMatch}% (Similarity: ${matchScore.similarityScore}/60, Growth Synergy: ${matchScore.growthScore}/40)
- Shared Interests: ${matchScore.sharedInterests.join(', ') || 'Tech & Growth'}
- Skill Exchange Opportunities: ${matchScore.learnableSkills.join(', ') || 'Product Development'}

Return ONLY a JSON array containing exactly 3 distinct icebreaker strings.
Example format:
["Hey Sophia! I noticed you are an expert in UI/UX...", "Hi Sophia! We both love React...", "Hey! I'd love to connect on..."]
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean JSON formatting
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, 3);
      }
    } catch (err) {
      console.warn('Gemini API call skipped or failed, using smart engine fallback:', err);
    }
  }

  // Smart Offline Fallback Generator
  return generateFallbackIcebreakers(userA, userB, matchScore);
}

function generateFallbackIcebreakers(
  userA: UserProfile, 
  userB: UserProfile, 
  matchScore: MatchScore
): string[] {
  const firstNameB = userB.name.split(' ')[0];
  const icebreakers: string[] = [];

  // Icebreaker 1: Skill Exchange / Growth Focus
  if (matchScore.learnableSkills.length > 0) {
    const mainSkill = matchScore.learnableSkills[0];
    icebreakers.push(
      `Hey ${firstNameB}! I saw your impressive experience in ${mainSkill}. I'd love to learn more about your workflow while sharing some of my background in ${userA.interests[0] || 'tech'}!`
    );
  } else {
    icebreakers.push(
      `Hi ${firstNameB}! I'd love to connect and exchange ideas on ${userB.interests[0] || 'projects'} and ${userA.interests[0] || 'innovation'}.`
    );
  }

  // Icebreaker 2: Common Ground / Shared Interest Focus
  if (matchScore.sharedInterests.length > 0) {
    const commonTopic = matchScore.sharedInterests[0];
    icebreakers.push(
      `Hey ${firstNameB}! Looks like we're both really passionate about ${commonTopic}. What's the most exciting project you've worked on recently?`
    );
  } else {
    icebreakers.push(
      `Hey ${firstNameB}! Your headline "${userB.headline}" caught my attention. I'd love to hear more about what you're currently building!`
    );
  }

  // Icebreaker 3: Goal Synergy / Collaborative Focus
  icebreakers.push(
    `Hi ${firstNameB}! We have a ${matchScore.totalMatch}% compatibility match on ConnectGrow for ${userB.primaryGoal}. Would love to grab a virtual coffee chat!`
  );

  return icebreakers;
}
