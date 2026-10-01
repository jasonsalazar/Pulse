using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Follows.DTOs;

namespace SocialApp.Application.Follows.Queries.GetFollowing;

public class GetFollowingQueryHandler(
    IUserRepository userRepository,
    IUserFollowRepository followRepository)
        : IRequestHandler<
        GetFollowingQuery,
        IReadOnlyList<UserFollowResponse>>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IUserFollowRepository _followRepository = followRepository;

    public async Task<IReadOnlyList<UserFollowResponse>> Handle(
        GetFollowingQuery request,
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

        var followingIds = await _followRepository.GetFollowingIdsAsync(
            request.UserId,
            cancellationToken);

        var results = new List<UserFollowResponse>();

        foreach (var followingId in followingIds)
        {
            var following = await _userRepository.GetByIdAsync(
                followingId,
                cancellationToken);

            if (following is null)
            {
                continue;
            }

            results.Add(
                new UserFollowResponse(
                    following.Id,
                    following.Username,
                    following.DisplayName,
                    following.ProfileImageUrl
                )
            );
        }

        return results;
    }
}