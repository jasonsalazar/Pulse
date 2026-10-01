using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Common;

public interface IPostFeedRepository
{
    Task<(IReadOnlyList<PostResponse> Items, int TotalCount)> GetHomeFeedAsync(
        Guid userId,
        int page,
        int pageSize,
        CancellationToken cancellationToken = default
    );
}