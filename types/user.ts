export interface User {
  uid: string;
  email: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}
