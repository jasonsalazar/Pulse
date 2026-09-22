namespace SocialApp.Application.Authentication.DTOs;

public record AuthResponse(
    Guid UserId,
    string Username,
    string Email
);