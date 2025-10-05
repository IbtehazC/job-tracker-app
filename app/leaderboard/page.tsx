'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import { useChallenge } from '@/lib/hooks/useChallenge';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import Card from '@/components/ui/Card';
import { Trophy, Target } from 'lucide-react';

export default function LeaderboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { users, currentUserRank, loading: leaderboardLoading } = useLeaderboard(currentUser?.uid);
  const { currentChallenge } = useChallenge();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const targetCount = currentChallenge?.targetCount || 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Leaderboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            See how you rank against other job seekers
          </p>
        </div>

        {/* Current User Stats */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-1">Your Rank</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                #{currentUserRank || '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-1">Applications</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {currentUser.applicationCount}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 uppercase mb-1">Progress</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.min(((currentUser.applicationCount / targetCount) * 100), 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </Card>

        {/* Challenge Info */}
        {currentChallenge && (
          <Card className="mb-6 bg-blue-600 dark:bg-blue-700 text-white border-blue-700 dark:border-blue-600">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6" />
              <div>
                <h2 className="font-bold text-lg">{currentChallenge.name}</h2>
                <p className="text-blue-100 dark:text-blue-200 text-sm">{currentChallenge.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Leaderboard */}
        {leaderboardLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <LeaderboardTable
            users={users}
            currentUserId={currentUser.uid}
            targetCount={targetCount}
          />
        )}
      </main>
    </div>
  );
}
