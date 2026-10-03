using MediatR;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Commands.CreateConversation;

public record CreateConversationCommand(
    Guid CurrentUserId,
    Guid OtherUserId
) : IRequest<ConversationResponse>;