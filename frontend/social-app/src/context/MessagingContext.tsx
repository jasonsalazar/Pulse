import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  createConversation,
  getConversations,
  getMessages,
  markConversationAsRead,
} from "../services/messagingService";

import {
  onConnectionStatusChanged,
  onMessageReceived,
  startSignalRConnection,
  stopSignalRConnection,
  sendSignalRMessage,
  type SignalRConnectionStatus,
  onMessagesRead,
  markConversationAsReadViaSignalR,
  onUserTyping,
  onUserStoppedTyping,
  startTyping,
  stopTyping,
  onUserOnline,
  onUserOffline,
  isUserOnline,
  getUserLastSeen,
} from "../services/signalRService";

import type { Conversation, Message } from "../types/messaging";
import { useAuth } from "./AuthContext";

interface MessagingContextValue {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isConnected: boolean;
  error: string | null;
  totalUnreadCount: number;
  connectionStatus: SignalRConnectionStatus;
  hasMoreMessages: boolean;
  isLoadingMoreMessages: boolean;

  typingUserIds: Record<string, string[]>;
  notifyTyping: (conversationId: string) => Promise<void>;
  notifyStoppedTyping: (conversationId: string) => Promise<void>;
  isUserTyping: (conversationId: string) => boolean;

  onlineUserIds: Set<string>;
  checkUserOnline: (userId: string) => Promise<boolean>;
  lastSeenByUserId: Record<string, string>;

  setActiveConversation: (conversationId: string | null) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  startConversation: (otherUserId: string) => Promise<Conversation>;
  sendMessage: (content: string) => Promise<Message>;
  markAsRead: (conversationId: string) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextValue | undefined>(
  undefined,
);

interface MessagingProviderProps {
  children: ReactNode;
}

export function MessagingProvider({ children }: MessagingProviderProps) {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [typingUserIds, setTypingUserIds] = useState<Record<string, string[]>>(
    {},
  );
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [lastSeenByUserId, setLastSeenByUserId] = useState<
    Record<string, string>
  >({});

  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<SignalRConnectionStatus>("disconnected");

  const [error, setError] = useState<string | null>(null);

  const totalUnreadCount = useMemo(
    () =>
      conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0,
      ),
    [conversations],
  );

  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      setError(null);

      const result = await getConversations();

      setConversations(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations.",
      );
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoadingMessages(true);
    setIsLoadingMoreMessages(false);
    setHasMoreMessages(true);
    setMessagePage(1);

