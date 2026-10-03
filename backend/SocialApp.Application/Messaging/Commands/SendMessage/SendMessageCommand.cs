using MediatR;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Commands.SendMessage;

public record SendMessageCommand(
    Guid CurrentUserId,
    Guid ConversationId,
    string Content)
    : IRequest<MessageResponse>;