namespace SocialApp.Domain.Users;

public class User
{
    public Guid Id { get; private set; }

    public string Username { get; private set; } = string.Empty;

    public string Email { get; private set; } = string.Empty;

    public string PasswordHash { get; private set; } = string.Empty;

    public DateTime CreatedAt { get; private set; }

    public string DisplayName { get; private set; } = string.Empty;

    public string Bio { get; private set; } = string.Empty;

    public string? ProfileImageUrl { get; private set; }

    private User()
    {
    }

    public User(
        string username,
        string email,
        string passwordHash)
    {
        Id = Guid.NewGuid();

        Username = username;
        Email = email;
        PasswordHash = passwordHash;

        CreatedAt = DateTime.UtcNow;

        DisplayName = username;
        Bio = string.Empty;
        ProfileImageUrl = null;
    }

    public void SetPasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new ArgumentException(
                "Password hash cannot be empty.",
                nameof(passwordHash));
        }

        PasswordHash = passwordHash;
    }

    public void UpdateProfile(
        string displayName,
        string bio,
        string? profileImageUrl)
    {
        if (string.IsNullOrWhiteSpace(displayName))
        {
            throw new ArgumentException(
                "Display name cannot be empty.",
                nameof(displayName));
        }

        DisplayName = displayName.Trim();
        Bio = bio?.Trim() ?? string.Empty;

        ProfileImageUrl =
            string.IsNullOrWhiteSpace(profileImageUrl)
                ? null
                : profileImageUrl.Trim();
    }
}
