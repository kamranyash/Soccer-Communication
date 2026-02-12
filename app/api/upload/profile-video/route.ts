import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'PLAYER') {
      return NextResponse.json(
        { error: 'Only players can upload videos' },
        { status: 403 },
      );
    }

    const contentType = req.headers.get('content-type') || '';

    let videoUrl: string | null = null;
    let caption: string | null = null;

    if (contentType.includes('application/json')) {
      // Client already uploaded to Cloudinary and is sending us the URL
      const body = await req.json();
      videoUrl = body.url ?? null;
      caption = body.caption ?? null;

      if (!videoUrl || typeof videoUrl !== 'string') {
        return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      if (!cloudName || !videoUrl.includes(`res.cloudinary.com/${cloudName}`)) {
        return NextResponse.json({ error: 'Invalid video URL' }, { status: 400 });
      }
    } else {
      // Fallback: server-side upload (may be limited by function body size)
      const form = await req.formData();
      const file = form.get('file') as File | null;
      caption = (form.get('caption') as string | null) ?? null;

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const maxBytes = 4 * 1024 * 1024; // ~4MB safety limit for serverless body size
      if (file.size > maxBytes) {
        return NextResponse.json(
          { error: 'Video is too large to upload via server. Please use a smaller file.' },
          { status: 413 },
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'profile-videos',
            resource_type: 'video',
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result!);
          },
        );
        stream.end(buffer);
      });

      videoUrl = uploadRes.secure_url;
    }

    const userId = session.user.id;

    const profile = await prisma.playerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Player profile not found for this user' },
        { status: 404 },
      );
    }

    await prisma.mediaAsset.create({
      data: {
        userId,
        playerProfileId: profile.id,
        type: 'VIDEO',
        url: videoUrl!,
        caption: caption || null,
        profileType: 'player',
      },
    });

    return NextResponse.json({ url: videoUrl });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}

