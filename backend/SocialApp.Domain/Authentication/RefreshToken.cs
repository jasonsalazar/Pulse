namespace SocialApp.Domain.Authentication;

public sealed class RefreshToken
{
    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string TokenHash { get; private set; } = string.Empty;

    public DateTime CreatedAt { get; private set; }

    public DateTime ExpiresAt { get; private set; }

    public DateTime? RevokedAt { get; private set; }

    public string? ReplacedByTokenHash { get; private set; }

    private RefreshToken()
    {
    }

    public static RefreshToken Create(
        Guid userId,
        string tokenHash,
        DateTime expiresAt)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException(
                "User ID is required.",
                nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(tokenHash))
        {
            throw new ArgumentException(
                "Token hash is required.",
                nameof(tokenHash));
        }

        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = tokenHash,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        };
    }

    public bool IsActive =>
        RevokedAt is null &&
        ExpiresAt > DateTime.UtcNow;

    public void Revoke(
        string? replacementTokenHash = null)
    {
        if (RevokedAt.HasValue)
        {
            return;
        }

        RevokedAt = DateTime.UtcNow;
        ReplacedByTokenHash = replacementTokenHash;
    }
}