import { apiRequest } from "./api";

import type { NotificationPage } from "../types/notification";

export async function getNotifications(page = 1, pageSize = 20) {
  return apiRequest<NotificationPage>(
    `/notifications?page=${page}&pageSize=${pageSize}`,
  );
}

export async function getUnreadNotificationCount() {
  return apiRequest<number>("/notifications/unread-count");
}

export async function markNotificationAsRead(notificationId: string) {
  return apiRequest<void>(`/notifications/${notificationId}/read`, {
    method: "POST",
  });
}

export async function markAllNotificationsAsRead() {
  return apiRequest<void>("/notifications/read-all", {
    method: "POST",
  });
}
