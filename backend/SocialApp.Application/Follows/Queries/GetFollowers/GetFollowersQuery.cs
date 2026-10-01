using MediatR;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Queries.GetFollowers;

public record GetFollowersQuery(
    Guid UserId
) : IRequest<IReadOnlyList<UserFollowResponse>>;