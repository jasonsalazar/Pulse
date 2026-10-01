using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Likes;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class PostLikeRepository(
    AppDbContext dbContext)
        : IPostLikeRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<PostLike?> GetAsync(
        Guid postId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.PostLikes
            .FirstOrDefaultAsync(
                like =>
                    like.PostId == postId &&
                    like.UserId == userId,
                cancellationToken);
    }

    public async Task<bool> ExistsAsync(
        Guid postId,
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.PostLikes
            .AnyAsync(
                like =>
                    like.PostId == postId &&
                    like.UserId == userId,
                cancellationToken);
    }

    public async Task<int> CountAsync(
        Guid postId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.PostLikes
            .CountAsync(
                like => like.PostId == postId,
                cancellationToken);
    }

    public async Task AddAsync(
        PostLike like,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.PostLikes.AddAsync(
            like,
            cancellationToken);
    }

    public Task DeleteAsync(
        PostLike like,
        CancellationToken cancellationToken = default)
    {
        _dbContext.PostLikes.Remove(like);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}