namespace SocialApp.Domain.Likes;

public class PostLike
{
    public Guid Id { get; private set; }

    public Guid PostId { get; private set; }

    public Guid UserId { get; private set; }

    public DateTime CreatedAt { get; private set; }

    private PostLike()
    {
    }

    public PostLike(Guid postId, Guid userId)
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

        Id = Guid.NewGuid();
        PostId = postId;
        UserId = userId;
        CreatedAt = DateTime.UtcNow;
    }
}