using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Posts;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class PostRepository(
    AppDbContext dbContext) : IPostRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<Post?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Posts
            .AsNoTracking()
            .FirstOrDefaultAsync(
                post => post.Id == id,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Post>> GetRecentAsync(
        int take,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Posts
            .AsNoTracking()
            .OrderByDescending(post => post.CreatedAt)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Post>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Posts
            .AsNoTracking()
            .Where(post => post.UserId == userId)
            .OrderByDescending(post => post.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(
        Post post,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Posts.AddAsync(
            post,
            cancellationToken);
    }

    public Task DeleteAsync(
        Post post,
        CancellationToken cancellationToken = default)
    {
        _dbContext.Posts.Remove(post);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}