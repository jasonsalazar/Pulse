import { apiRequest } from "./api";
import type { CreatePostRequest, Post } from "../types/post";

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
