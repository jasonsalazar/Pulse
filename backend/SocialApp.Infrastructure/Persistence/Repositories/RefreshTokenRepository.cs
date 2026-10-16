using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Authentication;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public sealed class RefreshTokenRepository(
    AppDbContext dbContext)
        : IRefreshTokenRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<RefreshToken?> GetByHashAsync(
        string tokenHash,
        CancellationToken cancellationToken)
    {
        return _dbContext.RefreshTokens
            .SingleOrDefaultAsync(
                token => token.TokenHash == tokenHash,
                cancellationToken);
    }

    public async Task<bool> TryRotateAsync(
        string currentTokenHash,
        RefreshToken replacementToken,
        string replacementTokenHash,
        CancellationToken cancellationToken)
    {
        await using var transaction =
            await _dbContext.Database.BeginTransactionAsync(
                cancellationToken);

        var now = DateTime.UtcNow;

        var updated = await _dbContext.RefreshTokens
            .Where(token =>
                token.TokenHash == currentTokenHash &&
                token.RevokedAt == null &&
                token.ExpiresAt > now)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(
                        token => token.RevokedAt,
                        now)
                    .SetProperty(
                        token => token.ReplacedByTokenHash,
                        replacementTokenHash),
                cancellationToken);

        if (updated != 1)
        {
            await transaction.RollbackAsync(
                cancellationToken);

            return false;
        }

        await _dbContext.RefreshTokens.AddAsync(
            replacementToken,
            cancellationToken);

        await _dbContext.SaveChangesAsync(
            cancellationToken);

        await transaction.CommitAsync(
            cancellationToken);

        return true;
    }

    public async Task RevokeByHashAsync(
        string tokenHash,
        CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;

        await _dbContext.RefreshTokens
            .Where(token =>
                token.TokenHash == tokenHash &&
                token.RevokedAt == null)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(
                        token => token.RevokedAt,
                        now),
                cancellationToken);
    }

    public async Task AddAsync(
        RefreshToken token,
        CancellationToken cancellationToken)
    {
        await _dbContext.RefreshTokens.AddAsync(
            token,
            cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}