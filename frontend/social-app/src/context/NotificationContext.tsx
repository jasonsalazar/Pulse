import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";

interface NotificationContextValue {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

const POLLING_INTERVAL = 30_000;

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();

      setUnreadCount(count);
    } catch {
      // Notification polling should not
      // interrupt the application.
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    await markNotificationAsRead(notificationId);

    setUnreadCount((current) => Math.max(0, current - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await markAllNotificationsAsRead();

    setUnreadCount(0);
  }, []);

  useEffect(() => {
    refreshUnreadCount();

    const intervalId = window.setInterval(refreshUnreadCount, POLLING_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider.",
    );
  }

  return context;
}
