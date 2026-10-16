namespace SocialApp.Application.Authentication.DTOs;

public record LoginResult(
    Guid UserId,
    string Username,
    string Email,
    string AccessToken,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt
);
