import { Link, useNavigate } from "react-router-dom";

import Avatar from "../ui/Avatar";

import type { Notification } from "../../types/notification";

import "./NotificationItem.css";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

function getNotificationMessage(notification: Notification): string {
  switch (notification.type) {
    case "Follow":
      return "started following you.";

    case "Like":
      return "liked your post.";

    case "Comment":
      return "commented on your post.";

    default:
      return "interacted with you.";
  }
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const differenceInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000,
  );

  if (differenceInSeconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(differenceInSeconds / 60);

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 5) {
    return `${weeks}w`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const navigate = useNavigate();

  const handleNotificationClick = async () => {
    if (!notification.isRead) {
      try {
        await onMarkAsRead(notification.notificationId);
      } catch {
        // Navigation should still work even
        // if marking as read fails.
      }
    }

    if (notification.type === "Follow") {
      navigate(`/profile/${notification.actorId}`);
      return;
    }

    if (notification.postId) {
      // Post routes will be expanded when
      // post detail navigation is added.
      navigate(`/posts/${notification.postId}`);
      return;
    }

    navigate(`/profile/${notification.actorId}`);
  };

  const message = getNotificationMessage(notification);

  return (
    <div
      className={`notification-item ${
        notification.isRead
          ? "notification-item--read"
          : "notification-item--unread"
      }`}
      role="button"
      tabIndex={0}
      onClick={handleNotificationClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNotificationClick();
        }
      }}
    >
      <Link
        to={`/profile/${notification.actorId}`}
        className="notification-item__avatar"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Avatar
          src={notification.actorProfileImageUrl}
          alt={notification.actorDisplayName}
          size="md"
        />
      </Link>

      <div className="notification-item__content">
        <div className="notification-item__message">
          <Link
            to={`/profile/${notification.actorId}`}
            className="notification-item__actor"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            {notification.actorDisplayName}
          </Link>{" "}
          <span>{message}</span>
        </div>

        <span className="notification-item__time">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>

      {!notification.isRead && (
        <span
          className="notification-item__unread-dot"
          aria-label="Unread notification"
        />
      )}
    </div>
  );
}
