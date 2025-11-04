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

    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile-photos',
          public_id: session.user.id,
          resource_type: 'image',
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result!);
        }
      );
      stream.end(buffer);
    });

    if (session.user.role === 'PLAYER') {
      await prisma.playerProfile.update({
        where: { userId: session.user.id },
        data: { photoUrl: uploadRes.secure_url },
      });
    } else {
      await prisma.coachProfile.update({
        where: { userId: session.user.id },
        data: { photoUrl: uploadRes.secure_url },
      });
    }

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
  }
}
