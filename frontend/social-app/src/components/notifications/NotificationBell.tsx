import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

import { useNotifications } from "../../context/NotificationContext";

import { getNotifications } from "../../services/notificationService";

import type { Notification } from "../../types/notification";

import "./NotificationBell.css";

const PREVIEW_COUNT = 5;

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

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
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

export default function NotificationBell() {
  const { unreadCount, markAsRead } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getNotifications(1, PREVIEW_COUNT);

      setNotifications(result.items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load notifications.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((current) => !current);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.notificationId);

        setNotifications((current) =>
          current.map((item) =>
            item.notificationId === notification.notificationId
              ? {
                  ...item,
                  isRead: true,
                }
              : item,
          ),
        );
      } catch {
        // Keep the notification open if
        // marking as read fails.
        return;
      }
    }

    setIsOpen(false);
  };

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        type="button"
        className="notification-bell__button"
        onClick={handleToggle}
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : "Notifications"
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="notification-bell__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="notification-bell__badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="notification-bell__dropdown"
          role="dialog"
          aria-label="Notifications"
        >
          <div className="notification-bell__header">
            <h2>Notifications</h2>

            <Link
              to="/notifications"
              className="notification-bell__view-all"
              onClick={() => setIsOpen(false)}
            >
              View all
            </Link>
          </div>

          <div className="notification-bell__list">
            {isLoading && (
              <div className="notification-bell__state">
                Loading notifications...
              </div>
            )}

            {!isLoading && error && (
              <div className="notification-bell__state notification-bell__state--error">
                <p>{error}</p>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={loadNotifications}
                >
                  Try Again
                </Button>
              </div>
            )}

            {!isLoading && !error && notifications.length === 0 && (
              <div className="notification-bell__state">
                <svg
                  className="notification-bell__empty-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                <strong>No notifications</strong>

                <span>You're all caught up.</span>
              </div>
            )}

            {!isLoading &&
              !error &&
              notifications.map((notification) => (
                <Link
                  key={notification.notificationId}
                  to={
                    notification.type === "Follow"
                      ? `/profile/${notification.actorId}`
                      : notification.postId
                        ? `/posts/${notification.postId}`
                        : `/profile/${notification.actorId}`
                  }
                  className={`notification-preview ${
                    notification.isRead
                      ? "notification-preview--read"
                      : "notification-preview--unread"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Avatar
                    src={notification.actorProfileImageUrl}
                    alt={notification.actorDisplayName}
                    size="sm"
                  />

                  <div className="notification-preview__content">
                    <p>
                      <strong>{notification.actorDisplayName}</strong>{" "}
                      {getNotificationMessage(notification)}
                    </p>

                    <span>{formatRelativeTime(notification.createdAt)}</span>
                  </div>

                  {!notification.isRead && (
                    <span
                      className="notification-preview__dot"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
          </div>

          <Link
            to="/notifications"
            className="notification-bell__footer"
            onClick={() => setIsOpen(false)}
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
