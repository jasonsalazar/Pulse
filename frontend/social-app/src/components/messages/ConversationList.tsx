import type { Conversation } from "../../types/messaging";

import { Avatar } from "../ui";

import "./ConversationList.css";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  onlineUserIds: Set<string>;
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  isLoading,
  onlineUserIds,
  onSelect,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="conversation-list">
        <div className="conversation-list__loading">
          Loading conversations...
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="conversation-list">
        <div className="conversation-list__empty">
          <h3>No conversations</h3>

          <p>Start a conversation from someone&apos;s profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => {
        const isActive = conversation.conversationId === activeConversationId;

        const formattedTime = conversation.lastMessageAt
          ? new Date(conversation.lastMessageAt).toLocaleDateString([], {
              month: "short",
              day: "numeric",
            })
          : "";

        return (
          <button
            key={conversation.conversationId}
            type="button"
            className={`conversation-list__item ${
              isActive ? "conversation-list__item--active" : ""
            }`}
            onClick={() => onSelect(conversation.conversationId)}
          >
            <Avatar
              src={conversation.otherProfileImageUrl}
              alt={conversation.otherDisplayName}
              size="md"
            />

            <div className="conversation-list__body">
              <div className="conversation-list__top">
                <span className="conversation-list__name">
                  {conversation.otherDisplayName}
                  <span
                    className={`presence-dot ${
                      onlineUserIds.has(conversation.otherUserId)
                        ? "presence-dot-online"
                        : ""
                    }`}
                  />
                </span>

                {formattedTime && (
                  <span className="conversation-list__time">
                    {formattedTime}
                  </span>
                )}
              </div>

              <div className="conversation-list__bottom">
                <span className="conversation-list__preview">
                  {conversation.lastMessagePreview ?? "Start a conversation"}
                </span>

                {conversation.unreadCount > 0 && (
                  <span className="conversation-list__badge">
                    {conversation.unreadCount > 99
                      ? "99+"
                      : conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
