namespace SocialApp.Application.Users.DTOs;

public record UpdateProfileRequest(
    string DisplayName,
    string Bio,
    string? ProfileImageUrl
);