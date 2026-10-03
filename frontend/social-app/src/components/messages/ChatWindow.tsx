import { useEffect, useRef } from "react";

import type { Conversation, Message } from "../../types/messaging";

import { Avatar } from "../ui";

import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";

import "./ChatWindow.css";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
  isConnected: boolean;
  connectionStatus:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  error: string | null;
  onSendMessage: (content: string) => Promise<void>;
  onBack?: () => void;
}

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  isLoading,
  connectionStatus,
  error,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (error) {
    return <div className="chat-error">{error}</div>;
  }

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

      <div className="chat-window__messages">
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

      <MessageComposer
        onSend={onSendMessage}
        disabled={connectionStatus !== "connected"}
      />
    </section>
  );
}
