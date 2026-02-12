'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function EditProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    if (!session?.user) return;

    try {
      const role = session.user.role.toLowerCase();
      const res = await fetch(`/api/profile/${role}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const role = session?.user.role.toLowerCase();
      const res = await fetch(`/api/profile/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  const isPlayer = session.user.role === 'PLAYER';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) return;
                    const form = new FormData();
                    form.append('file', e.target.files[0]);

                    const res = await fetch('/api/upload/profile-photo', {
                      method: 'POST',
                      body: form,
                    });
                    if (res.ok) {
                      const { url } = await res.json();
                      setFormData({ ...formData, photoUrl: url });
                    }
                  }}
                />
                {formData.photoUrl && (
                  <img
                    src={formData.photoUrl}
                    className="h-24 w-24 rounded-full object-cover mt-2"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.firstName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.lastName || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              {isPlayer ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.team || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, team: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.position || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      className="input-field"
                      value={formData.level || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                    >
                      <option value="">Select Level</option>
                      <option value="ECNL">ECNL</option>
                      <option value="ECRL">ECRL</option>
                      <option value="MLS Next">MLS Next</option>
                      <option value="E64">E64</option>
                      <option value="NPL">NPL</option>
                      <option value="AYSO">AYSO</option>
                      <option value="USYS">USYS</option>
                      <option value="SCDSL">SCDSL</option>
                      <option value="Coast Soccer">Coast Soccer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age Group (e.g., U12, U14, U16, U18)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.ageGroup || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, ageGroup: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      className="input-field"
                      value={formData.region || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                    >
                      <option value="">Select Region</option>
                      <option value="Los Angeles Area">Los Angeles Area</option>
                      <option value="Orange County">Orange County</option>
                      <option value="Inland Empire">Inland Empire</option>
                      <option value="San Diego County">San Diego County</option>
                      <option value="Central Coast / Ventura">Central Coast / Ventura</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Club
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.club || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, club: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.teamName || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      className="input-field"
                      value={formData.level || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                    >
                      <option value="">Select Level</option>
                      <option value="ECNL">ECNL</option>
                      <option value="ECRL">ECRL</option>
                      <option value="MLS Next">MLS Next</option>
                      <option value="E64">E64</option>
                      <option value="NPL">NPL</option>
                      <option value="AYSO">AYSO</option>
                      <option value="USYS">USYS</option>
                      <option value="SCDSL">SCDSL</option>
                      <option value="Coast Soccer">Coast Soccer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Record
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.record || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, record: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <select
                      className="input-field"
                      value={formData.region || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                    >
                      <option value="">Select Region</option>
                      <option value="Los Angeles Area">Los Angeles Area</option>
                      <option value="Orange County">Orange County</option>
                      <option value="Inland Empire">Inland Empire</option>
                      <option value="San Diego County">San Diego County</option>
                      <option value="Central Coast / Ventura">Central Coast / Ventura</option>
                    </select>
                  </div>
                </>
              )}

              {/* Highlight Videos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highlight Videos
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Upload short clips of your playstyle (MP4 or similar). These will appear on your
                  public profile.
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    if (!e.target.files?.[0]) return;
                    const form = new FormData();
                    form.append('file', e.target.files[0]);

                    const res = await fetch('/api/upload/profile-video', {
                      method: 'POST',
                      body: form,
                    });

                    if (res.ok) {
                      const { url } = await res.json();
                      setFormData((prev: any) => ({
                        ...prev,
                        media: [
                          ...(prev.media || []),
                          { id: url, type: 'VIDEO', url },
                        ],
                      }));
                    }
                  }}
                />

                {formData.media && formData.media.length > 0 && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.media
                      .filter((m: any) => m.type === 'VIDEO')
                      .map((m: any) => (
                        <div key={m.id} className="border rounded-lg p-2 bg-black">
                          <video
                            src={m.url}
                            controls
                            className="w-full h-40 object-cover rounded"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={formData.contactEmail || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  className="input-field"
                  value={formData.contactPhone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.bio || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

