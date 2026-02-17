'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

function formatDateTimeLocal(date: Date | string | null): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditPostPage() {
  const params = useParams();
  const postId = params.postId as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    type: 'TRYOUT',
    title: '',
    description: '',
    date: '',
    location: '',
    region: '',
    needs: '',
    status: 'active',
  });

  useEffect(() => {
    if (!session?.user || session.user.role !== 'COACH') return;
    fetchPost();
  }, [session, postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.coachUserId !== session?.user?.id) {
          router.push('/posts/my-posts');
          return;
        }
        setFormData({
          type: data.type,
          title: data.title,
          description: data.description,
          date: formatDateTimeLocal(data.date),
          location: data.location || '',
          region: data.region || '',
          needs: data.needs || '',
          status: data.status || 'active',
        });
      } else {
        router.push('/posts/my-posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/posts/my-posts');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push('/posts/my-posts');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!session || session.user.role !== 'COACH') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="card">You must be a coach to edit posts.</div>
        </main>
      </>
    );
  }

  if (fetching) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <Link
              href="/posts/my-posts"
              className="text-socal-blue hover:underline mb-4 inline-block"
            >
              ← Back to My Postings
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Edit Post</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                <select
                  className="input-field"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="TRYOUT">Tryout</option>
                  <option value="GUEST_PLAYER">Looking for Guest Player</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  className="input-field"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                >
                  <option value="">Select Region</option>
                  <option value="Los Angeles Area">Los Angeles Area</option>
                  <option value="Orange County">Orange County</option>
                  <option value="Inland Empire">Inland Empire</option>
                  <option value="San Diego County">San Diego County</option>
                  <option value="Central Coast / Ventura">Central Coast / Ventura</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Needs / Requirements
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.needs}
                  onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
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
                <Link href="/posts/my-posts" className="btn-outline text-center">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
