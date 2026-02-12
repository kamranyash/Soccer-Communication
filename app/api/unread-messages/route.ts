import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  const userId = session.user.id;

  // For each conversation the user participates in, fetch the most recent
  // message and compare it against lastReadAt. Only count it as unread when:
  // - there is at least one message
  // - the last message was sent by someone else
  // - and it is newer than lastReadAt (or lastReadAt is null)
  const participants = await prisma.conversationParticipant.findMany({
    where: { userId, isBlocked: false },
    select: {
      lastReadAt: true,
      conversation: {
        select: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              senderUserId: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  const unread = participants.filter((p) => {
    const lastMessage = p.conversation.messages[0];
    if (!lastMessage) return false; // no messages => nothing to read
    if (lastMessage.senderUserId === userId) return false; // own last message shouldn't count

    if (!p.lastReadAt) return true;
    return lastMessage.createdAt > p.lastReadAt;
  }).length;

  return NextResponse.json({ count: unread });
}
