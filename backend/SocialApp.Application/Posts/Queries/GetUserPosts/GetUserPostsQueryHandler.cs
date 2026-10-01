using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetUserPosts;

public class GetUserPostsQueryHandler(
    IPostRepository postRepository,
    IUserRepository userRepository,
    IPostLikeRepository likeRepository,
    ICommentRepository commentRepository)
        : IRequestHandler<
        GetUserPostsQuery,
        IReadOnlyList<PostResponse>>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPostLikeRepository _likeRepository = likeRepository;
    private readonly ICommentRepository _commentRepository = commentRepository;

    public async Task<IReadOnlyList<PostResponse>> Handle(
        GetUserPostsQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User was not found.");
        }

        var posts = await _postRepository.GetByUserIdAsync(
            request.UserId,
            cancellationToken);

        var responses = new List<PostResponse>();

        foreach (var post in posts)
        {
            var likeCount = await _likeRepository.CountAsync(
                post.Id,
                cancellationToken);

            var commentCount = await _commentRepository.CountByPostIdAsync(
                post.Id,
                cancellationToken);

            var isLiked = await _likeRepository.ExistsAsync(
                post.Id,
                request.CurrentUserId,
                cancellationToken);

            responses.Add(
                new PostResponse(
                    post.Id,
                    post.UserId,
                    user.Username,
                    user.DisplayName,
                    user.ProfileImageUrl,
                    post.Content,
                    post.CreatedAt,
                    post.UpdatedAt,
                    likeCount,
                    commentCount,
                    isLiked
                )
            );
        }

        return responses;
    }
}