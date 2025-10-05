'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/lib/hooks/useApplications';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ApplicationList from '@/components/application/ApplicationList';
import { Activity } from 'lucide-react';

export default function FeedPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const { applications, loading: appsLoading } = useApplications();

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Activity Feed</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            See what jobs everyone is applying to and stay motivated!
          </p>
        </div>

        {/* Applications Feed */}
        {appsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <ApplicationList applications={applications} />
        )}
      </main>
    </div>
  );
}
