'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PLAYER' as 'PLAYER' | 'COACH',
    region: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          region: formData.region,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }

      router.push('/auth/verify-email-sent');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 card">
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join SoCal OpenRoster to connect with players and coaches
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field mt-1 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="input-field mt-1 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="PLAYER"
                    checked={formData.role === 'PLAYER'}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as 'PLAYER' | 'COACH' })
                    }
                    className="mr-2"
                  />
                  Player
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="COACH"
                    checked={formData.role === 'COACH'}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as 'PLAYER' | 'COACH' })
                    }
                    className="mr-2"
                  />
                  Coach
                </label>
              </div>
            </div>

            {formData.role === 'COACH' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <select
                  required={formData.role === 'COACH'}
                  className="input-field"
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                >
                  <option value="">Select Region</option>
                  <option value="Los Angeles Area">Los Angeles Area</option>
                  <option value="Orange County">Orange County</option>
                  <option value="Inland Empire">Inland Empire</option>
                  <option value="San Diego County">San Diego County</option>
                  <option value="Central Coast / Ventura">Central Coast / Ventura</option>
                </select>
                {formData.region === 'Los Angeles Area' && (
                  <p className="text-xs text-gray-500 mt-1">Includes: West LA, South Bay, San Fernando Valley, Pasadena, Glendale, Palos Verdes</p>
                )}
                {formData.region === 'Orange County' && (
                  <p className="text-xs text-gray-500 mt-1">Includes: Irvine, Anaheim, Huntington Beach, Newport Beach, Mission Viejo, Laguna Niguel</p>
                )}
                {formData.region === 'Inland Empire' && (
                  <p className="text-xs text-gray-500 mt-1">Includes: Riverside, San Bernardino, Corona, Temecula, Murrieta, Redlands</p>
                )}
                {formData.region === 'San Diego County' && (
                  <p className="text-xs text-gray-500 mt-1">Includes: Carlsbad, Encinitas, La Jolla, Chula Vista, Escondido</p>
                )}
                {formData.region === 'Central Coast / Ventura' && (
                  <p className="text-xs text-gray-500 mt-1">Includes: Santa Barbara, Oxnard, Ventura, Thousand Oaks, Simi Valley</p>
                )}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-socal-blue hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

