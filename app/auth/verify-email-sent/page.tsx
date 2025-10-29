import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function VerifyEmailSentPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full card text-center">
          <div className="mb-4">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600">
              We've sent a verification link to your email address. Please click
              the link to verify your account.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/auth/signin" className="btn-primary">
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

