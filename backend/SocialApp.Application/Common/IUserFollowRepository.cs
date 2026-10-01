using SocialApp.Domain.Follows;

namespace SocialApp.Application.Common;

public interface IUserFollowRepository
{
    Task<UserFollow?> GetAsync(
        Guid followerId,
        Guid followingId,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        Guid followerId,
        Guid followingId,
        CancellationToken cancellationToken = default);

    Task<int> CountFollowersAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<int> CountFollowingAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Guid>> GetFollowerIdsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Guid>> GetFollowingIdsAsync(
        Guid userId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        UserFollow follow,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        UserFollow follow,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}