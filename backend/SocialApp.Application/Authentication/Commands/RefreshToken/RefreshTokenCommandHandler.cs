using MediatR;
using SocialApp.Application.Common;
using static SocialApp.Domain.Authentication.RefreshToken;

namespace SocialApp.Application.Authentication.Commands.RefreshToken;

public sealed class RefreshTokenCommandHandler(
    IRefreshTokenRepository refreshTokens,
    IRefreshTokenService tokenService,
    IUserRepository users,
    IJwtService jwtService)
        : IRequestHandler<
        RefreshTokenCommand,
        RefreshTokenResult>
{
    private readonly IRefreshTokenRepository _refreshTokens = refreshTokens;
    private readonly IRefreshTokenService _tokenService = tokenService;
    private readonly IUserRepository _users = users;
    private readonly IJwtService _jwtService = jwtService;

    public async Task<RefreshTokenResult> Handle(
        RefreshTokenCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            throw new UnauthorizedAccessException(
                "Invalid refresh token.");
        }

        var oldHash =
            _tokenService.HashToken(request.Token);

        var existing =
            await _refreshTokens.GetByHashAsync(
                oldHash,
                cancellationToken);

        if (existing is null || !existing.IsActive)
        {
            throw new UnauthorizedAccessException(
                "Refresh token is invalid or expired.");
        }

        var user =
            await _users.GetByIdAsync(
                existing.UserId,
                cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "The user account is unavailable.");
        }

        var accessToken =
            _jwtService.GenerateToken(user);

        var rawRefreshToken =
            _tokenService.GenerateToken();

        var newHash =
            _tokenService.HashToken(rawRefreshToken);

        var expiresAt =
            DateTime.UtcNow.AddDays(7);

        var replacement = Create(
            user.Id,
            newHash,
            expiresAt);

        var rotated =
            await _refreshTokens.TryRotateAsync(
                oldHash,
                replacement,
                newHash,
                cancellationToken);

        if (!rotated)
        {
            throw new UnauthorizedAccessException(
                "Refresh token has already been used or expired.");
        }

        return new RefreshTokenResult(
            user.Id,
            accessToken,
            rawRefreshToken,
            expiresAt);
    }
}