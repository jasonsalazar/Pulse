export interface Post {
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
}

export interface CreatePostRequest {
  content: string;
}

export interface PostLikeResponse {
  postId: string;
  isLiked: boolean;
  likeCount: number;
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCommentRequest {
  content: string;
}
