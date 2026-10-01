using MediatR;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Commands.FollowUser;

public record FollowUserCommand(
    Guid FollowerId,
    Guid FollowingId
) : IRequest<FollowResponse>;