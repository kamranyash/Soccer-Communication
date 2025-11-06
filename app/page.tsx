import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-socal-blue to-socal-red text-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
              Connect Players & Coaches
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 px-4">
              The premier platform for Southern California soccer talent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="/auth/signup" className="bg-white text-socal-blue px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-center">
                Get Started
              </Link>
              <Link href="/players" className="bg-transparent border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition text-center">
                Browse Players
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-600">
                  Players showcase their skills, level, and highlights. Coaches display team info and needs.
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Discover Talent</h3>
                <p className="text-gray-600">
                  Search by age group, level, position, and more to find the perfect match.
                </p>
              </div>
              <div className="card text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">Connect & Message</h3>
                <p className="text-gray-600">
                  Build connections through our in-platform messaging system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">
              Join SoCal OpenRoster today and start connecting with the soccer community
            </p>
            <Link href="/auth/signup" className="btn-primary inline-block">
              Sign Up Free
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

