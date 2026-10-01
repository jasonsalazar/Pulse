using MediatR;
using SocialApp.Application.Comments.DTOs;
using SocialApp.Application.Common;
using SocialApp.Domain.Comments;

namespace SocialApp.Application.Comments.Commands.CreateComment;

public class CreateCommentCommandHandler(
    IPostRepository postRepository,
    IUserRepository userRepository,
    ICommentRepository commentRepository)
        : IRequestHandler<CreateCommentCommand, CommentResponse>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ICommentRepository _commentRepository = commentRepository;

    public async Task<CommentResponse> Handle(
        CreateCommentCommand request,
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
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "User was not found.");
        }

        var comment = new Comment(
            request.PostId,
            request.UserId,
            request.Content);

        await _commentRepository.AddAsync(
            comment,
            cancellationToken);

        await _commentRepository.SaveChangesAsync(cancellationToken);

        return new CommentResponse(
            comment.Id,
            comment.PostId,
            user.Id,
            user.Username,
            user.DisplayName,
            user.ProfileImageUrl,
            comment.Content,
            comment.CreatedAt,
            comment.UpdatedAt
        );
    }
}