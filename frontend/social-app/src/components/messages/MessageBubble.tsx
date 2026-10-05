import type { Message } from "../../types/messaging";

import "./MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`message-bubble-row ${
        isOwnMessage ? "message-bubble-row--own" : "message-bubble-row--other"
      }`}
    >
      <div
        className={`message-bubble ${
          isOwnMessage ? "message-bubble--own" : "message-bubble--other"
        }`}
      >
        <p className="message-bubble__content">{message.content}</p>

        <span className="message-bubble__time">{formattedTime}</span>

        {isOwnMessage && (
          <span
            className={
              message.isRead
                ? "message-read-status message-read-status-read"
                : "message-read-status"
            }
            aria-label={message.isRead ? "Read" : "Sent"}
          >
            {message.isRead ? "✓✓" : "✓"}
          </span>
        )}
      </div>
    </div>
  );
}
