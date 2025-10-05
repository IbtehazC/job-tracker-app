'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';
import { getAllUsers } from '@/lib/mock/storage';

export function useLeaderboard(currentUserId?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const allUsers = getAllUsers();
      // Sort by application count descending
      const sortedUsers = allUsers.sort((a, b) => b.applicationCount - a.applicationCount);
      setUsers(sortedUsers);

      if (currentUserId) {
        const rank = sortedUsers.findIndex((u) => u.uid === currentUserId) + 1;
        setCurrentUserRank(rank);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch leaderboard'));
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  return {
    users,
    currentUserRank,
    loading,
    error,
  };
}
