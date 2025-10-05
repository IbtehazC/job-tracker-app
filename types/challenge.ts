export interface Challenge {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface UserChallenge {
  challengeId: string;
  currentCount: number;
  isCompleted: boolean;
  completedAt?: Date;
  startedAt: Date;
}
