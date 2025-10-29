'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: '',
    search: '',
  });
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchCoaches();
  }, [filters, sort]);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.search) params.append('search', filters.search);
      params.append('sort', sort);

      const res = await fetch(`/api/coaches?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCoaches(data);
      }
    } catch (error) {
      console.error('Error fetching coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Coach Directory</h1>

          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Name, club, or team..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  className="input-field"
                  value={filters.level}
                  onChange={(e) =>
                    setFilters({ ...filters, level: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="ECNL">ECNL</option>
                  <option value="MLS Next">MLS Next</option>
                  <option value="E64">E64</option>
                  <option value="NPL">NPL</option>
                  <option value="AYSO">AYSO</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort
                </label>
                <select
                  className="input-field"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="active">Most Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coaches Grid */}
          {loading ? (
            <div className="text-center py-12">Loading coaches...</div>
          ) : coaches.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No coaches found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => (
                <Link
                  key={coach.id}
                  href={`/coaches/${coach.userId}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {coach.media && coach.media[0] && (
                      <img
                        src={coach.media[0].url}
                        alt={coach.firstName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {coach.firstName} {coach.lastName}
                      </h3>
                      <p className="text-gray-600">{coach.club}</p>
                      <p className="text-sm text-gray-500">
                        {coach.teamName} • {coach.level}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

