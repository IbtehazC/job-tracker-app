import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'small' | 'medium' | 'large';
}

export default function Card({ children, className = '', padding = 'medium' }: CardProps) {
  const paddingStyles = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}
