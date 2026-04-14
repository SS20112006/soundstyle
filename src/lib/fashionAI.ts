import { StyleProfile, MoodProfile, RecommendedItem, OutfitRecommendation } from '@/types';
import { generateStyleTags, StyleTag } from './styleMapper';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ==========================================
// STYLE PROMPT TEMPLATES
// ==========================================

const SYSTEM_PROMPT = `You are an expert fashion stylist and cultural analyst. Your role is to translate music taste into fashion recommendations.

You will receive:
1. A user's Spotify music profile (genres, top artists, audio features)
2. A style profile generated from their music taste
3. Their clothing preferences (if available)

Your task is to recommend specific clothing items that match their musical identity.

IMPORTANT RULES:
- Be specific with item descriptions (not just "shirt" but "oversized black graphic tee with distressed hem")
- Include realistic price ranges
- Suggest real brands when appropriate
- Consider the user's fit preference (oversized, slim, relaxed, etc.)
- Match colors to the provided palette
- Each outfit should have 4-6 items minimum
- Include at least 1 statement piece per outfit

OUTPUT FORMAT (JSON):
{
  "outfits": [
    {
      "name": "Outfit name (e.g., 'Urban Night', 'Festival Ready')",
      "occasion": "When to wear (e.g., 'concert', 'daily', 'date night')",
      "items": [
        {
          "name": "Specific item description",
          "category": "tops|bottoms|shoes|outerwear|accessories",
          "brand": "Brand name or 'Various'",
          "price": 49.99,
          "currency": "EUR",
          "style_tags": ["tag1", "tag2"],
          "colors": ["color1", "color2"]
        }
      ]
    }
  ]
}`;

// ==========================================
// GENERATE OUTFIT RECOMMENDATIONS
// ==========================================

export async function generateOutfitRecommendations(
  styleProfile: StyleProfile,
  moodProfile: MoodProfile,
  topGenres: { genre: string; count: number }[],
  topArtists: string[],
  budget?: 'low' | 'mid' | 'high',
  occasion?: string,
  existingCloset?: { category: string; style: string[]; colors: string[] }[]
): Promise<OutfitRecommendation[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  
  // Build context
  const budgetContext = budget ? getBudgetContext(budget) : '';
  const occasionContext = occasion ? `The user wants outfits for: ${occasion}` : '';
  const closetContext = existingCloset?.length 
    ? `The user already owns these items: ${JSON.stringify(existingCloset)}`
    : '';
  
  const userPrompt = `
## User's Music Profile

**Top Genres:** ${topGenres.map(g => `${g.genre} (${g.count} mentions)`).join(', ')}
**Top Artists:** ${topArtists.join(', ')}

**Audio Features (0-1 scale):**
- Energy: ${moodProfile.energy.toFixed(2)}
- Valence (Positivity): ${moodProfile.valence.toFixed(2)}
- Danceability: ${moodProfile.danceability.toFixed(2)}
- Acousticness: ${moodProfile.acousticness.toFixed(2)}

## Generated Style Profile

**Aesthetic:** ${styleProfile.aesthetic}
**Keywords:** ${styleProfile.keywords.join(', ')}
**Fit Preference:** ${styleProfile.fit}
**Mood:** ${styleProfile.mood}

**Color Palette (${styleProfile.colorPalette.name}):**
- Primary: ${styleProfile.colorPalette.primary}
- Secondary: ${styleProfile.colorPalette.secondary}
- Accent: ${styleProfile.colorPalette.accent}
- Neutral: ${styleProfile.colorPalette.neutral}

**Preferred Clothing Types:** ${styleProfile.clothingTypes.join(', ')}
**Preferred Accessories:** ${styleProfile.accessories.join(', ')}

${budgetContext}
${occasionContext}
${closetContext}

Generate 3 complete outfit recommendations that would appeal to someone with this musical identity. Focus on pieces that express their aesthetic while being wearable.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    return parsed.outfits || [];
  } catch (error) {
    console.error('Error generating outfits:', error);
    throw error;
  }
}

function getBudgetContext(budget: 'low' | 'mid' | 'high'): string {
  switch (budget) {
    case 'low':
      return 'Budget: Low (€10-40 per item). Focus on affordable brands like H&M, Zara, Uniqlo, ASOS.';
    case 'mid':
      return 'Budget: Mid-range (€40-150 per item). Mix of high-street and premium brands like COS, Arket, & Other Stories, Nike, Adidas.';
    case 'high':
      return 'Budget: High (€150+ per item). Include designer and luxury brands like Acne Studios, Off-White, Maison Margiela, Rick Owens.';
  }
}

// ==========================================
// GENERATE MOODBOARD DESCRIPTION
// ==========================================

export async function generateMoodboardPrompt(
  styleProfile: StyleProfile,
  moodProfile: MoodProfile
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `Generate a detailed image prompt for a moodboard that represents this fashion aesthetic.

**Style:** ${styleProfile.aesthetic}
**Mood:** ${styleProfile.mood}
**Keywords:** ${styleProfile.keywords.join(', ')}
**Color Palette:** ${styleProfile.colorPalette.primary}, ${styleProfile.colorPalette.secondary}, ${styleProfile.colorPalette.accent}

**Energy:** ${moodProfile.energy > 0.6 ? 'High' : moodProfile.energy > 0.3 ? 'Medium' : 'Low'}
**Vibe:** ${moodProfile.valence > 0.6 ? 'Positive/Bright' : moodProfile.valence > 0.3 ? 'Balanced' : 'Dark/Intense'}

Create a prompt for an AI image generator that will create a collage-style moodboard with:
- Fashion photography elements
- Texture references
- Color swatches
- Lifestyle imagery that matches the aesthetic
- Abstract artistic elements

Keep the prompt under 200 words. Output ONLY the prompt text.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating moodboard prompt:', error);
    throw error;
  }
}

