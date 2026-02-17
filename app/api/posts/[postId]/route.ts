import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      include: {
        coach: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                emailVerified: true,
              },
            },
          },
        },
        media: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const isOwner = session?.user?.role === 'COACH' && post.coachUserId === session.user.id;
    if (!isOwner && post.status !== 'active') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

async function ensureCoachOwnsPost(postId: string, coachUserId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { coachUserId: true },
  });
  if (!post || post.coachUserId !== coachUserId) {
    return null;
  }
  return post;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const owned = await ensureCoachOwnsPost(params.postId, session.user.id);
    if (!owned) {
      return NextResponse.json({ error: 'Post not found or access denied' }, { status: 404 });
    }

    const body = await req.json();
    const { type, title, description, date, location, region, needs, status } = body;

    const post = await prisma.post.update({
      where: { id: params.postId },
      data: {
        ...(type !== undefined && { type }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
        ...(location !== undefined && { location }),
        ...(region !== undefined && { region }),
        ...(needs !== undefined && { needs }),
        ...(status !== undefined && { status }),
      },
      include: {
        coach: { select: { firstName: true, lastName: true, club: true, level: true } },
        media: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'COACH') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const owned = await ensureCoachOwnsPost(params.postId, session.user.id);
    if (!owned) {
      return NextResponse.json({ error: 'Post not found or access denied' }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id: params.postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

