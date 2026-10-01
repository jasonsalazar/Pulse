namespace SocialApp.Application.Follows.DTOs;

public record UserFollowResponse(
    Guid UserId,
    string Username,
    string DisplayName,
    string? ProfileImageUrl
);