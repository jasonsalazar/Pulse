using MediatR;
using SocialApp.Application.Common;

namespace SocialApp.Application.Messaging.Commands.MarkConversationAsRead;

public class MarkConversationAsReadCommandHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository)
        : IRequestHandler<
        MarkConversationAsReadCommand>
{
    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

    private readonly IMessageRepository
        _messageRepository =
            messageRepository;

    public async Task Handle(
        MarkConversationAsReadCommand request,
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

        await _messageRepository
            .MarkConversationAsReadAsync(
                request.ConversationId,
                request.CurrentUserId,
                cancellationToken);

        await _messageRepository
            .SaveChangesAsync(
                cancellationToken);
    }
}