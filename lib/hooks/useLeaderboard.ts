'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getLeaderboard, subscribeToLeaderboard } from '@/lib/firebase/firestore';

export function useLeaderboard(currentUserId?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe to real-time leaderboard updates
    const unsubscribe = subscribeToLeaderboard((allUsers) => {
      setUsers(allUsers);

      if (currentUserId) {
        const rank = allUsers.findIndex((u) => u.uid === currentUserId) + 1;
        setCurrentUserRank(rank);
      }

      setLoading(false);
      setError(null);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  return {
    users,
    currentUserRank,
    loading,
    error,
  };
}
