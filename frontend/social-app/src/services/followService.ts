import { apiRequest } from "./api";

import type { FollowResponse, UserFollow } from "../types/user";

export async function followUser(userId: string) {
  return apiRequest<FollowResponse>(`/users/${userId}/follow`, {
    method: "POST",
  });
}

export async function unfollowUser(userId: string) {
  return apiRequest<FollowResponse>(`/users/${userId}/follow`, {
    method: "DELETE",
  });
}

export async function getFollowers(userId: string) {
  return apiRequest<UserFollow[]>(`/users/${userId}/followers`);
}

export async function getFollowing(userId: string) {
  return apiRequest<UserFollow[]>(`/users/${userId}/following`);
}
