import { NextRequest, NextResponse } from 'next/server';

// ==========================================
// UNDESIRED COLORS (GLITTERPOINTS) SYSTEM
// ==========================================

// Note: This API is designed to work with client-side localStorage.
// The server provides the API structure, while actual persistence
// is handled client-side via the request/response pattern.

interface ColorEntry {
  color: string;
  hex: string;
  reason?: string;
  addedAt: string;
}

interface UndesiredColorsData {
  colors: ColorEntry[];
  updatedAt: string;
}

// In-memory store as fallback (for server-side tracking if needed)
// In production, this would be a database
const serverStore = new Map<string, UndesiredColorsData>();

// POST /api/style/colors - Save undesired colors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, colors } = body;

    if (!colors || !Array.isArray(colors)) {
      return NextResponse.json(
        { error: 'Missing required field: colors (array)' },
        { status: 400 }
      );
    }

    const colorEntries: ColorEntry[] = colors.map((c: { color: string; hex: string; reason?: string }) => ({
      color: c.color,
      hex: c.hex,
      reason: c.reason,
      addedAt: new Date().toISOString(),
    }));

    const data: UndesiredColorsData = {
      colors: colorEntries,
      updatedAt: new Date().toISOString(),
    };

    // Store server-side if userId provided
    if (userId) {
      serverStore.set(userId, data);
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Undesired colors saved. Store this data client-side in localStorage.',
    });
  } catch (error) {
    console.error('Error saving undesired colors:', error);
    return NextResponse.json(
      { error: 'Failed to save undesired colors' },
      { status: 500 }
    );
  }
}

// GET /api/style/colors - Retrieve undesired colors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId && serverStore.has(userId)) {
      return NextResponse.json({
        success: true,
        data: serverStore.get(userId),
        source: 'server',
      });
    }

    // Return empty if no data found
    // Client should combine this with their localStorage data
    return NextResponse.json({
      success: true,
      data: {
        colors: [],
        updatedAt: new Date().toISOString(),
      },
      source: 'default',
      message: 'No server data found. Use client-side localStorage for persistence.',
    });
  } catch (error) {
    console.error('Error retrieving undesired colors:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve undesired colors' },
      { status: 500 }
    );
  }
}

// DELETE /api/style/colors - Clear undesired colors
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      serverStore.delete(userId);
    }

    return NextResponse.json({
      success: true,
      message: 'Undesired colors cleared. Also clear client-side localStorage.',
    });
  } catch (error) {
    console.error('Error clearing undesired colors:', error);
    return NextResponse.json(
      { error: 'Failed to clear undesired colors' },
      { status: 500 }
    );
  }
}
