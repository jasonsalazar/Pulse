export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  profileImageUrl: string | null;
  createdAt: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface UpdateProfileRequest {
  displayName: string;
  bio: string;
  profileImageUrl: string | null;
}

export interface FollowResponse {
  userId: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

export interface UserFollow {
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
}
