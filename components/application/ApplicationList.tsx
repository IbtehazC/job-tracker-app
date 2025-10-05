import { Application } from '@/types';
import ApplicationCard from './ApplicationCard';
import { FileSearch } from 'lucide-react';

interface ApplicationListProps {
  applications: Application[];
  emptyMessage?: string;
}

export default function ApplicationList({
  applications,
  emptyMessage = 'No applications yet. Be the first to add one!',
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSearch className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <ApplicationCard key={application.id} application={application} />
      ))}
    </div>
  );
}
