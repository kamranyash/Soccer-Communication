import Link from 'next/link';

export default function VerifiedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg px-8 py-10 max-w-md w-full text-center">
        <div className="text-green-600 text-5xl mb-4">✔️</div>
        <h1 className="text-3xl font-bold mb-2 text-green-700">Account Verified!</h1>
        <p className="mb-6 text-gray-700">You can now sign in.</p>
        <Link href="/auth/signin">
          <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition">Sign In</span>
        </Link>
      </div>
    </main>
  );
}
