export interface Conversation {
  conversationId: string;
  otherUserId: string;
  otherUsername: string;
  otherDisplayName: string;
  otherProfileImageUrl: string | null;
  lastMessagePreview: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface CreateConversationRequest {
  otherUserId: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface MessagesRead {
  conversationId: string;
  readerUserId: string;
  messageIds: string[];
}

export interface UserTypingEvent {
  conversationId: string;
  userId: string;
}
