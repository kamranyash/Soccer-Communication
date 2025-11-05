'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    ageGroup: '',
    level: '',
    position: '',
    region: '',
    search: '',
  });
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchPlayers();
  }, [filters, sort]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);
      if (filters.level) params.append('level', filters.level);
      if (filters.position) params.append('position', filters.position);
      if (filters.region) params.append('region', filters.region);
      if (filters.search) params.append('search', filters.search);
      params.append('sort', sort);

      const res = await fetch(`/api/players?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Player Directory</h1>

          {/* Filters */}
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Name or team..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group
                </label>
                <select
                  className="input-field"
                  value={filters.ageGroup}
                  onChange={(e) =>
                    setFilters({ ...filters, ageGroup: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="U12">U12</option>
                  <option value="U14">U14</option>
                  <option value="U16">U16</option>
                  <option value="U18">U18</option>
                  <option value="U19">U19</option>
                </select>
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
                  Region
                </label>
                <select
                  className="input-field"
                  value={filters.region}
                  onChange={(e) =>
                    setFilters({ ...filters, region: e.target.value })
                  }
                >
                  <option value="">All</option>
                  <option value="Los Angeles Area">Los Angeles Area</option>
                  <option value="Orange County">Orange County</option>
                  <option value="Inland Empire">Inland Empire</option>
                  <option value="San Diego County">San Diego County</option>
                  <option value="Central Coast / Ventura">Central Coast / Ventura</option>
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

          {/* Players Grid */}
          {loading ? (
            <div className="text-center py-12">Loading players...</div>
          ) : players.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No players found matching your criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <Link
                  key={player.id}
                  href={`/players/${player.userId}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {(player.photoUrl || (player.media && player.media[0])) && (
                      <img
                        src={player.photoUrl || player.media[0].url}
                        alt={player.firstName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {player.firstName} {player.lastName}
                      </h3>
                      <p className="text-gray-600">{player.team}</p>
                      <p className="text-sm text-gray-500">
                        {player.position} • {player.ageGroup} • {player.level}
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

