import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'PLAYER') {
      return NextResponse.json({ error: 'Only players can upload videos' }, { status: 403 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { error: 'Cloudinary unsigned upload is not configured' },
        { status: 500 },
      );
    }

    return NextResponse.json({ cloudName, uploadPreset });
  } catch (error) {
    console.error('Error fetching Cloudinary config:', error);
    return NextResponse.json({ error: 'Failed to load upload config' }, { status: 500 });
  }
}

