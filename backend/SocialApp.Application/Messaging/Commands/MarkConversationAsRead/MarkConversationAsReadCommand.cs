using MediatR;

namespace SocialApp.Application.Messaging.Commands.MarkConversationAsRead;

public record MarkConversationAsReadCommand(
    Guid CurrentUserId,
    Guid ConversationId)
    : IRequest;