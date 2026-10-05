using MediatR;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Commands.MarkConversationAsRead;

public record MarkConversationAsReadCommand(
    Guid CurrentUserId,
    Guid ConversationId)
    : IRequest<MessagesReadResponse>;