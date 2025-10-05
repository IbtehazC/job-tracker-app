import Card from '@/components/ui/Card';
import { Clock } from 'lucide-react';

interface ChallengeCountdownProps {
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    total: number;
  };
}

export default function ChallengeCountdown({ timeRemaining }: ChallengeCountdownProps) {
  const { days, hours, minutes, total } = timeRemaining;

  if (total <= 0) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <Clock className="w-5 h-5" />
          <span className="font-bold">Challenge Ended</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
      <div className="flex items-center space-x-2 mb-3">
        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span className="font-bold text-blue-900 dark:text-blue-100">Time Remaining</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{days}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{hours}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{minutes}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">Minutes</div>
        </div>
      </div>
    </Card>
  );
}
