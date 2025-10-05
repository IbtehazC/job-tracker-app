import { formatDistanceToNow, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export function getTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function getNextMonday(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  nextMonday.setHours(23, 59, 59, 999);
  return nextMonday;
}

export function getTimeRemaining(endDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  total: number;
} {
  const now = new Date();
  const total = endDate.getTime() - now.getTime();

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, total: 0 };
  }

  const days = differenceInDays(endDate, now);
  const hours = differenceInHours(endDate, now) % 24;
  const minutes = differenceInMinutes(endDate, now) % 60;

  return { days, hours, minutes, total };
}
