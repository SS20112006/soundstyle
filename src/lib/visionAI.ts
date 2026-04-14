import { ClosetItem } from '@/types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ==========================================
// ANALYZE CLOTHING IMAGE
// ==========================================

export interface ClothingAnalysis {
  name: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear' | 'dresses';
  colors: string[];
  style: string[];
  tags: string[];
  confidence: number;
  description: string;
}

export async function analyzeClothingImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<ClothingAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = `Analyze this clothing item image and provide detailed information.

Identify and return JSON with:
- name: Specific name (e.g., "Black Leather Bomber Jacket")
- category: One of [tops, bottoms, shoes, accessories, outerwear, dresses]
- colors: Array of dominant colors (hex codes)
- style: Array of style tags (e.g., ["streetwear", "minimalist", "vintage"])
- tags: Additional descriptive tags (e.g., ["oversized", "graphic", "summer"])
- confidence: 0-1 score of how confident you are
- description: Brief description of the item

Be specific with colors and styles. If multiple items are visible, focus on the main/center item.

Return ONLY valid JSON.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const textContent = data.candidates[0].content.parts[0].text;
    
    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from Gemini response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error analyzing clothing image:', error);
    throw error;
  }
}

// ==========================================
// ANALYZE MULTIPLE ITEMS
// ==========================================

export async function analyzeMultipleItems(
  images: { base64: string; mimeType: string }[]
): Promise<ClothingAnalysis[]> {
  const results: ClothingAnalysis[] = [];
  
  // Process sequentially to avoid rate limits
  for (const image of images) {
    try {
      const analysis = await analyzeClothingImage(image.base64, image.mimeType);
      results.push(analysis);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      // Continue with other images
    }
  }
  
  return results;
}

// ==========================================
// EXTRACT DOMINANT COLORS FROM IMAGE
// ==========================================

export async function extractColorsFromImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<{ hex: string; name: string; percentage: number }[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = `Analyze this clothing image and extract the dominant colors.

Return JSON with an array of colors:
{
  "colors": [
    { "hex": "#000000", "name": "Black", "percentage": 60 },
    { "hex": "#c0c0c0", "name": "Silver", "percentage": 30 },
    ...
  ]
}

Include up to 5 dominant colors with hex codes and rough percentage of the item.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const textContent = data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return [];
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.colors || [];
  } catch (error) {
    console.error('Error extracting colors:', error);
    return [];
  }
}

// ==========================================
// MATCH ITEM TO STYLE PROFILE
// ==========================================

export async function matchItemToStyle(
  itemAnalysis: ClothingAnalysis,
  targetStyle: string,
  targetKeywords: string[]
): Promise<{ matchScore: number; reason: string; suggestions: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = `Rate how well this clothing item matches the target style.

**Item:** ${itemAnalysis.name}
**Category:** ${itemAnalysis.category}
**Detected Style:** ${itemAnalysis.style.join(', ')}
**Tags:** ${itemAnalysis.tags.join(', ')}

**Target Style:** ${targetStyle}
**Target Keywords:** ${targetKeywords.join(', ')}

Provide:
- matchScore: 0-1
- reason: Brief explanation
- suggestions: Array of 2-3 style suggestions to make this item work better

Return JSON:
{
  "matchScore": 0.85,
  "reason": "The dark color and leather material align well with...",
  "suggestions": ["Pair with...", "Would work better if..."]
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const textContent = data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return { matchScore: 0.5, reason: 'Could not analyze', suggestions: [] };
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error matching item to style:', error);
    return { matchScore: 0.5, reason: 'Analysis failed', suggestions: [] };
  }
}

// ==========================================
// VALIDATE IMAGE IS CLOTHING
// ==========================================

export async function validateClothingImage(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<{ isValid: boolean; reason: string; detectedItem?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const prompt = `Is this image of a clothing/fashion item? 

Respond with JSON:
{
  "isValid": true/false,
  "reason": "Brief explanation",
  "detectedItem": "What you see (if valid)"
}

Only return true if the image clearly shows clothing, shoes, or fashion accessories.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 200,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Gemini API error');
    }

    const data = await response.json();
    const textContent = data.candidates[0].content.parts[0].text;
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return { isValid: false, reason: 'Could not analyze image' };
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error validating image:', error);
    return { isValid: false, reason: 'Analysis failed' };
  }
}
