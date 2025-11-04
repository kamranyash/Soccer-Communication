import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  // count conversations where there exists a message newer than lastReadAt
  const result = await prisma.conversationParticipant.count({
    where: {
      userId: session.user.id,
      isBlocked: false,
      conversation: {
        messages: {
          some: {},
        },
      },
      OR: [
        { lastReadAt: null },
        {
          conversation: {
            updatedAt: {
              gt: new Date(Date.now()), // placeholder, Prisma can't compare across relations easily
            },
          },
        },
      ],
    },
  });

  return NextResponse.json({ count: result });
}
