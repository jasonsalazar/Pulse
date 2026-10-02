namespace SocialApp.Application.Notifications.DTOs;

public record NotificationResponse(
    Guid NotificationId,
    Guid ActorId,
    string ActorUsername,
    string ActorDisplayName,
    string? ActorProfileImageUrl,
    string Type,
    Guid? PostId,
    DateTime CreatedAt,
    bool IsRead
);