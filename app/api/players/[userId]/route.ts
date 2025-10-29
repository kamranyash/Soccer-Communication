import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await prisma.playerProfile.findUnique({
      where: { userId: params.userId },
      include: {
        media: true,
        user: {
          select: {
            email: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!profile || !profile.isPublic || !profile.user.emailVerified) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching player profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

