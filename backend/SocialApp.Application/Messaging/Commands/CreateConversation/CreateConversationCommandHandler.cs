using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Messaging.DTOs;
using SocialApp.Domain.Messaging;

namespace SocialApp.Application.Messaging.Commands.CreateConversation;

public class CreateConversationCommandHandler(
    IConversationRepository conversationRepository)
        : IRequestHandler<
        CreateConversationCommand,
        ConversationResponse>
{
    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

    public async Task<ConversationResponse> Handle(
        CreateConversationCommand request,
        CancellationToken cancellationToken)
    {
        if (request.CurrentUserId ==
            request.OtherUserId)
        {
            throw new InvalidOperationException(
                "You cannot message yourself.");
        }

        var existingConversation =
            await _conversationRepository
                .GetBetweenUsersAsync(
                    request.CurrentUserId,
                    request.OtherUserId,
                    cancellationToken);

        if (existingConversation is not null)
        {
            return new ConversationResponse(
                existingConversation.Id,
                existingConversation.User1Id,
                existingConversation.User2Id,
                existingConversation.CreatedAt,
                existingConversation.LastMessageAt);
        }

        var conversation =
            Conversation.Create(
                request.CurrentUserId,
                request.OtherUserId);

        await _conversationRepository.AddAsync(
            conversation,
            cancellationToken);

        await _conversationRepository.SaveChangesAsync(
            cancellationToken);

        return new ConversationResponse(
            conversation.Id,
            conversation.User1Id,
            conversation.User2Id,
            conversation.CreatedAt,
            conversation.LastMessageAt);
    }
}