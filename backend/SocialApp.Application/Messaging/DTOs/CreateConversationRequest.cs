namespace SocialApp.Application.Messaging.DTOs;

public record CreateConversationRequest(
    Guid OtherUserId);