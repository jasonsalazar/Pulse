import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useMessaging } from "../../context/MessagingContext";

import ConversationList from "../../components/messages/ConversationList";
import ChatWindow from "../../components/messages/ChatWindow";

import "./MessagesPage.css";

export default function MessagesPage() {
  const { user } = useAuth();

  const {
    conversations,
    activeConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isLoadingMoreMessages,
    hasMoreMessages,
    isConnected,
    connectionStatus,
    error,
    notifyTyping,
    notifyStoppedTyping,
    isUserTyping,
    loadMoreMessages,
    setActiveConversation,
    sendMessage,
    onlineUserIds,
    checkUserOnline,
  } = useMessaging();

  const [searchParams, setSearchParams] = useSearchParams();

  const conversationFromUrl = searchParams.get("conversation");

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.conversationId === activeConversationId,
      ) ?? null,
    [conversations, activeConversationId],
  );

  const handleSelectConversation = async (conversationId: string) => {
    await setActiveConversation(conversationId);

    setSearchParams({
      conversation: conversationId,
    });
  };

  const handleBack = () => {
    setSearchParams({});
    setActiveConversation(null);
  };

  const isOtherUserTyping = activeConversation
    ? isUserTyping(activeConversation.conversationId)
    : false;

  const isOtherUserOnline = activeConversation
    ? onlineUserIds.has(activeConversation.otherUserId)
    : false;

  useEffect(() => {
    if (!conversationFromUrl || activeConversationId === conversationFromUrl) {
      return;
    }

    const conversationExists = conversations.some(
      (conversation) => conversation.conversationId === conversationFromUrl,
    );

    if (!conversationExists) {
      return;
    }

    setActiveConversation(conversationFromUrl).catch(() => undefined);
  }, [
    conversationFromUrl,
    activeConversationId,
    conversations,
    setActiveConversation,
  ]);

  useEffect(() => {
    if (!activeConversation) {
      return;
    }

    checkUserOnline(activeConversation.otherUserId).catch(() => undefined);
  }, [activeConversation, checkUserOnline, isOtherUserOnline, onlineUserIds]);

  if (!user) {
    return null;
  }

  return (
    <div className="messages-page">
      <header className="messages-page__header">
        <div>
          <h1>Messages</h1>

          <p>Chat privately with other people.</p>
        </div>
      </header>

      <div className="messages-page__content">
        <aside
          className={`messages-page__conversations ${
            activeConversationId
              ? "messages-page__conversations--mobile-hidden"
              : ""
          }`}
        >
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            isLoading={isLoadingConversations}
            onSelect={handleSelectConversation}
            onlineUserIds={onlineUserIds}
          />
        </aside>

        <main
          className={`messages-page__chat ${
            !activeConversationId ? "messages-page__chat--mobile-hidden" : ""
          }`}
        >
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            currentUserId={user.userId}
            isLoading={isLoadingMessages}
            isLoadingMoreMessages={isLoadingMoreMessages}
            hasMoreMessages={hasMoreMessages}
            isConnected={isConnected}
            connectionStatus={connectionStatus}
            error={error}
            onTypingStart={() => {
              if (activeConversation) {
                notifyTyping(activeConversation.conversationId).catch(
                  () => undefined,
                );
              }
            }}
            onTypingStop={() => {
              if (activeConversation) {
                notifyStoppedTyping(activeConversation.conversationId).catch(
                  () => undefined,
                );
              }
            }}
            isOtherUserTyping={isOtherUserTyping}
            isOtherUserOnline={isOtherUserOnline}
            onLoadMoreMessages={loadMoreMessages}
            onSendMessage={async (content) => {
              await sendMessage(content);
            }}
            onBack={activeConversationId ? handleBack : undefined}
          />
        </main>
      </div>
    </div>
  );
}
