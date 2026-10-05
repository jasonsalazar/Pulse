using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Commands.MarkConversationAsRead;

public class MarkConversationAsReadCommandHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository)
        : IRequestHandler<
        MarkConversationAsReadCommand,
        MessagesReadResponse>
{
    private readonly IConversationRepository
        _conversationRepository = conversationRepository;
    private readonly IMessageRepository
        _messageRepository = messageRepository;

    public async Task<MessagesReadResponse> Handle(
        MarkConversationAsReadCommand request,
        CancellationToken cancellationToken)
    {
        var conversation =
            await _conversationRepository.GetByIdAsync(
                request.ConversationId,
                cancellationToken);

        if (conversation is null)
        {
            throw new KeyNotFoundException(
                "Conversation not found.");
        }

        if (!conversation.ContainsUser(request.CurrentUserId))
        {
            throw new UnauthorizedAccessException(
                "You do not belong to this conversation.");
        }

        var messageIds =
            await _messageRepository.MarkConversationAsReadAsync(
                request.ConversationId,
                request.CurrentUserId,
                cancellationToken);

        if (messageIds.Count > 0)
        {
            await _messageRepository.SaveChangesAsync(
                cancellationToken);
        }

        return new MessagesReadResponse(
            request.ConversationId,
            request.CurrentUserId,
            messageIds);
    }
}