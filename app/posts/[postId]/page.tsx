'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params.postId as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
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

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div>Post not found</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <Link
              href="/posts"
              className="text-socal-blue hover:underline mb-4 inline-block"
            >
              ← Back to Posts
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-socal-blue text-white text-xs rounded">
                {post.type === 'TRYOUT' ? 'Tryout' : 'Guest Player'}
              </span>
              <span className="text-sm text-gray-500">
                {post.coach.club} • {post.coach.level}
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

            <div className="space-y-4 mb-6">
              {post.date && (
                <div>
                  <h3 className="font-semibold text-gray-700">Date</h3>
                  <p className="text-gray-600">
                    {new Date(post.date).toLocaleString()}
                  </p>
                </div>
              )}

              {post.location && (
                <div>
                  <h3 className="font-semibold text-gray-700">Location</h3>
                  <p className="text-gray-600">{post.location}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {post.description}
                </p>
              </div>

              {post.needs && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Specific Needs / Requirements
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {post.needs}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Link
                href={`/coaches/${post.coach.userId}`}
                className="text-socal-blue hover:underline"
              >
                View Coach Profile →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

