using MediatR;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Application.Messaging.Queries.GetConversations;

public record GetConversationsQuery(
    Guid CurrentUserId,
    int Page = 1,
    int PageSize = 20)
    : IRequest<IReadOnlyList<ConversationListItemResponse>>;