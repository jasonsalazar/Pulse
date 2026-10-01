using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Queries.GetFollowers;

public class GetFollowersQueryHandler(
    IUserRepository userRepository,
    IUserFollowRepository followRepository)
        : IRequestHandler<
        GetFollowersQuery,
        IReadOnlyList<UserFollowResponse>>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUserFollowRepository _followRepository = followRepository;

    public async Task<IReadOnlyList<UserFollowResponse>> Handle(
        GetFollowersQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User was not found.");
        }

        var followerIds = await _followRepository.GetFollowerIdsAsync(
            request.UserId,
            cancellationToken);

        var results = new List<UserFollowResponse>();

        foreach (var followerId in followerIds)
        {
            var follower = await _userRepository.GetByIdAsync(
                followerId,
                cancellationToken);

            if (follower is null)
            {
                continue;
            }

            results.Add(
                new UserFollowResponse(
                    follower.Id,
                    follower.Username,
                    follower.DisplayName,
                    follower.ProfileImageUrl
                )
            );
        }

        return results;
    }
}