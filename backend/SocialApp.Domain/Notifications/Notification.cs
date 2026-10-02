namespace SocialApp.Domain.Notifications;

public class Notification
{
    public Guid Id { get; private set; }

    public Guid RecipientId { get; private set; }

    public Guid ActorId { get; private set; }

    public NotificationType Type { get; private set; }

    public Guid? PostId { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? ReadAt { get; private set; }

    private Notification()
    {
    }

    public Notification(
        Guid recipientId,
        Guid actorId,
        NotificationType type,
        Guid? postId = null)
    {
        if (recipientId == Guid.Empty)
        {
            throw new ArgumentException(
                "Recipient ID is required.",
                nameof(recipientId));
        }

        if (actorId == Guid.Empty)
        {
            throw new ArgumentException(
                "Actor ID is required.",
                nameof(actorId));
        }

        if (recipientId == actorId)
        {
            throw new InvalidOperationException(
                "A user cannot receive a notification from themselves.");
        }

        Id = Guid.NewGuid();
        RecipientId = recipientId;
        ActorId = actorId;
        Type = type;
        PostId = postId;
        CreatedAt = DateTime.UtcNow;
        ReadAt = null;
    }

    public void MarkAsRead()
    {
        if (ReadAt is null)
        {
            ReadAt = DateTime.UtcNow;
        }
    }
}