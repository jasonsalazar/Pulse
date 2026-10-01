namespace SocialApp.Application.Follows.DTOs;

public record FollowResponse(
    Guid UserId,
    bool IsFollowing,
    int FollowerCount,
    int FollowingCount
);