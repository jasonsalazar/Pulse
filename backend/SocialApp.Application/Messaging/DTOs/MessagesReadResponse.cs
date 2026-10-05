namespace SocialApp.Application.Messaging.DTOs;

public record MessagesReadResponse(
    Guid ConversationId,
    Guid ReaderUserId,
    IReadOnlyList<Guid> MessageIds
);