using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class PostFeedRepository(AppDbContext dbContext)
    : IPostFeedRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<(
        IReadOnlyList<PostResponse> Items,
        int TotalCount)>
        GetHomeFeedAsync(
            Guid userId,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
    {
        var followingUserIds = _dbContext.UserFollows
            .Where(follow =>
                follow.FollowerId == userId)
            .Select(follow =>
                follow.FollowingId);

        var feedQuery =
            from post in _dbContext.Posts
            join user in _dbContext.Users
                on post.UserId equals user.Id
            where
                post.UserId == userId ||
                followingUserIds.Contains(post.UserId)
            select new
            {
                Post = post,
                User = user
            };

        var totalCount = await feedQuery.CountAsync(
                cancellationToken);

        var items =
            await feedQuery
                .OrderByDescending(
                    item => item.Post.CreatedAt)
                .ThenByDescending(
                    item => item.Post.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(item =>
                    new PostResponse(
                        item.Post.Id,
                        item.Post.UserId,

                        item.User.Username,
                        item.User.DisplayName,
                        item.User.ProfileImageUrl,

                        item.Post.Content,
                        item.Post.CreatedAt,
                        item.Post.UpdatedAt,

                        _dbContext.PostLikes.Count(
                            like =>
                                like.PostId ==
                                item.Post.Id),

                        _dbContext.Comments.Count(
                            comment =>
                                comment.PostId ==
                                item.Post.Id),

                        _dbContext.PostLikes.Any(
                            like =>
                                like.PostId ==
                                    item.Post.Id &&
                                like.UserId ==
                                    userId)
                    ))
                .ToListAsync(
                    cancellationToken);

        return (
            items,
            totalCount);
    }
}