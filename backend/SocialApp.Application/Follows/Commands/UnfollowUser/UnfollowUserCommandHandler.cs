using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Commands.UnfollowUser;

public class UnfollowUserCommandHandler(
    IUserRepository userRepository,
    IUserFollowRepository followRepository)
        : IRequestHandler<UnfollowUserCommand, FollowResponse>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUserFollowRepository _followRepository = followRepository;

    public async Task<FollowResponse> Handle(
        UnfollowUserCommand request,
        CancellationToken cancellationToken)
    {
        if (request.FollowerId == request.FollowingId)
        {
            throw new InvalidOperationException(
                "You cannot unfollow yourself.");
        }

        var followingUser = await _userRepository.GetByIdAsync(
            request.FollowingId,
            cancellationToken);

        if (followingUser is null)
        {
            throw new KeyNotFoundException(
                "User was not found.");
        }

        var follow = await _followRepository.GetAsync(
            request.FollowerId,
            request.FollowingId,
            cancellationToken);

        if (follow is not null)
        {
            await _followRepository.DeleteAsync(
                follow,
                cancellationToken);

            await _followRepository.SaveChangesAsync(
                cancellationToken);
        }

        var followerCount =
            await _followRepository.CountFollowersAsync(
                request.FollowingId,
                cancellationToken);

        var followingCount =
            await _followRepository.CountFollowingAsync(
                request.FollowingId,
                cancellationToken);

        return new FollowResponse(
            request.FollowingId,
            false,
            followerCount,
            followingCount
        );
    }
}