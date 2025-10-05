import { User } from '@/types';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntryProps {
  user: User;
  rank: number;
  isCurrentUser: boolean;
  targetCount: number;
}

export default function LeaderboardEntry({
  user,
  rank,
  isCurrentUser,
  targetCount,
}: LeaderboardEntryProps) {
  const percentage = Math.min((user.applicationCount / targetCount) * 100, 100);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600 dark:text-orange-500" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
    if (rank === 2) return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30';
    if (rank === 3) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30';
    return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30';
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        isCurrentUser
          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankColor(
            rank
          )}`}
        >
          {getRankIcon(rank) || `#${rank}`}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3 flex-1">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.username}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-300 font-bold">
                {user.username[0].toUpperCase()}
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900 dark:text-gray-100">@{user.username}</span>
              {isCurrentUser && (
                <span className="text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-2">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    percentage >= 100 ? 'bg-green-500 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {user.applicationCount} applications
                </span>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Count Badge */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.applicationCount}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Apps</div>
        </div>
      </div>
    </div>
  );
}
