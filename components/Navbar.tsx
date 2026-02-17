'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import useUnread from '@/hooks/useUnread';

export default function Navbar() {
  const { data: session, status } = useSession();
  const unread = useUnread();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-socal-blue">
              SoCal <span className="text-socal-red">Open Roster</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/players" className="text-gray-700 hover:text-socal-blue">
              Players
            </Link>
            <Link href="/coaches" className="text-gray-700 hover:text-socal-blue">
              Coaches
            </Link>
            <Link href="/posts" className="text-gray-700 hover:text-socal-blue">
              Tryouts & Needs
            </Link>
            {session?.user?.role === 'COACH' && (
              <Link href="/posts/my-posts" className="text-gray-700 hover:text-socal-blue">
                My Postings
              </Link>
            )}
            <Link href="/contact" className="text-gray-700 hover:text-socal-blue">
              Contact
            </Link>

            {status === 'loading' ? (
              <div className="animate-pulse">...</div>
            ) : session ? (
              <>
                <Link href="/messages" className="relative text-gray-700 hover:text-socal-blue">
                  Messages
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] leading-none" style={{ minWidth: '16px', height: '16px', padding: '0 4px' }}>
                      {unread > 99 ? '99+' : unread}
                    </span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-socal-blue hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/players"
              className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Players
            </Link>
            <Link
              href="/coaches"
              className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Coaches
            </Link>
            <Link
              href="/posts"
              className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tryouts & Needs
            </Link>
            {session?.user?.role === 'COACH' && (
              <Link
                href="/posts/my-posts"
                className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Postings
              </Link>
            )}
            <Link
              href="/contact"
              className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {status === 'loading' ? (
              <div className="px-2 py-2 animate-pulse">...</div>
            ) : session ? (
              <>
                <Link
                  href="/messages"
                  className="relative block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Messages
                  {unread > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-2 py-0.5">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-2 text-gray-700 hover:text-socal-red hover:bg-gray-50 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-2 py-2 text-gray-700 hover:text-socal-blue hover:bg-gray-50 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-2 py-2 text-socal-blue hover:bg-gray-50 rounded font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

