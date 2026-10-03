namespace SocialApp.Domain.Messaging;

public class Conversation
{
    public Guid Id { get; private set; }

    public Guid User1Id { get; private set; }

    public Guid User2Id { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? LastMessageAt { get; private set; }

    private Conversation()
    {
    }

    private Conversation(
        Guid user1Id,
        Guid user2Id)
    {
        Id = Guid.NewGuid();

        User1Id = user1Id;
        User2Id = user2Id;

        CreatedAt = DateTime.UtcNow;
    }

    public static Conversation Create(
        Guid user1Id,
        Guid user2Id)
    {
        if (user1Id == Guid.Empty)
        {
            throw new ArgumentException(
                "User 1 ID is required.",
                nameof(user1Id));
        }

        if (user2Id == Guid.Empty)
        {
            throw new ArgumentException(
                "User 2 ID is required.",
                nameof(user2Id));
        }

        if (user1Id == user2Id)
        {
            throw new InvalidOperationException(
                "A user cannot create a conversation with themselves.");
        }

        // Store the IDs in a consistent order.
        if (user1Id.CompareTo(user2Id) > 0)
        {
            (user1Id, user2Id) =
                (user2Id, user1Id);
        }

        return new Conversation(
            user1Id,
            user2Id);
    }

    public void UpdateLastMessageTime(
        DateTime messageCreatedAt)
    {
        LastMessageAt = messageCreatedAt;
    }

    public bool ContainsUser(Guid userId)
    {
        return User1Id == userId ||
               User2Id == userId;
    }

    public Guid GetOtherUserId(Guid userId)
    {
        if (!ContainsUser(userId))
        {
            throw new InvalidOperationException(
                "User does not belong to this conversation.");
        }

        return User1Id == userId
            ? User2Id
            : User1Id;
    }
}