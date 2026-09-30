export interface Post {
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreatePostRequest {
  content: string;
}