    try {
      const result = await getMessages(conversationId, 1, 50);

      setMessages(
        [...result].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
      );

      setHasMoreMessages(result.length === 50);
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (
      !activeConversationId ||
      isLoadingMessages ||
      isLoadingMoreMessages ||
      !hasMoreMessages
    ) {
      return;
    }

    const nextPage = messagePage + 1;

    setIsLoadingMoreMessages(true);

    try {
      const olderMessages = await getMessages(
        activeConversationId,
        nextPage,
        50,
      );

      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
        return;
      }

      setMessages((current) => {
        const merged = [...olderMessages, ...current];

        const unique = Array.from(
          new Map(
            merged.map((message) => [message.messageId, message]),
          ).values(),
        );

        return unique.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      });

      setMessagePage(nextPage);

      setHasMoreMessages(olderMessages.length === 50);
    } finally {
      setIsLoadingMoreMessages(false);
    }
  }, [
    activeConversationId,
    hasMoreMessages,
    isLoadingMessages,
    isLoadingMoreMessages,
    messagePage,
  ]);

  const markAsRead = useCallback(
    async (conversationId: string) => {
      try {
        if (isConnected) {
          await markConversationAsReadViaSignalR(conversationId);
        } else {
          await markConversationAsRead(conversationId);
        }

        setConversations((current) =>
          current.map((conversation) =>
            conversation.conversationId === conversationId
              ? {
                  ...conversation,
                  unreadCount: 0,
                }
              : conversation,
          ),
        );

        setMessages((current) =>
          current.map((message) =>
            message.conversationId === conversationId &&
            message.senderId !== user?.userId
              ? {
                  ...message,
                  isRead: true,
                }
              : message,
          ),
        );
      } catch (error) {
        if (isConnected) {
          throw error;
        }

        await markConversationAsRead(conversationId);

        setConversations((current) =>
          current.map((conversation) =>
            conversation.conversationId === conversationId
              ? {
                  ...conversation,
                  unreadCount: 0,
                }
              : conversation,
          ),
        );
      }
    },
    [isConnected, user?.userId],
  );

  const setActiveConversation = useCallback(
    async (conversationId: string | null) => {
      setActiveConversationId(conversationId);

      setMessages([]);

      if (!conversationId) {
        return;
      }

      await loadMessages(conversationId);

      await markAsRead(conversationId);
    },
    [loadMessages, markAsRead],
  );

  const startConversation = useCallback(
    async (otherUserId: string): Promise<Conversation> => {
      try {
        setError(null);

        const conversation = await createConversation({
          otherUserId,
        });

        await loadConversations();

        return conversation;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create conversation.";

        setError(message);

        throw err;
      }
    },
    [loadConversations],
  );

  const sendMessage = useCallback(
    async (content: string): Promise<Message> => {
      if (!activeConversationId) {
        throw new Error("No conversation selected.");
      }

      const trimmedContent = content.trim();

      if (!trimmedContent) {
        throw new Error("Message content cannot be empty.");
      }

      if (connectionStatus !== "connected") {
        throw new Error("You are currently disconnected from messaging.");
      }

      const message = await sendSignalRMessage(
        activeConversationId,
        trimmedContent,
      );

      setMessages((current) => mergeMessage(current, message));

      setConversations((current) =>
        current.map((conversation) =>
          conversation.conversationId === activeConversationId
            ? {
                ...conversation,
                lastMessagePreview: message.content,
                lastMessageAt: message.createdAt,
              }
            : conversation,
        ),
      );

      return message;
    },
    [activeConversationId, connectionStatus],
  );

  const notifyTyping = useCallback(async (conversationId: string) => {
    await startTyping(conversationId);
  }, []);

  const notifyStoppedTyping = useCallback(async (conversationId: string) => {
    await stopTyping(conversationId);
  }, []);

  const isUserTyping = useCallback(
    (conversationId: string): boolean =>
      (typingUserIds[conversationId] ?? []).length > 0,
    [typingUserIds],
  );

  const checkUserOnline = useCallback(async (userId: string) => {
    const online = await isUserOnline(userId);

    setOnlineUserIds((current) => {
      const next = new Set(current);

      if (online) {
        next.add(userId);
      } else {
        next.delete(userId);
      }

      return next;
    });

    if (online) {
      setLastSeenByUserId((current) => {
        const next = {
          ...current,
        };

        delete next[userId];

        return next;
      });

      return true;
    }

    const lastSeen = await getUserLastSeen(userId);

    if (lastSeen) {
      setLastSeenByUserId((current) => ({
        ...current,
        [userId]: lastSeen,
      }));
    }

    return false;
  }, []);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!user) {
      setIsConnected(false);

      stopSignalRConnection().catch(() => undefined);

      return;
    }

    let isMounted = true;

    async function connect() {
      try {
        await startSignalRConnection();

        if (isMounted) {
          setIsConnected(true);
        }
      } catch (err) {
        if (isMounted) {
          setIsConnected(false);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to connect to messaging.",
          );
        }
      }
    }

    connect();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, user]);

  useEffect(() => {
    const unsubscribeMessage = onMessageReceived((message) => {
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.conversationId !== message.conversationId) {
            return conversation;
          }

          const isActive = activeConversationId === message.conversationId;

          return {
            ...conversation,
            lastMessagePreview: message.content,
            lastMessageAt: message.createdAt,
            unreadCount: isActive ? 0 : conversation.unreadCount + 1,
          };
        }),
      );

      if (activeConversationId === message.conversationId) {
        setMessages((current) => mergeMessage(current, message));

        markAsRead(message.conversationId).catch(() => undefined);

        return;
      }
    });

    const unsubscribeMessagesRead = onMessagesRead((result) => {
      setMessages((current) =>
        current.map((message) => {
          if (
            message.conversationId !== result.conversationId ||
            !result.messageIds.includes(message.messageId)
          ) {
            return message;
          }

          return {
            ...message,
            isRead: true,
          };
        }),
      );
    });

    const unsubscribeConnectionStatus =
      onConnectionStatusChanged(setConnectionStatus);

    const unsubscribeTyping = onUserTyping((event) => {
      setTypingUserIds((current) => {
        const users = current[event.conversationId] ?? [];

        if (users.includes(event.userId)) {
          return current;
        }

        return {
          ...current,
          [event.conversationId]: [...users, event.userId],
        };
      });
    });

    const unsubscribeStoppedTyping = onUserStoppedTyping((event) => {
      setTypingUserIds((current) => {
        const users = current[event.conversationId] ?? [];

        const remaining = users.filter((userId) => userId !== event.userId);

        if (remaining.length === 0) {
          const next = {
            ...current,
          };

          delete next[event.conversationId];

          return next;
        }

        return {
          ...current,
          [event.conversationId]: remaining,
        };
      });
    });

    const unsubscribeUserOnline = onUserOnline((userId) => {
      setOnlineUserIds((current) => {
        const next = new Set(current);

        next.add(userId);

        return next;
      });

      setLastSeenByUserId((current) => {
        const next = {
          ...current,
        };

        delete next[userId];

        return next;
      });
    });

    const unsubscribeUserOffline = onUserOffline((event) => {
      setOnlineUserIds((current) => {
        const next = new Set(current);

        next.delete(event.userId);

        return next;
      });

      setLastSeenByUserId((current) => ({
        ...current,
        [event.userId]: event.lastSeen,
      }));
    });

    return () => {
      unsubscribeMessage();
      unsubscribeMessagesRead();
      unsubscribeConnectionStatus();
      unsubscribeTyping();
      unsubscribeStoppedTyping();
      unsubscribeUserOnline();
      unsubscribeUserOffline();
    };
  }, [activeConversationId, markAsRead]);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
      setOnlineUserIds(new Set());
      setLastSeenByUserId({});
      setError(null);

      return;
    }

    loadConversations().catch(() => undefined);
  }, [user, loadConversations]);

  const value = useMemo<MessagingContextValue>(
    () => ({
      conversations,
      activeConversationId,
      messages,
      isLoadingConversations,
      isLoadingMessages,
      isConnected,
      error,
      totalUnreadCount,
      connectionStatus,
      hasMoreMessages,
      isLoadingMoreMessages,

      typingUserIds,
      notifyTyping,
      notifyStoppedTyping,
      isUserTyping,

      onlineUserIds,
      checkUserOnline,
      lastSeenByUserId,

      loadMoreMessages,
      setActiveConversation,
      loadConversations,
      loadMessages,
      startConversation,
      sendMessage,
      markAsRead,
    }),
    [
      conversations,
      activeConversationId,
      messages,
      isLoadingConversations,
      isLoadingMessages,
      isConnected,
      error,
      totalUnreadCount,
      connectionStatus,
      hasMoreMessages,
      isLoadingMoreMessages,

      typingUserIds,
      notifyTyping,
      notifyStoppedTyping,
      isUserTyping,

      onlineUserIds,
      checkUserOnline,
      lastSeenByUserId,

      loadMoreMessages,
      setActiveConversation,
      loadConversations,
      loadMessages,
      startConversation,
      sendMessage,
      markAsRead,
    ],
  );

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);

  if (!context) {
    throw new Error("useMessaging must be used within MessagingProvider.");
  }

  return context;
}

function mergeMessage(
  messages: Message[],
  incomingMessage: Message,
): Message[] {
  const existingIndex = messages.findIndex(
    (message) => message.messageId === incomingMessage.messageId,
  );

  if (existingIndex !== -1) {
    const updated = [...messages];

    updated[existingIndex] = incomingMessage;

    return updated.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  return [...messages, incomingMessage].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
