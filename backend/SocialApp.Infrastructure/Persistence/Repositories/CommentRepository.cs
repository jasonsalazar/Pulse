using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Comments;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class CommentRepository(AppDbContext dbContext)
        : ICommentRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<Comment?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Comments
            .FirstOrDefaultAsync(
                comment => comment.Id == id,
                cancellationToken);
    }

    public async Task<IReadOnlyList<Comment>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Comments
            .AsNoTracking()
            .Where(comment =>
                comment.PostId == postId)
            .OrderBy(comment => comment.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> CountByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken = default)
    {
        return await _dbContext.Comments
            .CountAsync(
                comment =>
                    comment.PostId == postId,
                cancellationToken);
    }

    public async Task AddAsync(
        Comment comment,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.Comments.AddAsync(
            comment,
            cancellationToken);
    }

    public Task DeleteAsync(
        Comment comment,
        CancellationToken cancellationToken = default)
    {
        _dbContext.Comments.Remove(comment);

        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}