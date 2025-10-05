export const STORAGE_KEYS = {
  CURRENT_USER: 'job_tracker_current_user',
  APPLICATIONS: 'job_tracker_applications',
  USERS: 'job_tracker_users',
  CHALLENGE: 'job_tracker_challenge',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  FEED: '/feed',
  LEADERBOARD: '/leaderboard',
} as const;
