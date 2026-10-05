using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Messaging;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class MessageRepository(
    AppDbContext context)
        : IMessageRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Message?> GetByIdAsync(
        Guid messageId,
        CancellationToken cancellationToken)
    {
        return await _context.Messages
            .FirstOrDefaultAsync(
                message =>
                    message.Id == messageId,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Message>>
        GetConversationMessagesAsync(
            Guid conversationId,
            int page,
            int pageSize,
            CancellationToken cancellationToken)
    {
        return await _context.Messages
            .AsNoTracking()
            .Where(
                message =>
                    message.ConversationId ==
                    conversationId)
            .OrderByDescending(
                message =>
                    message.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderBy(
                message =>
                    message.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Message message,
        CancellationToken cancellationToken)
    {
        await _context.Messages.AddAsync(
            message,
            cancellationToken);
    }

    public async Task<IReadOnlyList<Guid>> MarkConversationAsReadAsync(
    Guid conversationId,
    Guid userId,
    CancellationToken cancellationToken)
    {
        var messages = await _context.Messages
            .Where(message =>
                message.ConversationId == conversationId &&
                message.SenderId != userId &&
                message.ReadAt == null)
            .ToListAsync(cancellationToken);

        if (messages.Count == 0)
        {
            return [];
        }

        foreach (var message in messages)
        {
            message.MarkAsRead();
        }

        return [.. messages.Select(message => message.Id)];
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(
            cancellationToken);
    }

    public async Task<IReadOnlyDictionary<Guid, Message>>
        GetLatestForConversationsAsync(
            IReadOnlyCollection<Guid> conversationIds,
            CancellationToken cancellationToken)
    {
        if (conversationIds.Count == 0)
        {
            return new Dictionary<Guid, Message>();
        }

        var messages = await _context.Messages
            .AsNoTracking()
            .Where(message =>
                conversationIds.Contains(
                    message.ConversationId))
            .GroupBy(message =>
                message.ConversationId)
            .Select(group =>
                group
                    .OrderByDescending(
                        message => message.CreatedAt)
                    .First())
            .ToListAsync(cancellationToken);

        return messages.ToDictionary(
            message => message.ConversationId);
    }

    public async Task<IReadOnlyDictionary<Guid, int>>
        GetUnreadCountsForConversationsAsync(
            IReadOnlyCollection<Guid> conversationIds,
            Guid userId,
            CancellationToken cancellationToken)
    {
        if (conversationIds.Count == 0)
        {
            return new Dictionary<Guid, int>();
        }

        var counts = await _context.Messages
            .AsNoTracking()
            .Where(message =>
                conversationIds.Contains(
                    message.ConversationId) &&
                message.SenderId != userId &&
                message.ReadAt == null)
            .GroupBy(message =>
                message.ConversationId)
            .Select(group => new
            {
                ConversationId = group.Key,
                Count = group.Count()
            })
            .ToListAsync(cancellationToken);

        return counts.ToDictionary(
            item => item.ConversationId,
            item => item.Count);
    }
}