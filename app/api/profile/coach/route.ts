import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
      include: { media: true, posts: true, user: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching coach profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.emailVerified) {
      return NextResponse.json(
        { error: 'Email must be verified' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, club, teamName, level, record, contactEmail, contactPhone, bio } = body;

    const profile = await prisma.coachProfile.update({
      where: { userId: session.user.id },
      data: {
        firstName,
        lastName,
        club,
        teamName,
        level,
        record,
        contactEmail,
        contactPhone,
        bio,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating coach profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

