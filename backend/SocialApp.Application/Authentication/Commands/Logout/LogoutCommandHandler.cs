using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Authentication.Commands.Logout;

public sealed class LogoutCommandHandler(
    IRefreshTokenRepository refreshTokens,
    IRefreshTokenService tokenService)
    : IRequestHandler<LogoutCommand, Unit>
{
    private readonly IRefreshTokenRepository _refreshTokens =
        refreshTokens;

    private readonly IRefreshTokenService _tokenService =
        tokenService;

    public async Task<Unit> Handle(
        LogoutCommand request,
        CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            var tokenHash = _tokenService.HashToken(
                request.RefreshToken);

            await _refreshTokens.RevokeByHashAsync(
                tokenHash,
                cancellationToken);
        }

        return Unit.Value;
    }
}
