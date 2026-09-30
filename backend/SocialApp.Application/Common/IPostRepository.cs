using SocialApp.Domain.Posts;

namespace SocialApp.Application.Common;

public interface IPostRepository
{
    Task<Post?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Post>> GetRecentAsync(
        int take,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Post>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Post post,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Post post,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}