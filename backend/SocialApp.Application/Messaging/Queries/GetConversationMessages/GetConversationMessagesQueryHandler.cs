using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Queries.GetConversationMessages;

public class GetConversationMessagesQueryHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository)
        : IRequestHandler<
        GetConversationMessagesQuery,
        IReadOnlyList<MessageResponse>>
{
    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

    private readonly IMessageRepository
        _messageRepository =
            messageRepository;

    public async Task<IReadOnlyList<MessageResponse>>
        Handle(
            GetConversationMessagesQuery request,
            CancellationToken cancellationToken)
    {
        var conversation =
            await _conversationRepository
                .GetByIdAsync(
                    request.ConversationId,
                    cancellationToken);

        if (conversation is null)
        {
            throw new KeyNotFoundException(
                "Conversation not found.");
        }

        if (!conversation.ContainsUser(
                request.CurrentUserId))
        {
            throw new UnauthorizedAccessException(
                "You do not belong to this conversation.");
        }

        var messages =
            await _messageRepository
                .GetConversationMessagesAsync(
                    request.ConversationId,
                    request.Page,
                    request.PageSize,
                    cancellationToken);

        return [.. messages
            .Select(
                message =>
                    new MessageResponse(
                        message.Id,
                        message.ConversationId,
                        message.SenderId,
                        message.Content,
                        message.CreatedAt,
                        message.IsRead))];
    }
}