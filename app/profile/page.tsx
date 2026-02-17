'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

function DeleteAccountButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/profile/delete', {
        method: 'DELETE',
      });

      if (res.ok) {
        // Sign out and redirect
        await signOut({ redirect: false });
        router.push('/?deleted=true');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
      >
        Delete My Account
      </button>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-red-800 mb-2">
        Are you absolutely sure?
      </p>
      <p className="text-sm text-red-700 mb-4">
        This action cannot be undone. Type <strong>DELETE</strong> to confirm:
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Type DELETE to confirm"
        className="input-field mb-3"
      />
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDelete}
          disabled={loading || confirmText !== 'DELETE'}
          className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {loading ? 'Deleting...' : 'Yes, Delete My Account'}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setConfirmText('');
            setError('');
          }}
          disabled={loading}
          className="btn-outline w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

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
            <h1 className="text-xl sm:text-2xl font-bold mb-2">My Profile</h1>
            <p className="text-sm text-gray-600 mb-4">
              {isPlayer ? 'Player Profile' : isCoach ? 'Coach Profile' : 'Visitor Profile'}
            </p>

            {!session.user.emailVerified && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4 text-sm">
                Please verify your email to make your profile visible and unlock messaging.
              </div>
            )}

            <div className="mb-4 flex flex-wrap gap-4">
              <Link href={`/profile/edit`} className="btn-primary w-full sm:w-auto text-center">
                Edit Profile
              </Link>
              {isCoach && (
                <Link href="/posts/my-posts" className="btn-outline w-full sm:w-auto text-center">
                  My Postings
                </Link>
              )}
            </div>

            {profile && (
              <div className="space-y-4">
                {isPlayer && (
                  <>
                    {profile.photoUrl && (
                      <img
                        src={profile.photoUrl}
                        alt="Profile Photo"
                        className="h-24 w-24 rounded-full object-cover mb-4"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">Name</h3>
                      <p>
                        {profile.firstName} {profile.lastName}
                      </p>
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
                      <p>
                        {profile.firstName} {profile.lastName}
                      </p>
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

                {profile.media && profile.media.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Highlight Videos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.media
                        .filter((m: any) => m.type === 'VIDEO')
                        .map((m: any) => (
                          <div key={m.id} className="border rounded-lg p-2 bg-black">
                            <video
                              src={m.url}
                              controls
                              className="w-full h-48 object-cover rounded"
                            />
                            {m.caption && (
                              <p className="mt-1 text-xs text-gray-200">{m.caption}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete Account Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Once you delete your account, there is no going back. All your data, including your profile, messages, and posts will be permanently deleted.
              </p>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

