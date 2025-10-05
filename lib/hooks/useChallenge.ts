'use client';

import { useState, useEffect } from 'react';
import { Challenge } from '@/types';
import { getActiveChallenge, subscribeToActiveChallenge } from '@/lib/firebase/firestore';
import { getTimeRemaining } from '@/lib/utils/date';

export function useChallenge(userApplicationCount: number = 0) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time challenge updates
    const unsubscribe = subscribeToActiveChallenge((challenge) => {
      setCurrentChallenge(challenge);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentChallenge) {
      // Update countdown every minute
      const updateCountdown = () => {
        setTimeRemaining(getTimeRemaining(currentChallenge.endDate));
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [currentChallenge]);

  const userProgress = currentChallenge ? userApplicationCount : 0;
  const isCompleted = currentChallenge ? userProgress >= currentChallenge.targetCount : false;

  return {
    currentChallenge,
    userProgress,
    isCompleted,
    timeRemaining,
    loading,
  };
}
