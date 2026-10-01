namespace SocialApp.Domain.Comments;

public class Comment
{
    public Guid Id { get; private set; }

    public Guid PostId { get; private set; }

    public Guid UserId { get; private set; }

    public string Content { get; private set; } = string.Empty;

    public DateTime CreatedAt { get; private set; }

    public DateTime? UpdatedAt { get; private set; }

    private Comment()
    {
    }

    public Comment(Guid postId, Guid userId, string content)
    {
        if (postId == Guid.Empty)
        {
            throw new ArgumentException(
                "Post ID is required.",
                nameof(postId));
        }

        if (userId == Guid.Empty)
        {
            throw new ArgumentException(
                "User ID is required.",
                nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException(
                "Comment content cannot be empty.",
                nameof(content));
        }

        var trimmedContent = content.Trim();

        if (trimmedContent.Length > 500)
        {
            throw new ArgumentException(
                "Comment cannot exceed 500 characters.",
                nameof(content));
        }

        Id = Guid.NewGuid();
        PostId = postId;
        UserId = userId;
        Content = trimmedContent;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateContent(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException(
                "Comment content cannot be empty.",
                nameof(content));
        }

        var trimmedContent = content.Trim();

        if (trimmedContent.Length > 500)
        {
            throw new ArgumentException(
                "Comment cannot exceed 500 characters.",
                nameof(content));
        }

        Content = trimmedContent;
        UpdatedAt = DateTime.UtcNow;
    }
}