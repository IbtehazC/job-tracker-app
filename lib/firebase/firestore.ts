import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { User, Application, Challenge, UserChallenge } from '@/types';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  APPLICATIONS: 'applications',
  CHALLENGES: 'challenges',
  USER_CHALLENGES: 'userChallenges',
};

// Helper: Convert Firestore Timestamp to Date
const timestampToDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// ============================================
// USER OPERATIONS
// ============================================

export async function createUser(userId: string, userData: Partial<User>): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.USERS, userId), {
    ...userData,
    applicationCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  if (!userDoc.exists()) return null;

  const data = userDoc.data();
  return {
    uid: userDoc.id,
    email: data.email,
    username: data.username,
    displayName: data.displayName,
    photoURL: data.photoURL,
    applicationCount: data.applicationCount || 0,
    createdAt: timestampToDate(data.createdAt),
    updatedAt: timestampToDate(data.updatedAt),
  };
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.USERS, userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function getAllUsers(): Promise<User[]> {
  const usersSnapshot = await getDocs(
    query(collection(db, COLLECTIONS.USERS), orderBy('applicationCount', 'desc'))
  );

  return usersSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      photoURL: data.photoURL,
      applicationCount: data.applicationCount || 0,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    };
  });
}

export function subscribeToUser(userId: string, callback: (user: User | null) => void) {
  return onSnapshot(doc(db, COLLECTIONS.USERS, userId), (docSnapshot) => {
    if (!docSnapshot.exists()) {
      callback(null);
      return;
    }

    const data = docSnapshot.data();
    callback({
      uid: docSnapshot.id,
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      photoURL: data.photoURL,
      applicationCount: data.applicationCount || 0,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    });
  });
}

// ============================================
// APPLICATION OPERATIONS
// ============================================

export async function createApplication(applicationData: Omit<Application, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), {
    ...applicationData,
    appliedAt: Timestamp.fromDate(applicationData.appliedAt),
    createdAt: serverTimestamp(),
  });

  // Increment user's application count
  const userRef = doc(db, COLLECTIONS.USERS, applicationData.userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const currentCount = userDoc.data().applicationCount || 0;
    await updateDoc(userRef, {
      applicationCount: currentCount + 1,
      updatedAt: serverTimestamp(),
    });
  }

  return docRef.id;
}

export async function getApplication(applicationId: string): Promise<Application | null> {
  const appDoc = await getDoc(doc(db, COLLECTIONS.APPLICATIONS, applicationId));
  if (!appDoc.exists()) return null;

  const data = appDoc.data();
  return {
    id: appDoc.id,
    userId: data.userId,
    username: data.username,
    userPhotoURL: data.userPhotoURL,
    jobTitle: data.jobTitle,
    company: data.company,
    jobUrl: data.jobUrl,
    appliedAt: timestampToDate(data.appliedAt),
    createdAt: timestampToDate(data.createdAt),
  };
}

export async function getUserApplications(userId: string): Promise<Application[]> {
  const appsSnapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.APPLICATIONS),
      where('userId', '==', userId),
      orderBy('appliedAt', 'desc')
    )
  );

  return appsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL,
      jobTitle: data.jobTitle,
      company: data.company,
      jobUrl: data.jobUrl,
      appliedAt: timestampToDate(data.appliedAt),
      createdAt: timestampToDate(data.createdAt),
    };
  });
}

export async function getAllApplications(limitCount?: number): Promise<Application[]> {
  const constraints: QueryConstraint[] = [orderBy('appliedAt', 'desc')];
  if (limitCount) {
    constraints.push(limit(limitCount));
  }

  const appsSnapshot = await getDocs(query(collection(db, COLLECTIONS.APPLICATIONS), ...constraints));

  return appsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL,
      jobTitle: data.jobTitle,
      company: data.company,
      jobUrl: data.jobUrl,
      appliedAt: timestampToDate(data.appliedAt),
      createdAt: timestampToDate(data.createdAt),
    };
  });
}

export async function deleteApplication(applicationId: string, userId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.APPLICATIONS, applicationId));

  // Decrement user's application count
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const currentCount = userDoc.data().applicationCount || 0;
    await updateDoc(userRef, {
      applicationCount: Math.max(0, currentCount - 1),
      updatedAt: serverTimestamp(),
    });
  }
}

export function subscribeToApplications(callback: (applications: Application[]) => void, userId?: string) {
  const constraints: QueryConstraint[] = [orderBy('appliedAt', 'desc')];
  if (userId) {
    constraints.unshift(where('userId', '==', userId));
  }

  return onSnapshot(query(collection(db, COLLECTIONS.APPLICATIONS), ...constraints), (snapshot) => {
    const applications = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        username: data.username,
        userPhotoURL: data.userPhotoURL,
        jobTitle: data.jobTitle,
        company: data.company,
        jobUrl: data.jobUrl,
        appliedAt: timestampToDate(data.appliedAt),
        createdAt: timestampToDate(data.createdAt),
      };
    });
    callback(applications);
  });
}

// ============================================
// CHALLENGE OPERATIONS
// ============================================

export async function createChallenge(challengeData: Omit<Challenge, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.CHALLENGES), {
    ...challengeData,
    startDate: Timestamp.fromDate(challengeData.startDate),
    endDate: Timestamp.fromDate(challengeData.endDate),
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getActiveChallenge(): Promise<Challenge | null> {
  const challengesSnapshot = await getDocs(
    query(
      collection(db, COLLECTIONS.CHALLENGES),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(1)
    )
  );

  if (challengesSnapshot.empty) return null;

  const doc = challengesSnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    targetCount: data.targetCount,
    startDate: timestampToDate(data.startDate),
    endDate: timestampToDate(data.endDate),
    isActive: data.isActive,
    createdAt: timestampToDate(data.createdAt),
  };
}

export async function updateChallenge(challengeId: string, updates: Partial<Challenge>): Promise<void> {
  const updateData: Record<string, unknown> = { ...updates };
  if (updates.startDate) {
    updateData.startDate = Timestamp.fromDate(updates.startDate);
  }
  if (updates.endDate) {
    updateData.endDate = Timestamp.fromDate(updates.endDate);
  }
  await updateDoc(doc(db, COLLECTIONS.CHALLENGES, challengeId), updateData);
}

export function subscribeToActiveChallenge(callback: (challenge: Challenge | null) => void) {
  return onSnapshot(
    query(
      collection(db, COLLECTIONS.CHALLENGES),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(1)
    ),
    (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      callback({
        id: doc.id,
        name: data.name,
        description: data.description,
        targetCount: data.targetCount,
        startDate: timestampToDate(data.startDate),
        endDate: timestampToDate(data.endDate),
        isActive: data.isActive,
        createdAt: timestampToDate(data.createdAt),
      });
    }
  );
}

// ============================================
// LEADERBOARD OPERATIONS
// ============================================

export async function getLeaderboard(limitCount: number = 100): Promise<User[]> {
  return getAllUsers(); // Already sorted by applicationCount desc
}

export function subscribeToLeaderboard(callback: (users: User[]) => void) {
  return onSnapshot(
    query(collection(db, COLLECTIONS.USERS), orderBy('applicationCount', 'desc')),
    (snapshot) => {
      const users = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email,
          username: data.username,
          displayName: data.displayName,
          photoURL: data.photoURL,
          applicationCount: data.applicationCount || 0,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
        };
      });
      callback(users);
    }
  );
}
