namespace SocialApp.Application.Messaging.DTOs;

public record MessageResponse(
    Guid MessageId,
    Guid ConversationId,
    Guid SenderId,
    string Content,
    DateTime CreatedAt,
    bool IsRead
);