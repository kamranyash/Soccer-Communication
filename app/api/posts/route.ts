import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const region = searchParams.get('region');
    const search = searchParams.get('search');

    const where: any = {
      status: 'active',
      coach: {
        isPublic: true,
        user: {
          emailVerified: { not: null },
        },
      },
    };

    if (type) {
      where.type = type;
    }

    if (level || region) {
      where.coach = {
        ...where.coach,
        ...(level && { level: level }),
        ...(region && { region: region }),
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        coach: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        media: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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
    const { type, title, description, date, location, needs } = body;

    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!coachProfile) {
      return NextResponse.json(
        { error: 'Coach profile not found' },
        { status: 404 }
      );
    }

    const post = await prisma.post.create({
      data: {
        coachUserId: coachProfile.userId,
        type,
        title,
        description,
        date: date ? new Date(date) : null,
        location,
        needs,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

