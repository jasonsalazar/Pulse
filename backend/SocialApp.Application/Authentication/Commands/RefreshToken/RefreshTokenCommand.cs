using MediatR;

namespace SocialApp.Application.Authentication.Commands.RefreshToken;

public record RefreshTokenCommand(string Token)
    : IRequest<RefreshTokenResult>;

public record RefreshTokenResult(
    Guid UserId,
    string AccessToken,
    string RefreshToken,
    DateTime RefreshTokenExpiresAt
);