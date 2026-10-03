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
  setActiveConversation: (conversationId: string | null) => Promise<void>;
  loadConversations: () => Promise<void>;
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
    try {
      setIsLoadingMessages(true);
      setError(null);

      const result = await getMessages(conversationId);

      setMessages(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages.");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await markConversationAsRead(conversationId);

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.conversationId === conversationId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark conversation as read.",
      );
    }
  }, []);

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

    const unsubscribeConnectionStatus =
      onConnectionStatusChanged(setConnectionStatus);

    return () => {
      unsubscribeMessage();
      unsubscribeConnectionStatus();
    };
  }, [activeConversationId, markAsRead]);

  useEffect(() => {
    if (!user) {
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);

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
