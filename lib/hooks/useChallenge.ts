'use client';

import { useState, useEffect } from 'react';
import { Challenge } from '@/types';
import { getCurrentChallenge } from '@/lib/mock/storage';
import { getTimeRemaining } from '@/lib/utils/date';

export function useChallenge(userApplicationCount: number = 0) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const challenge = getCurrentChallenge();
    setCurrentChallenge(challenge);
    setLoading(false);

    if (challenge) {
      // Update countdown every minute
      const updateCountdown = () => {
        setTimeRemaining(getTimeRemaining(challenge.endDate));
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, []);

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
