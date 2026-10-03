namespace SocialApp.Domain.Messaging;

public class Message
{
    public Guid Id { get; private set; }

    public Guid ConversationId { get; private set; }

    public Guid SenderId { get; private set; }

    public string Content { get; private set; }

    public DateTime CreatedAt { get; private set; }

    public DateTime? ReadAt { get; private set; }

    private Message()
    {
        Content = string.Empty;
    }

    private Message(
        Guid conversationId,
        Guid senderId,
        string content)
    {
        Id = Guid.NewGuid();

        ConversationId = conversationId;

        SenderId = senderId;

        Content = content;

        CreatedAt = DateTime.UtcNow;
    }

    public static Message Create(
        Guid conversationId,
        Guid senderId,
        string content)
    {
        if (conversationId == Guid.Empty)
        {
            throw new ArgumentException(
                "Conversation ID is required.",
                nameof(conversationId));
        }

        if (senderId == Guid.Empty)
        {
            throw new ArgumentException(
                "Sender ID is required.",
                nameof(senderId));
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            throw new ArgumentException(
                "Message content is required.",
                nameof(content));
        }

        content = content.Trim();

        if (content.Length > 2000)
        {
            throw new ArgumentException(
                "Message cannot exceed 2000 characters.",
                nameof(content));
        }

        return new Message(
            conversationId,
            senderId,
            content);
    }

    public void MarkAsRead()
    {
        ReadAt ??= DateTime.UtcNow;
    }

    public bool IsRead =>
        ReadAt.HasValue;
}