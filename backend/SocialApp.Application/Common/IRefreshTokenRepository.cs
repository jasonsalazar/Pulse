using SocialApp.Domain.Authentication;

namespace SocialApp.Application.Common;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByHashAsync(
        string tokenHash,
        CancellationToken cancellationToken);

    Task<bool> TryRotateAsync(
        string currentTokenHash,
        RefreshToken replacementToken,
        string replacementTokenHash,
        CancellationToken cancellationToken);

    Task RevokeByHashAsync(
    string tokenHash,
    CancellationToken cancellationToken);

    Task AddAsync(
        RefreshToken token,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}