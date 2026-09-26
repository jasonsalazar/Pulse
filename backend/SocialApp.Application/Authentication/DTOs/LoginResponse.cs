namespace SocialApp.Application.Authentication.DTOs;

public record LoginResponse(
    Guid UserId,
    string Username,
    string Email,
    string AccessToken);