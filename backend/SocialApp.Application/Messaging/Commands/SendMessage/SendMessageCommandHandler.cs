using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Messaging.DTOs;
using SocialApp.Domain.Messaging;

namespace SocialApp.Application.Messaging.Commands.SendMessage;

public class SendMessageCommandHandler(
    IConversationRepository conversationRepository,
    IMessageRepository messageRepository)
        : IRequestHandler<
        SendMessageCommand,
        MessageResponse>
{
    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

    private readonly IMessageRepository
        _messageRepository =
            messageRepository;

    public async Task<MessageResponse> Handle(
        SendMessageCommand request,
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

        var message =
            Message.Create(
                conversation.Id,
                request.CurrentUserId,
                request.Content);

        await _messageRepository.AddAsync(
            message,
            cancellationToken);

        conversation.UpdateLastMessageTime(
            message.CreatedAt);

        await _conversationRepository.SaveChangesAsync(
            cancellationToken);

        return new MessageResponse(
            message.Id,
            message.ConversationId,
            message.SenderId,
            message.Content,
            message.CreatedAt,
            message.IsRead);
    }
}