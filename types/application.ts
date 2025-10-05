export interface Application {
  id: string;
  userId: string;
  username: string;
  userPhotoURL?: string;
  jobTitle: string;
  company: string;
  jobUrl: string;
  appliedAt: Date;
  createdAt: Date;
}
