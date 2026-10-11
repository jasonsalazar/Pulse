namespace SocialApp.Application.Users.DTOs;

public record UserSearchResponse(
    Guid UserId,
    string Username,
    string DisplayName,
    string? ProfileImageUrl
);