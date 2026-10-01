using MediatR;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Queries.GetFollowing;

public record GetFollowingQuery(
    Guid UserId
) : IRequest<IReadOnlyList<UserFollowResponse>>;