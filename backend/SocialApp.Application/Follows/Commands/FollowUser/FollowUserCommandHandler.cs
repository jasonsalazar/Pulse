using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Follows.DTOs;
using SocialApp.Application.Notifications.Commands.CreateNotification;
using SocialApp.Domain.Follows;
using SocialApp.Domain.Notifications;

namespace SocialApp.Application.Follows.Commands.FollowUser;

public class FollowUserCommandHandler(
    IUserRepository userRepository,
    IUserFollowRepository followRepository,
    IMediator mediator)
        : IRequestHandler<FollowUserCommand, FollowResponse>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUserFollowRepository _followRepository = followRepository;
    private readonly IMediator _mediator = mediator;

    public async Task<FollowResponse> Handle(
        FollowUserCommand request,
        CancellationToken cancellationToken)
    {
        if (request.FollowerId == request.FollowingId)
        {
            throw new InvalidOperationException(
                "You cannot follow yourself.");
        }

        var followingUser = await _userRepository.GetByIdAsync(
            request.FollowingId,
            cancellationToken);

        if (followingUser is null)
        {
            throw new KeyNotFoundException(
                "User was not found.");
        }

        var followerUser = await _userRepository.GetByIdAsync(
            request.FollowerId,
            cancellationToken);

        if (followerUser is null)
        {
            throw new UnauthorizedAccessException(
                "User was not found.");
        }

        var existingFollow = await _followRepository.GetAsync(
            request.FollowerId,
            request.FollowingId,
            cancellationToken);

        if (existingFollow is not null)
        {
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
                true,
                followerCount,
                followingCount
            );
        }

        var follow = new UserFollow(
            request.FollowerId,
            request.FollowingId);

        await _followRepository.AddAsync(
            follow,
            cancellationToken);

        await _followRepository.SaveChangesAsync(
            cancellationToken);

        await _mediator.Send(
            new CreateNotificationCommand(
                request.FollowingId,
                request.FollowerId,
                NotificationType.Follow),
            cancellationToken);

        var newFollowerCount =
            await _followRepository.CountFollowersAsync(
                request.FollowingId,
                cancellationToken);

        var newFollowingCount =
            await _followRepository.CountFollowingAsync(
                request.FollowingId,
                cancellationToken);

        return new FollowResponse(
            request.FollowingId,
            true,
            newFollowerCount,
            newFollowingCount
        );
    }
}