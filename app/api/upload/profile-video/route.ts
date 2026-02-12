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

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const caption = form.get('caption') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    const userId = session.user.id;

    const profile = await prisma.playerProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (profile) {
      await prisma.mediaAsset.create({
        data: {
          userId,
          playerProfileId: profile.id,
          type: 'VIDEO',
          url: uploadRes.secure_url,
          caption: caption || null,
          profileType: 'player',
        },
      });
    }

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}

