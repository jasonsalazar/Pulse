namespace SocialApp.Application.Messaging.DTOs;

public record ConversationListItemResponse(
    Guid ConversationId,
    Guid OtherUserId,
    string OtherUsername,
    string OtherDisplayName,
    string? OtherProfileImageUrl,
    string? LastMessagePreview,
    DateTime? LastMessageAt,
    int UnreadCount);