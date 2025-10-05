import { User } from '@/types';
import LeaderboardEntry from './LeaderboardEntry';
import { Users } from 'lucide-react';

interface LeaderboardTableProps {
  users: User[];
  currentUserId?: string;
  targetCount: number;
}

export default function LeaderboardTable({
  users,
  currentUserId,
  targetCount,
}: LeaderboardTableProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">No users yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        <LeaderboardEntry
          key={user.uid}
          user={user}
          rank={index + 1}
          isCurrentUser={user.uid === currentUserId}
          targetCount={targetCount}
        />
      ))}
    </div>
  );
}
