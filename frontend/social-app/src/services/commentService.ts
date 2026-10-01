import { apiRequest } from "./api";

import type { Comment, CreateCommentRequest } from "../types/post";

export async function getPostComments(postId: string) {
  return apiRequest<Comment[]>(`/posts/${postId}/comments`);
}

export async function createComment(
  postId: string,
  request: CreateCommentRequest,
) {
  return apiRequest<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function deleteComment(commentId: string) {
  return apiRequest<void>(`/comments/${commentId}`, {
    method: "DELETE",
  });
}
