'use client';

import { Application } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/lib/hooks/useApplications';
import { getTimeAgo } from '@/lib/utils/date';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ExternalLink, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const { currentUser } = useAuth();
  const { deleteApplication } = useApplications();
  const isOwner = currentUser?.uid === application.userId;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this application?')) {
      return;
    }

    try {
      await deleteApplication(application.id, application.userId);
      toast.success('Application deleted');
    } catch {
      toast.error('Failed to delete application');
    }
  };

  const handleViewJob = () => {
    window.open(application.jobUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card padding="medium" className={isOwner ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30' : ''}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* User Avatar */}
          {application.userPhotoURL ? (
            <img
              src={application.userPhotoURL}
              alt={application.username}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-600 dark:text-gray-300 font-bold text-sm">
                {application.username[0].toUpperCase()}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">@{application.username}</span>
              <span className="text-gray-400 dark:text-gray-600">·</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{getTimeAgo(application.appliedAt)}</span>
              {isOwner && (
                <span className="text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>

            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">{application.jobTitle}</h3>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-3">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">{application.company}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="small"
                onClick={handleViewJob}
                className="flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View Job
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Button (only for owner) */}
        {isOwner && (
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
            className="ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
