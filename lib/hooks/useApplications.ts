'use client';

import { useState, useEffect, useCallback } from 'react';
import { Application } from '@/types';
import {
  getAllApplications,
  addApplication as addAppToStorage,
  deleteApplication as deleteAppFromStorage,
  getUserApplications,
} from '@/lib/mock/storage';

export function useApplications(userId?: string) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(() => {
    try {
      const apps = userId ? getUserApplications(userId) : getAllApplications();
      setApplications(apps);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const addApplication = useCallback(
    async (data: Omit<Application, 'id' | 'createdAt'>) => {
      try {
        const newApp = addAppToStorage(data);
        setApplications((prev) => [newApp, ...prev]);
        return newApp;
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to add application');
      }
    },
    []
  );

  const deleteApplication = useCallback(
    async (applicationId: string, userId: string) => {
      try {
        deleteAppFromStorage(applicationId, userId);
        setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      } catch (err) {
        throw err instanceof Error ? err : new Error('Failed to delete application');
      }
    },
    []
  );

  return {
    applications,
    loading,
    error,
    addApplication,
    deleteApplication,
    refetch: fetchApplications,
  };
}
