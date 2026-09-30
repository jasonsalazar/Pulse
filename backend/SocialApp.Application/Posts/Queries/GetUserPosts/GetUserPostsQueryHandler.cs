using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetUserPosts;

public class GetUserPostsQueryHandler(
    IPostRepository postRepository,
    IUserRepository userRepository)
        : IRequestHandler<
        GetUserPostsQuery,
        IReadOnlyList<PostResponse>>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;

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

        return [.. posts
            .Select(post =>
                new PostResponse(
                    post.Id,
                    user.Id,
                    user.Username,
                    user.DisplayName,
                    user.ProfileImageUrl,
                    post.Content,
                    post.CreatedAt,
                    post.UpdatedAt
                )
            )
        ];
    }
}