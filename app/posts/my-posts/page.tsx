'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MyPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user && session.user.role === 'COACH') {
      fetchPosts();
    } else if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else {
      setLoading(false);
    }
  }, [session, status, router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts/mine');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeletingId(postId);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading' || (session && session.user.role !== 'COACH' && !loading)) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>
            {session?.user?.role !== 'COACH'
              ? 'You must be a coach to view this page.'
              : 'Loading...'}
          </div>
        </main>
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">My Postings</h1>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  fetchPosts();
                }}
                disabled={loading}
                className="btn-outline disabled:opacity-50"
              >
                Refresh
              </button>
              <Link href="/posts/create" className="btn-outline">
                Create Post
              </Link>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Manage your tryouts and guest player needs. Edit or delete posts below.
          </p>

          {loading ? (
            <div className="text-center py-12">Loading your posts...</div>
          ) : posts.length === 0 ? (
            <div className="card text-center py-12 text-gray-500">
              <p className="mb-4">You haven&apos;t posted any tryouts or guest player needs yet.</p>
              <Link href="/posts/create" className="btn-primary inline-block">
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-socal-blue text-white text-xs rounded">
                        {post.type === 'TRYOUT' ? 'Tryout' : 'Guest Player'}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          post.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{post.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      {post.date && (
                        <span>📅 {new Date(post.date).toLocaleDateString()}</span>
                      )}
                      {post.region && <span>📍 {post.region}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/posts/${post.id}/edit`}
                      className="btn-outline py-2 px-4 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === post.id ? 'Deleting...' : 'Delete'}
                    </button>
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-socal-blue hover:underline text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
