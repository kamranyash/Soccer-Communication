import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  // simple unread: conversations where lastReadAt is null
  const count = await prisma.conversationParticipant.count({
    where: {
      userId: session.user.id,
      isBlocked: false,
      lastReadAt: null,
    },
  });

  return NextResponse.json({ count });
}
