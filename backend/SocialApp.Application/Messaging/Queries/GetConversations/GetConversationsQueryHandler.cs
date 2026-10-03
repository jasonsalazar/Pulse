using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Queries.GetConversations;

public class GetConversationsQueryHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository,
    IUserRepository userRepository)
        : IRequestHandler<
        GetConversationsQuery,
        IReadOnlyList<ConversationListItemResponse>>
{
    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

    private readonly IMessageRepository
        _messageRepository =
            messageRepository;

    private readonly IUserRepository
        _userRepository =
            userRepository;

    public async Task<
        IReadOnlyList<ConversationListItemResponse>>
        Handle(
            GetConversationsQuery request,
            CancellationToken cancellationToken)
    {
        if (request.Page < 1)
        {
            throw new ArgumentException(
                "Page must be greater than zero.",
                nameof(request.Page));
        }

        if (request.PageSize < 1 ||
            request.PageSize > 100)
        {
            throw new ArgumentException(
                "Page size must be between 1 and 100.",
                nameof(request.PageSize));
        }

        var conversations =
            await _conversationRepository
                .GetForUserAsync(
                    request.CurrentUserId,
                    request.Page,
                    request.PageSize,
                    cancellationToken);

        if (conversations.Count == 0)
        {
            return Array.Empty<ConversationListItemResponse>();
        }

        var conversationIds =
            conversations
                .Select(conversation => conversation.Id)
                .ToList();

        var otherUserIds =
            conversations
                .Select(
                    conversation =>
                        conversation.GetOtherUserId(
                            request.CurrentUserId))
                .Distinct()
                .ToList();

        // Batch-load all users.
        var users =
            await _userRepository.GetByIdsAsync(
                otherUserIds,
                cancellationToken);

        // Batch-load latest messages.
        var latestMessages =
            await _messageRepository
                .GetLatestForConversationsAsync(
                    conversationIds,
                    cancellationToken);

        // Batch-load unread counts.
        var unreadCounts =
            await _messageRepository
                .GetUnreadCountsForConversationsAsync(
                    conversationIds,
                    request.CurrentUserId,
                    cancellationToken);

        var userLookup =
            users.ToDictionary(
                user => user.Id);

        var results =
            new List<ConversationListItemResponse>(
                conversations.Count);

        foreach (var conversation in conversations)
        {
            var otherUserId =
                conversation.GetOtherUserId(
                    request.CurrentUserId);

            if (!userLookup.TryGetValue(
                    otherUserId,
                    out var otherUser))
            {
                continue;
            }

            latestMessages.TryGetValue(
                conversation.Id,
                out var latestMessage);

            unreadCounts.TryGetValue(
                conversation.Id,
                out var unreadCount);

            results.Add(
                new ConversationListItemResponse(
                    conversation.Id,
                    otherUser.Id,
                    otherUser.Username,
                    otherUser.DisplayName,
                    otherUser.ProfileImageUrl,
                    latestMessage?.Content,
                    latestMessage?.CreatedAt,
                    unreadCount));
        }

        return results;
    }
}