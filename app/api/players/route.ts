import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ageGroup = searchParams.get('ageGroup');
    const level = searchParams.get('level');
    const position = searchParams.get('position');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {
      isPublic: true,
      user: {
        emailVerified: { not: null },
      },
    };

    if (ageGroup) {
      where.ageGroup = ageGroup;
    }

    if (level) {
      where.level = level;
    }

    if (position) {
      where.position = position;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { team: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any =
      sort === 'newest' ? { createdAt: 'desc' } : { updatedAt: 'desc' };

    const players = await prisma.playerProfile.findMany({
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

    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

