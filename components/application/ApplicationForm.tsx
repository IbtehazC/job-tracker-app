'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/lib/hooks/useApplications';
import { validateApplicationForm } from '@/lib/utils/validation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

interface ApplicationFormProps {
  onSuccess?: () => void;
}

export default function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const { currentUser } = useAuth();
  const { addApplication } = useApplications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('You must be logged in');
      return;
    }

    // Validate form
    const validation = validateApplicationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await addApplication({
        userId: currentUser.uid,
        username: currentUser.username,
        userPhotoURL: currentUser.photoURL,
        jobTitle: formData.jobTitle,
        company: formData.company,
        jobUrl: formData.jobUrl,
        appliedAt: new Date(),
      });

      toast.success('Application added successfully!');

      // Reset form
      setFormData({
        jobTitle: '',
        company: '',
        jobUrl: '',
      });

      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Add New Application</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Job Title"
          placeholder="e.g. Senior Software Engineer"
          value={formData.jobTitle}
          onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          error={errors.jobTitle}
          required
          disabled={isLoading}
        />

        <Input
          label="Company"
          placeholder="e.g. Google"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          error={errors.company}
          required
          disabled={isLoading}
        />

        <Input
          type="url"
          label="Job URL"
          placeholder="https://..."
          value={formData.jobUrl}
          onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
          error={errors.jobUrl}
          required
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Add Application
        </Button>
      </form>
    </Card>
  );
}
