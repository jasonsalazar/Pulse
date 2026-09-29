export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profileImageUrl: string | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  displayName: string;
  bio: string;
  profileImageUrl: string | null;
}
