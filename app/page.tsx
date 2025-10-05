'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { useApplications } from '@/lib/hooks/useApplications';
import { useChallenge } from '@/lib/hooks/useChallenge';
import PublicHeader from '@/components/layout/PublicHeader';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import ApplicationList from '@/components/application/ApplicationList';
import { Trophy, Activity, Target, Users } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function Home() {
  const { currentUser } = useAuth();
  const { users, loading: leaderboardLoading } = useLeaderboard();
  const { applications, loading: appsLoading } = useApplications();
  const { currentChallenge } = useChallenge();

  const recentApplications = applications.slice(0, 10);
  const totalApplications = applications.length;
  const activeUsers = users.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Track Your Job Search Journey
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Stay motivated, compete with friends, and reach your goals
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">{totalApplications}</div>
              <div className="text-blue-100">Total Applications</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">{activeUsers}</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold">
                {currentChallenge?.targetCount || 100}
              </div>
              <div className="text-blue-100">Challenge Goal</div>
            </div>
          </div>

          {!currentUser && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="large" className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-700 dark:hover:bg-white">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button size="large" variant="secondary" className="border-white text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Leaderboard
                </h2>
              </div>
              {currentUser && (
                <Link href="/leaderboard">
                  <Button variant="secondary" size="small">
                    View Full Leaderboard
                  </Button>
                </Link>
              )}
            </div>

            {leaderboardLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {currentChallenge && (
                  <Card className="mb-6 bg-blue-600 dark:bg-blue-700 text-white border-blue-700 dark:border-blue-600">
                    <div className="flex items-center space-x-3">
                      <Target className="w-6 h-6" />
                      <div>
                        <h3 className="font-bold text-lg">{currentChallenge.name}</h3>
                        <p className="text-blue-100 text-sm">{currentChallenge.description}</p>
                      </div>
                    </div>
                  </Card>
                )}
                <LeaderboardTable
                  users={users}
                  currentUserId={currentUser?.uid}
                  targetCount={currentChallenge?.targetCount || 100}
                />
              </>
            )}
          </div>

          {/* Recent Activity Sidebar */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Recent Activity
              </h2>
            </div>

            {appsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <ApplicationList
                applications={recentApplications}
                emptyMessage="No applications yet. Be the first!"
              />
            )}

            {currentUser && (
              <Link href="/feed" className="block mt-4">
                <Button variant="secondary" className="w-full">
                  View All Applications
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* CTA Section for Non-Authenticated Users */}
        {!currentUser && (
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700">
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Join the Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Track your applications, compete in challenges, and stay motivated with others
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/signup">
                  <Button size="large">Register</Button>
                </Link>
                <Link href="/login">
                  <Button size="large" variant="secondary">
                    Login
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
