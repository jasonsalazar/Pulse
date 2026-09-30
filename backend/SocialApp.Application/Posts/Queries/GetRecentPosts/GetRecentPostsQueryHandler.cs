using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetRecentPosts;

public class GetRecentPostsQueryHandler(
    IPostRepository postRepository,
    IUserRepository userRepository)
        : IRequestHandler<
        GetRecentPostsQuery,
        IReadOnlyList<PostResponse>>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<IReadOnlyList<PostResponse>> Handle(
        GetRecentPostsQuery request,
        CancellationToken cancellationToken)
    {
        var take = Math.Clamp(
            request.Take,
            1,
            50);

        var posts = await _postRepository.GetRecentAsync(
            take,
            cancellationToken);

        var responses = new List<PostResponse>();

        foreach (var post in posts)
        {
            var user = await _userRepository.GetByIdAsync(
                post.UserId,
                cancellationToken);

            if (user is null)
            {
                continue;
            }

            responses.Add(
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
            );
        }

        return responses;
    }
}