export type NotificationType = "Follow" | "Like" | "Comment";

export interface Notification {
  notificationId: string;
  actorId: string;
  actorUsername: string;
  actorDisplayName: string;
  actorProfileImageUrl: string | null;
  type: NotificationType;
  postId: string | null;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationPage {
  items: Notification[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}
