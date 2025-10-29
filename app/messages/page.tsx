'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherParticipant = (conversation: any) => {
    if (!conversation.participants) return null;
    return conversation.participants.find(
      (p: any) => p.user.id !== session?.user.id
    );
  };

  const getUserName = (user: any) => {
    if (user.playerProfile) {
      return `${user.playerProfile.firstName} ${user.playerProfile.lastName}`;
    }
    if (user.coachProfile) {
      return `${user.coachProfile.firstName} ${user.coachProfile.lastName}`;
    }
    return user.email;
  };

  if (!session) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>Please sign in to view messages</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>

          {loading ? (
            <div className="text-center py-12">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No messages yet. Start a conversation from a player or coach profile.
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                if (!otherParticipant) return null;

                const lastMessage = conversation.messages?.[0];
                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="card hover:shadow-lg transition-shadow block"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {getUserName(otherParticipant.user)}
                        </h3>
                        {lastMessage && (
                          <p className="text-gray-600 line-clamp-1">
                            {lastMessage.body}
                          </p>
                        )}
                      </div>
                      {lastMessage && (
                        <span className="text-sm text-gray-500">
                          {new Date(lastMessage.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

