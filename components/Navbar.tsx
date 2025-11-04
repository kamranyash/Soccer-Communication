'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import useUnread from '@/hooks/useUnread';

export default function Navbar() {
  const { data: session, status } = useSession();
  const unread = useUnread();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-socal-blue">
              SoCal <span className="text-socal-red">OpenRoster</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/players" className="text-gray-700 hover:text-socal-blue">
              Players
            </Link>
            <Link href="/coaches" className="text-gray-700 hover:text-socal-blue">
              Coaches
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-socal-blue">
              Tryouts & Needs
            </Link>

            {status === 'loading' ? (
              <div className="animate-pulse">...</div>
            ) : session ? (
              <>
                <Link href="/messages" className="relative text-gray-700 hover:text-socal-blue">
                  Messages
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-3 h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-socal-blue">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-socal-red"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="btn-outline">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

