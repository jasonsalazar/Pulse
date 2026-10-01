using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.GetUserProfile;

public class GetUserProfileQueryHandler(
    IUserRepository userRepository,
    IUserFollowRepository followRepository)
    : IRequestHandler<GetUserProfileQuery, UserProfileResponse>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUserFollowRepository _followRepository = followRepository;

    public async Task<UserProfileResponse> Handle(
        GetUserProfileQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User not found.");
        }

        var followerCount = await _followRepository.CountFollowersAsync(
            user.Id,
            cancellationToken);

        var followingCount = await _followRepository.CountFollowingAsync(
            user.Id,
            cancellationToken);

        var isFollowing = false;

        if (request.CurrentUserId != user.Id)
        {
            isFollowing = await _followRepository.ExistsAsync(
                request.CurrentUserId,
                user.Id,
                cancellationToken);
        }

        return new UserProfileResponse(
            user.Id,
            user.Username,
            user.Email,
            user.DisplayName,
            user.Bio,
            user.ProfileImageUrl,
            user.CreatedAt,
            followerCount,
            followingCount,
            isFollowing);
    }
}