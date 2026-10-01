using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;
using SocialApp.Domain.Posts;

namespace SocialApp.Application.Posts.Commands.CreatePost;

public class CreatePostCommandHandler(
    IPostRepository postRepository,
    IUserRepository userRepository,
    IPostLikeRepository likeRepository,
    ICommentRepository commentRepository)
        : IRequestHandler<CreatePostCommand, PostResponse>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPostLikeRepository _likeRepository = likeRepository;
    private readonly ICommentRepository _commentRepository = commentRepository;

    public async Task<PostResponse> Handle(
        CreatePostCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "User could not be found.");
        }

        var post = new Post(request.UserId, request.Content);

        await _postRepository.AddAsync(post, cancellationToken);

        await _postRepository.SaveChangesAsync(cancellationToken);

        return new PostResponse(
            post.Id,
            user.Id,
            user.Username,
            user.DisplayName,
            user.ProfileImageUrl,
            post.Content,
            post.CreatedAt,
            post.UpdatedAt,
            0,
            0,
            false
        );
    }
}