import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function EmailVerifiedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full card text-center">
          <div className="mb-4">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-gray-600">
              Your email has been successfully verified. You can now access all
              features of SoCal OpenRoster.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/auth/signin" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

