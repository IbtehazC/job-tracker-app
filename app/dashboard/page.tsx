'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/lib/hooks/useApplications';
import { useChallenge } from '@/lib/hooks/useChallenge';
import { useLeaderboard } from '@/lib/hooks/useLeaderboard';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ApplicationForm from '@/components/application/ApplicationForm';
import ApplicationList from '@/components/application/ApplicationList';
import ChallengeProgress from '@/components/challenge/ChallengeProgress';
import ChallengeCountdown from '@/components/challenge/ChallengeCountdown';
import { TrendingUp, Award, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { applications, loading: appsLoading } = useApplications(currentUser?.uid);
  const { currentChallenge, userProgress, isCompleted, timeRemaining } = useChallenge(
    currentUser?.applicationCount || 0
  );
  const { currentUserRank, users } = useLeaderboard(currentUser?.uid);

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

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {currentUser.displayName || currentUser.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track your progress and stay motivated</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Challenge */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {currentUser.applicationCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
              </Card>

              <Card className="text-center">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  #{currentUserRank || '-'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  of {users.length} users
                </div>
              </Card>

              <Card className="text-center">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {applications.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">This Period</div>
              </Card>
            </div>

            {/* Challenge Progress */}
            {currentChallenge && (
              <ChallengeProgress
                challenge={currentChallenge}
                userProgress={userProgress}
                isCompleted={isCompleted}
              />
            )}

            {/* Recent Applications */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Recent Applications ({applications.length})
              </h2>
              {appsLoading ? (
                <LoadingSpinner />
              ) : (
                <ApplicationList
                  applications={recentApplications}
                  emptyMessage="You haven't added any applications yet. Add your first one!"
                />
              )}
            </div>
          </div>

          {/* Right Column - Add Application & Countdown */}
          <div className="space-y-6">
            <ApplicationForm onSuccess={() => window.location.reload()} />
            {currentChallenge && <ChallengeCountdown timeRemaining={timeRemaining} />}
          </div>
        </div>
      </main>
    </div>
  );
}
