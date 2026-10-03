import { apiRequest } from "./api";

import type {
  Conversation,
  CreateConversationRequest,
  Message,
  SendMessageRequest,
} from "../types/messaging";

export async function getConversations(
  page = 1,
  pageSize = 20,
): Promise<Conversation[]> {
  return apiRequest<Conversation[]>(
    `/conversations?page=${page}&pageSize=${pageSize}`,
  );
}

export async function createConversation(
  request: CreateConversationRequest,
): Promise<Conversation> {
  return apiRequest<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getMessages(
  conversationId: string,
  page = 1,
  pageSize = 50,
): Promise<Message[]> {
  return apiRequest<Message[]>(
    `/conversations/${conversationId}/messages?page=${page}&pageSize=${pageSize}`,
  );
}

export async function sendMessage(
  conversationId: string,
  request: SendMessageRequest,
): Promise<Message> {
  return apiRequest<Message>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function markConversationAsRead(
  conversationId: string,
): Promise<void> {
  await apiRequest<void>(`/conversations/${conversationId}/read`, {
    method: "POST",
  });
}
