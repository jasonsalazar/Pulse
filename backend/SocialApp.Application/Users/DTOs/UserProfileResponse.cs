namespace SocialApp.Application.Users.DTOs;

public record UserProfileResponse(
    Guid UserId,
    string Username,
    string Email,
    string DisplayName,
    string Bio,
    string? ProfileImageUrl,
    DateTime CreatedAt,
    int FollowerCount,
    int FollowingCount,
    bool IsFollowing
);