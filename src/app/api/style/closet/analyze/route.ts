import { NextRequest, NextResponse } from 'next/server';
import { analyzeClothingImage, validateClothingImage, extractColorsFromImage } from '@/lib/visionAI';

// POST /api/style/closet/analyze - Analyze a clothing image
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF.' },
        { status: 400 }
      );
    }
    
    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    // First validate it's actually clothing
    const validation = await validateClothingImage(base64, file.type);
    
    if (!validation.isValid) {
      return NextResponse.json({
        error: 'Image does not appear to be a clothing item',
        reason: validation.reason,
      }, { status: 400 });
    }
    
    // Analyze the clothing
    const analysis = await analyzeClothingImage(base64, file.type);
    
    // Extract colors
    const colors = await extractColorsFromImage(base64, file.type);
    
    return NextResponse.json({
      analysis,
      colors,
      validation,
    });
  } catch (error) {
    console.error('Error analyzing clothing:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
