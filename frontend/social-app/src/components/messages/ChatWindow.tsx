import { useEffect, useRef, useState } from "react";

import type { Conversation, Message } from "../../types/messaging";

import { Avatar, Spinner } from "../ui";

import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";

import "./ChatWindow.css";
import { formatLastSeen } from "./presenceUtils";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  isLoadingMoreMessages: boolean;
  hasMoreMessages: boolean;
  isConnected: boolean;
  connectionStatus:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  error: string | null;

  onTypingStart?: () => void;
  onTypingStop?: () => void;
  isOtherUserTyping: boolean;
  isOtherUserOnline: boolean;
  otherUserLastSeen: string | null;

  onLoadMoreMessages: () => Promise<void>;
  onSendMessage: (content: string) => Promise<void>;
  onBack?: () => void;
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  isLoading,
  isLoadingMoreMessages,
  hasMoreMessages,
  connectionStatus,
  error,
  onTypingStart,
  onTypingStop,
  isOtherUserTyping,
  isOtherUserOnline,
  otherUserLastSeen,
  onLoadMoreMessages,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCount = useRef(0);

  const [, setPresenceTick] = useState(0);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({
  //     behavior: "smooth",
  //   });
  // }, [messages]);

  useEffect(() => {
    if (isOtherUserOnline) {
      return;
    }

    const interval = window.setInterval(() => {
      setPresenceTick((value) => value + 1);
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isOtherUserOnline]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const scrollContainer = container;

    async function handleScroll() {
      if (scrollContainer.scrollTop > 100) {
        return;
      }

      if (!hasMoreMessages || isLoadingMoreMessages) {
        return;
      }

      const previousScrollHeight = scrollContainer.scrollHeight;

      const previousScrollTop = scrollContainer.scrollTop;

      await onLoadMoreMessages();

      requestAnimationFrame(() => {
        const newScrollHeight = scrollContainer.scrollHeight;

        scrollContainer.scrollTop =
          previousScrollTop + (newScrollHeight - previousScrollHeight);
      });
    }

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [hasMoreMessages, isLoadingMoreMessages, onLoadMoreMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const wasInitialLoad = previousMessageCount.current === 0;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    const isNearBottom = distanceFromBottom < 120;

    if (wasInitialLoad || isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }

    previousMessageCount.current = messages.length;
  }, [messages]);

  if (!conversation) {
    return (
      <section className="chat-window chat-window--empty">
        <div className="chat-window__empty">
          <div className="chat-window__empty-icon">💬</div>

          <h2>Your messages</h2>

          <p>Select a conversation to start chatting.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        {onBack && (
          <button
            type="button"
            className="chat-window__back"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            ←
          </button>
        )}

        <Avatar
          src={conversation.otherProfileImageUrl}
          alt={conversation.otherDisplayName}
          size="md"
        />

        <div className="chat-window__user">
          <h2>{conversation.otherDisplayName}</h2>

          <span>@{conversation.otherUsername}</span>
        </div>

        <div className="chat-user-status">
          <span
            className={`presence-dot ${
              isOtherUserOnline ? "presence-dot-online" : ""
            }`}
            aria-hidden="true"
          />

          <span>
            {isOtherUserOnline ? "Online" : formatLastSeen(otherUserLastSeen)}
          </span>
        </div>

        <div
          className={`chat-connection-status chat-connection-status--${connectionStatus}`}
        >
          <span className="chat-connection-dot" />

          <span>
            {connectionStatus === "connected" && "Connected"}
            {connectionStatus === "connecting" && "Connecting..."}
            {connectionStatus === "reconnecting" && "Reconnecting..."}
            {connectionStatus === "disconnected" && "Disconnected"}
          </span>
        </div>
      </header>

      {error && <div className="chat-error">{error}</div>}

      <div ref={messagesContainerRef} className="chat-window__messages">
        {!hasMoreMessages && messages.length > 0 && (
          <div className="conversation-start">Beginning of conversation</div>
        )}

        {isLoadingMoreMessages && (
          <div className="messages-loading-more">
            <Spinner />
            <span>Loading older messages...</span>
          </div>
        )}

        {isLoading ? (
          <div className="chat-window__loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="chat-window__no-messages">
            <p>No messages yet.</p>

            <span>Start the conversation!</span>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.messageId}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
            />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {isOtherUserTyping && (
        <div className="typing-indicator" aria-live="polite">
          <span>{conversation?.otherDisplayName} is typing</span>
        </div>
      )}

      <MessageComposer
        onSend={onSendMessage}
        disabled={connectionStatus !== "connected"}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </section>
  );
}
