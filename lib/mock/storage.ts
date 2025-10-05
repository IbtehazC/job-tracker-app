import { User, Application, Challenge } from '@/types';
import { STORAGE_KEYS } from '@/lib/utils/constants';
import { MOCK_USERS, MOCK_APPLICATIONS, MOCK_CHALLENGE } from './mockData';

// Initialize mock data in localStorage
export function initializeMockData() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(MOCK_APPLICATIONS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CHALLENGE)) {
    localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(MOCK_CHALLENGE));
  }
}

// User operations
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;

  const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (!userData) return null;

  const user = JSON.parse(userData);
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;

  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];

  const usersData = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!usersData) return [];

  const users = JSON.parse(usersData);
  return users.map((user: any) => ({
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  }));
}

export function updateUser(userId: string, updates: Partial<User>) {
  if (typeof window === 'undefined') return;

  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.uid === userId);

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date(),
    };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.uid === userId) {
      setCurrentUser(users[userIndex]);
    }
  }
}

// Application operations
export function getAllApplications(): Application[] {
  if (typeof window === 'undefined') return [];

  const appsData = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
  if (!appsData) return [];

  const apps = JSON.parse(appsData);
  return apps.map((app: any) => ({
    ...app,
    appliedAt: new Date(app.appliedAt),
    createdAt: new Date(app.createdAt),
  })).sort((a: Application, b: Application) => b.appliedAt.getTime() - a.appliedAt.getTime());
}

export function addApplication(application: Omit<Application, 'id' | 'createdAt'>): Application {
  if (typeof window === 'undefined') throw new Error('Cannot add application on server');

  const apps = getAllApplications();
  const newApp: Application = {
    ...application,
    id: Date.now().toString(),
    createdAt: new Date(),
  };

  apps.unshift(newApp);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

  // Increment user's application count
  updateUser(application.userId, {
    applicationCount: (getAllUsers().find(u => u.uid === application.userId)?.applicationCount || 0) + 1,
  });

  return newApp;
}

export function deleteApplication(applicationId: string, userId: string) {
  if (typeof window === 'undefined') return;

  const apps = getAllApplications();
  const filteredApps = apps.filter(app => app.id !== applicationId);

  if (apps.length !== filteredApps.length) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(filteredApps));

    // Decrement user's application count
    const currentCount = getAllUsers().find(u => u.uid === userId)?.applicationCount || 0;
    updateUser(userId, {
      applicationCount: Math.max(0, currentCount - 1),
    });
  }
}

export function getUserApplications(userId: string): Application[] {
  return getAllApplications().filter(app => app.userId === userId);
}

// Challenge operations
export function getCurrentChallenge(): Challenge | null {
  if (typeof window === 'undefined') return null;

  const challengeData = localStorage.getItem(STORAGE_KEYS.CHALLENGE);
  if (!challengeData) return null;

  const challenge = JSON.parse(challengeData);
  return {
    ...challenge,
    startDate: new Date(challenge.startDate),
    endDate: new Date(challenge.endDate),
    createdAt: new Date(challenge.createdAt),
  };
}
