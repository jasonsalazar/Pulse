import { useCallback, useEffect, useState } from "react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Spinner from "../../components/ui/Spinner";
import NotificationItem from "../../components/notifications/NotificationItem";

import { getNotifications } from "../../services/notificationService";

import type { Notification } from "../../types/notification";

import "./NotificationsPage.css";
import { useNotifications } from "../../context/NotificationContext";

const PAGE_SIZE = 20;

export default function NotificationsPage() {
  const { markAsRead, markAllAsRead } = useNotifications();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [page, setPage] = useState(1);

  const [hasNextPage, setHasNextPage] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getNotifications(1, PAGE_SIZE);

      setNotifications(result.items);

      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load notifications.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasNextPage) {
      return;
    }

    try {
      setIsLoadingMore(true);
      setError(null);

      const nextPage = page + 1;

      const result = await getNotifications(nextPage, PAGE_SIZE);

      setNotifications((current) => [...current, ...result.items]);

      setPage(result.page);
      setHasNextPage(result.hasNextPage);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load more notifications.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);

    setNotifications((current) =>
      current.map((notification) =>
        notification.notificationId === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),
    );
  };

  const handleMarkAllAsRead = async () => {
    if (isMarkingAllRead) {
      return;
    }

    try {
      setIsMarkingAllRead(true);
      setError(null);

      await markAllAsRead();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to mark notifications as read.",
      );
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const hasUnread = notifications.some((notification) => !notification.isRead);

  if (isLoading) {
    return (
      <div className="notifications-page">
        <div className="notifications-page__header">
          <div>
            <h1>Notifications</h1>
            <p>Stay up to date with what's happening.</p>
          </div>
        </div>

        <Card>
          <div className="notifications-page__loading">
            <Spinner />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <header className="notifications-page__header">
        <div>
          <h1>Notifications</h1>

          <p>Stay up to date with what's happening.</p>
        </div>

        {hasUnread && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead}
          >
            {isMarkingAllRead ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </header>

      {error && (
        <div className="notifications-page__error">
          <ErrorMessage message={error} />

          {notifications.length === 0 && (
            <Button variant="secondary" size="sm" onClick={loadNotifications}>
              Try Again
            </Button>
          )}
        </div>
      )}

      {notifications.length === 0 && !error && (
        <Card>
          <EmptyState
            title="No notifications yet"
            description="When someone follows you, likes your post, or comments on your post, you'll see it here."
          />
        </Card>
      )}

      {notifications.length > 0 && (
        <Card className="notifications-page__card">
          <div className="notifications-page__list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        </Card>
      )}

      {hasNextPage && (
        <div className="notifications-page__load-more">
          <Button
            variant="secondary"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      {!hasNextPage && notifications.length > 0 && (
        <p className="notifications-page__end">You're all caught up.</p>
      )}
    </div>
  );
}
