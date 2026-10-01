namespace SocialApp.Domain.Follows;

public class UserFollow
{
    public Guid Id { get; private set; }

    public Guid FollowerId { get; private set; }

    public Guid FollowingId { get; private set; }

    public DateTime CreatedAt { get; private set; }

    private UserFollow()
    {
    }

    public UserFollow(Guid followerId, Guid followingId)
    {
        if (followerId == Guid.Empty)
        {
            throw new ArgumentException(
                "Follower ID is required.",
                nameof(followerId));
        }

        if (followingId == Guid.Empty)
        {
            throw new ArgumentException(
                "Following ID is required.",
                nameof(followingId));
        }

        if (followerId == followingId)
        {
            throw new InvalidOperationException(
                "A user cannot follow themselves.");
        }

        Id = Guid.NewGuid();
        FollowerId = followerId;
        FollowingId = followingId;
        CreatedAt = DateTime.UtcNow;
    }
}