namespace SocialApp.Application.Users.DTOs;

public record UserProfileResponse(
    Guid UserId,
    string Username,
    string Email,
    string DisplayName,
    string Bio,
    string? ProfileImageUrl,
    DateTime CreatedAt
);