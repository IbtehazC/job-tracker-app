import { Challenge } from '@/types';
import Card from '@/components/ui/Card';
import { Trophy, Target } from 'lucide-react';

interface ChallengeProgressProps {
  challenge: Challenge;
  userProgress: number;
  isCompleted: boolean;
}

export default function ChallengeProgress({
  challenge,
  userProgress,
  isCompleted,
}: ChallengeProgressProps) {
  const percentage = Math.min((userProgress / challenge.targetCount) * 100, 100);

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{challenge.name}</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{challenge.description}</p>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold">Completed!</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Progress Bar */}
        <div className="relative">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isCompleted ? 'bg-green-500 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100">{userProgress}</span> of{' '}
            <span className="font-bold text-gray-900 dark:text-gray-100">{challenge.targetCount}</span> applications
          </span>
          <span className="font-bold text-blue-600 dark:text-blue-400">{percentage.toFixed(0)}%</span>
        </div>
      </div>
    </Card>
  );
}
