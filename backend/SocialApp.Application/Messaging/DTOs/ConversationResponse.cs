namespace SocialApp.Application.Messaging.DTOs;

public record ConversationResponse(
    Guid ConversationId,
    Guid User1Id,
    Guid User2Id,
    DateTime CreatedAt,
    DateTime? LastMessageAt);