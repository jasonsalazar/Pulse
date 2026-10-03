using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Messaging;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class ConversationRepository(
    AppDbContext context)
        : IConversationRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Conversation?> GetByIdAsync(
        Guid conversationId,
        CancellationToken cancellationToken)
    {
        return await _context.Conversations
            .FirstOrDefaultAsync(
                conversation =>
                    conversation.Id == conversationId,
                cancellationToken);
    }

    public async Task<Conversation?> GetBetweenUsersAsync(
        Guid user1Id,
        Guid user2Id,
        CancellationToken cancellationToken)
    {
        if (user1Id.CompareTo(user2Id) > 0)
        {
            (user1Id, user2Id) =
                (user2Id, user1Id);
        }

        return await _context.Conversations
            .FirstOrDefaultAsync(
                conversation =>
                    conversation.User1Id == user1Id &&
                    conversation.User2Id == user2Id,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Conversation>>
        GetForUserAsync(
            Guid userId,
            int page,
            int pageSize,
            CancellationToken cancellationToken)
    {
        return await _context.Conversations
            .AsNoTracking()
            .Where(
                conversation =>
                    conversation.User1Id == userId ||
                    conversation.User2Id == userId)
            .OrderByDescending(
                conversation =>
                    conversation.LastMessageAt ??
                    conversation.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Conversation conversation,
        CancellationToken cancellationToken)
    {
        await _context.Conversations.AddAsync(
            conversation,
            cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(
            cancellationToken);
    }
}