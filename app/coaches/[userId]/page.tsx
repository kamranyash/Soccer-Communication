'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function CoachProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/coaches/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!session) {
      window.location.href = '/auth/signin';
      return;
    }

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: userId }),
      });

      if (res.ok) {
        const conversation = await res.json();
        window.location.href = `/messages/${conversation.id}`;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>Profile not found</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-gray-600 text-lg">{profile.club}</p>
                <p className="text-gray-500">
                  {profile.teamName} • {profile.level}
                </p>
                {profile.record && (
                  <p className="text-gray-500">Record: {profile.record}</p>
                )}
              </div>
              {session && session.user.id !== userId && (
                <button onClick={handleMessage} className="btn-primary">
                  Message
                </button>
              )}
            </div>

            {profile.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {profile.contactEmail && (
                <div>
                  <h3 className="font-semibold text-gray-700">Contact Email</h3>
                  <p className="text-gray-600">{profile.contactEmail}</p>
                </div>
              )}
              {profile.contactPhone && (
                <div>
                  <h3 className="font-semibold text-gray-700">Contact Phone</h3>
                  <p className="text-gray-600">{profile.contactPhone}</p>
                </div>
              )}
            </div>

            {profile.posts && profile.posts.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <div className="space-y-4">
                  {profile.posts.map((post: any) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-socal-blue text-white text-xs rounded">
                          {post.type === 'TRYOUT' ? 'Tryout' : 'Guest Player'}
                        </span>
                        <h3 className="font-semibold">{post.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

