using MediatR;
using SocialApp.Application.Comments.DTOs;
using SocialApp.Application.Common;
using SocialApp.Application.Notifications.Commands.CreateNotification;
using SocialApp.Domain.Comments;
using SocialApp.Domain.Notifications;

namespace SocialApp.Application.Comments.Commands.CreateComment;

public class CreateCommentCommandHandler(
    IPostRepository postRepository,
    IUserRepository userRepository,
    ICommentRepository commentRepository,
    IMediator mediator)
        : IRequestHandler<CreateCommentCommand, CommentResponse>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ICommentRepository _commentRepository = commentRepository;
    private readonly IMediator _mediator = mediator;

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

        await _mediator.Send(
            new CreateNotificationCommand(
                post.UserId,
                request.UserId,
                NotificationType.Comment,
                post.Id),
            cancellationToken);

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