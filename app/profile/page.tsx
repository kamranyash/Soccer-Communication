'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user) {
      fetchProfile();
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const role = session?.user.role.toLowerCase();
      const res = await fetch(`/api/profile/${role}`);
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

  if (status === 'loading' || loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </>
    );
  }

  if (!session) {
    return null;
  }

  const isPlayer = session.user.role === 'PLAYER';
  const isCoach = session.user.role === 'COACH';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card mb-6">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            
            {!session.user.emailVerified && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
                Please verify your email to make your profile visible and unlock messaging.
              </div>
            )}

            <div className="mb-4">
              <Link href={`/profile/edit`} className="btn-primary">
                Edit Profile
              </Link>
            </div>

            {profile && (
              <div className="space-y-4">
                {isPlayer && (
                  <>
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>{profile.firstName} {profile.lastName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Team</h3>
                      <p>{profile.team || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Position</h3>
                      <p>{profile.position || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Level</h3>
                      <p>{profile.level || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Age Group</h3>
                      <p>{profile.ageGroup || 'Not set'}</p>
                    </div>
                    {profile.bio && (
                      <div>
                        <h3 className="font-semibold">Bio</h3>
                        <p>{profile.bio}</p>
                      </div>
                    )}
                  </>
                )}

                {isCoach && (
                  <>
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>{profile.firstName} {profile.lastName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Club</h3>
                      <p>{profile.club || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Team Name</h3>
                      <p>{profile.teamName || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Level</h3>
                      <p>{profile.level || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Record</h3>
                      <p>{profile.record || 'Not set'}</p>
                    </div>
                    {profile.bio && (
                      <div>
                        <h3 className="font-semibold">Bio</h3>
                        <p>{profile.bio}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

