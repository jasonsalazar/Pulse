using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Follows;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class UserFollowRepository(AppDbContext dbContext)
        : IUserFollowRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<UserFollow?> GetAsync(
        Guid followerId,
        Guid followingId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserFollows
            .FirstOrDefaultAsync(
                follow =>
                    follow.FollowerId == followerId &&
                    follow.FollowingId == followingId,
                cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid followerId,
        Guid followingId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserFollows
            .AnyAsync(
                follow =>
                    follow.FollowerId == followerId &&
                    follow.FollowingId == followingId,
                cancellationToken);
    }

    public async Task<int> CountFollowersAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserFollows
            .CountAsync(
                follow =>
                    follow.FollowingId == userId,
                cancellationToken);
    }

    public async Task<int> CountFollowingAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserFollows
            .CountAsync(
                follow =>
                    follow.FollowerId == userId,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Guid>> GetFollowerIdsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserFollows
            .AsNoTracking()
            .Where(
                follow =>
                    follow.FollowingId == userId)
            .OrderBy(follow => follow.CreatedAt)
            .Select(follow => follow.FollowerId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Guid>> GetFollowingIdsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.UserFollows
            .AsNoTracking()
            .Where(
                follow =>
                    follow.FollowerId == userId)
            .OrderBy(follow => follow.CreatedAt)
            .Select(follow => follow.FollowingId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        UserFollow follow,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.UserFollows.AddAsync(
            follow,
            cancellationToken);
    }

    public Task DeleteAsync(
        UserFollow follow,
        CancellationToken cancellationToken = default)
    {
        _dbContext.UserFollows.Remove(follow);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}