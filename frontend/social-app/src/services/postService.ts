import { apiRequest } from "./api";
import type {
  CreatePostRequest,
  PagedResponse,
  Post,
  PostLikeResponse,
} from "../types/post";

export async function getRecentPosts(take = 20) {
  return apiRequest<Post[]>(`/posts?take=${take}`);
}

export async function getPost(postId: string) {
  return apiRequest<Post>(`/posts/${postId}`);
}

export async function getUserPosts(userId: string) {
  return apiRequest<Post[]>(`/posts/user/${userId}`);
}

export async function createPost(request: CreatePostRequest) {
  return apiRequest<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function deletePost(postId: string) {
  return apiRequest<void>(`/posts/${postId}`, {
    method: "DELETE",
  });
}

export async function togglePostLike(postId: string) {
  return apiRequest<PostLikeResponse>(`/posts/${postId}/like`, {
    method: "POST",
  });
}

export async function getHomeFeed(page = 1, pageSize = 20) {
  return apiRequest<PagedResponse<Post>>(
    `/posts/feed?page=${page}&pageSize=${pageSize}`,
  );
}
