using MediatR;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Queries.GetConversationMessages;

public record GetConversationMessagesQuery(
    Guid CurrentUserId,
    Guid ConversationId,
    int Page = 1,
    int PageSize = 50)
    : IRequest<IReadOnlyList<MessageResponse>>;