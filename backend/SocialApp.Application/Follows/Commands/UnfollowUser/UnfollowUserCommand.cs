using MediatR;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Commands.UnfollowUser;

public record UnfollowUserCommand(
    Guid FollowerId,
    Guid FollowingId
) : IRequest<FollowResponse>;