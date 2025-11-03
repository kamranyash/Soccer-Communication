'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';

export default function PlayerProfilePage() {
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
      const res = await fetch(`/api/players/${userId}`);
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

    // Create or get conversation
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: userId }),
      });

      if (res.ok) {
        const conversation = await res.json();
        window.location.href = `/messages/${conversation.id}`;
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to start conversation');
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
              <div className="flex gap-4">
                {profile.photoUrl && (
                  <img
                    src={profile.photoUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-gray-600 text-lg">{profile.team}</p>
                  <p className="text-gray-500">
                    {profile.position} • {profile.ageGroup} • {profile.level}
                  </p>
                </div>
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

            {profile.media && profile.media.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Media</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.media.map((media: any) => (
                    <div key={media.id}>
                      {media.type === 'IMAGE' ? (
                        <img
                          src={media.url}
                          alt={media.caption || 'Media'}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-socal-blue hover:underline"
                        >
                          {media.caption || 'View Link'}
                        </a>
                      )}
                    </div>
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

