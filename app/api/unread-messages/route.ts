import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  const participants = await prisma.conversationParticipant.findMany({
    where: { userId: session.user.id, isBlocked: false },
    select: {
      lastReadAt: true,
      conversation: {
        select: {
          updatedAt: true,
        },
      },
    },
  });

  const unread = participants.filter((p) => {
    if (!p.lastReadAt) return true;
    return p.conversation.updatedAt > p.lastReadAt;
  }).length;

  return NextResponse.json({ count: unread });
}
