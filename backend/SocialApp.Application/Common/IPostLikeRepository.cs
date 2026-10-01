using SocialApp.Domain.Likes;

namespace SocialApp.Application.Common;

public interface IPostLikeRepository
{
    Task<PostLike?> GetAsync(
        Guid postId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        Guid postId,
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<int> CountAsync(
        Guid postId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        PostLike like,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        PostLike like,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}