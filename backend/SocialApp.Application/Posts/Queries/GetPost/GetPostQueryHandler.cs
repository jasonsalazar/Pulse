using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetPost;

public class GetPostQueryHandler(
    IPostRepository postRepository,
    IUserRepository userRepository)
        : IRequestHandler<GetPostQuery, PostResponse>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<PostResponse> Handle(
        GetPostQuery request,
        CancellationToken cancellationToken)
    {
        var post = await _postRepository.GetByIdAsync(
            request.PostId,
            cancellationToken);

        if (post is null)
        {
            throw new KeyNotFoundException(
                "Post was not found.");
        }

        var user = await _userRepository.GetByIdAsync(
            post.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "Post author was not found.");
        }

        return new PostResponse(
            post.Id,
            user.Id,
            user.Username,
            user.DisplayName,
            user.ProfileImageUrl,
            post.Content,
            post.CreatedAt,
            post.UpdatedAt
        );
    }
}