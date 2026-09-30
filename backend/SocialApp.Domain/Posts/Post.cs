namespace SocialApp.Domain.Posts;

public class Post
{
    public Guid Id { get; private set; }

    public Guid UserId { get; private set; }

    public string Content { get; private set; } = string.Empty;

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    private Post()
    {
    }

    public Post(
        Guid userId,
        string content)
    {
        if (userId == Guid.Empty)
        {
            throw new ArgumentException(
                "User ID is required.",
                nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException(
                "Post content cannot be empty.",
                nameof(content));
        }

        var trimmedContent = content.Trim();

        if (trimmedContent.Length > 500)
        {
            throw new ArgumentException(
                "Post content cannot exceed 500 characters.",
                nameof(content));
        }

        Id = Guid.NewGuid();
        UserId = userId;
        Content = trimmedContent;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException(
                "Post content cannot be empty.",
                nameof(content));
        }

        var trimmedContent = content.Trim();

        if (trimmedContent.Length > 500)
        {
            throw new ArgumentException(
                "Post content cannot exceed 500 characters.",
                nameof(content));
        }

        Content = trimmedContent;
        UpdatedAt = DateTime.UtcNow;
    }
}