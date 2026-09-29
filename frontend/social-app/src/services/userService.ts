import { apiRequest } from "./api";

import type { UpdateProfileRequest, UserProfile } from "../types/user";

export async function getMyProfile() {
  return apiRequest<UserProfile>("/users/me");
}

export async function getUserProfile(userId: string) {
  return apiRequest<UserProfile>(`/users/${userId}`);
}

export async function updateMyProfile(request: UpdateProfileRequest) {
  return apiRequest<UserProfile>("/users/me", {
    method: "PUT",
    body: JSON.stringify(request),
  });
}
