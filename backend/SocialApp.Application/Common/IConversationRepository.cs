using SocialApp.Domain.Messaging;

namespace SocialApp.Application.Common;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(
        Guid conversationId,
        CancellationToken cancellationToken);

    Task<Conversation?> GetBetweenUsersAsync(
        Guid user1Id,
        Guid user2Id,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<Conversation>> GetForUserAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    Task AddAsync(
        Conversation conversation,
        CancellationToken cancellationToken);

    Task SaveChangesAsync(
        CancellationToken cancellationToken);
}