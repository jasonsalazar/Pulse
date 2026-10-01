using SocialApp.Domain.Comments;

namespace SocialApp.Application.Common;

public interface ICommentRepository
{
    Task<Comment?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Comment>> GetByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken = default);

    Task<int> CountByPostIdAsync(
        Guid postId,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Comment comment,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        Comment comment,
        CancellationToken cancellationToken = default);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}