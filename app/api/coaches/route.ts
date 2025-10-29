import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {
      isPublic: true,
      user: {
        emailVerified: { not: null },
      },
    };

    if (level) {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { club: { contains: search, mode: 'insensitive' } },
        { teamName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      sort === 'newest' ? { createdAt: 'desc' } : { updatedAt: 'desc' };

    const coaches = await prisma.coachProfile.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            emailVerified: true,
          },
        },
        media: {
          take: 1,
        },
      },
      orderBy,
    });

    return NextResponse.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coaches' },
      { status: 500 }
    );
  }
}