// ==========================================
// MATCH CLOSET ITEMS TO STYLE
// ==========================================

export async function matchClosetToStyle(
  closetItems: { name: string; category: string; style: string[]; colors: string[]; imageUrl: string }[],
  styleProfile: StyleProfile
): Promise<{ item: typeof closetItems[0]; matchScore: number; reason: string }[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `Analyze these clothing items and rate how well each matches the target style profile.

**Target Style:** ${styleProfile.aesthetic}
**Keywords:** ${styleProfile.keywords.join(', ')}
**Fit Preference:** ${styleProfile.fit}
**Color Palette:** ${styleProfile.colorPalette.primary}, ${styleProfile.colorPalette.secondary}, ${styleProfile.colorPalette.accent}

**User's Closet Items:**
${closetItems.map((item, i) => `${i + 1}. ${item.name} (${item.category}) - Style: ${item.style.join(', ')} - Colors: ${item.colors.join(', ')}`).join('\n')}

For each item, provide:
- matchScore: 0-1 (how well it fits the target style)
- reason: Brief explanation of why it matches or doesn't

Output JSON format:
{
  "matches": [
    { "index": 0, "matchScore": 0.8, "reason": "..." },
    ...
  ]
}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    
    return parsed.matches.map((match: any) => ({
      item: closetItems[match.index],
      matchScore: match.matchScore,
      reason: match.reason,
    }));
  } catch (error) {
    console.error('Error matching closet items:', error);
    throw error;
  }
}

// ==========================================
// GET STYLE DESCRIPTION FOR SHARING
// ==========================================

export async function generateShareableDescription(
  styleProfile: StyleProfile,
  topArtists: string[],
  topGenres: string[]
): Promise<{ title: string; description: string; hashtags: string[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `Create a fun, shareable social media description for someone's Spotify fashion style.

**Their Style:** ${styleProfile.aesthetic}
**Mood:** ${styleProfile.mood}
**Top Artists:** ${topArtists.slice(0, 5).join(', ')}
**Top Genres:** ${topGenres.slice(0, 5).join(', ')}

Generate:
1. A catchy title (max 5 words)
2. A shareable description (max 100 words, fun and engaging)
3. 5 relevant hashtags

Output JSON:
{
  "title": "...",
  "description": "...",
  "hashtags": ["#...", "#...", ...]
}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.9,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating shareable description:', error);
    throw error;
  }
}
