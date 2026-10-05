using SocialApp.Domain.Messaging;

namespace SocialApp.Application.Common;

public interface IMessageRepository
{
    Task<Message?> GetByIdAsync(
        Guid messageId,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<Message>> GetConversationMessagesAsync(
        Guid conversationId,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    Task<IReadOnlyDictionary<Guid, Message>>
        GetLatestForConversationsAsync(
            IReadOnlyCollection<Guid> conversationIds,
            CancellationToken cancellationToken);

    Task<IReadOnlyDictionary<Guid, int>>
        GetUnreadCountsForConversationsAsync(
            IReadOnlyCollection<Guid> conversationIds,
            Guid userId,
            CancellationToken cancellationToken);

    Task AddAsync(
        Message message,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<Guid>> MarkConversationAsReadAsync(
        Guid conversationId,
        Guid userId,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}