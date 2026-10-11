import { apiRequest } from "./api";

import type {
  UpdateProfileRequest,
  UserProfile,
  UserSearchResult,
} from "../types/user";

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

export async function searchUsers(
  searchTerm: string,
  page = 1,
  pageSize = 20,
): Promise<UserSearchResult[]> {
  const params = new URLSearchParams({
    q: searchTerm,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return apiRequest<UserSearchResult[]>(`/users/search?${params.toString()}`);
}
