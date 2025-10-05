'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import {
  getAllApplications,
  getUserApplications,
  createApplication,
  deleteApplication as deleteAppFromFirestore,
  subscribeToApplications,
} from '@/lib/firebase/firestore';

export function useApplications(userId?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates from Firestore
    const unsubscribe = subscribeToApplications(
      (apps) => {
        setApplications(apps);
        setLoading(false);
        setError(null);
      },
      userId
    );

    return () => unsubscribe();
  }, [userId]);

  const addApplication = useCallback(
    async (data: Omit<Application, 'id' | 'createdAt'>) => {
      try {
        const newAppId = await createApplication(data);
        // The real-time subscription will update the state automatically
        return { ...data, id: newAppId, createdAt: new Date() };
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to add application');
      }
    },
    []
  );

  const deleteApplication = useCallback(
    async (applicationId: string, userId: string) => {
      try {
        await deleteAppFromFirestore(applicationId, userId);
        // The real-time subscription will update the state automatically
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to delete application');
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const apps = userId ? await getUserApplications(userId) : await getAllApplications();
      setApplications(apps);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    applications,
    loading,
    error,
    addApplication,
    deleteApplication,
    refetch,
  };
}
