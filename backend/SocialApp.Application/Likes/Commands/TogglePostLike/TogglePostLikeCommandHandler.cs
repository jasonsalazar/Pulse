using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Likes.DTOs;
using SocialApp.Application.Notifications.Commands.CreateNotification;
using SocialApp.Domain.Likes;
using SocialApp.Domain.Notifications;

namespace SocialApp.Application.Likes.Commands.TogglePostLike;

public class TogglePostLikeCommandHandler(
    IPostRepository postRepository,
    IPostLikeRepository likeRepository,
    IMediator mediator)
        : IRequestHandler<TogglePostLikeCommand, PostLikeResponse>
{
    private readonly IPostRepository _postRepository = postRepository;
    private readonly IPostLikeRepository _likeRepository = likeRepository;
    private readonly IMediator _mediator = mediator;

    public async Task<PostLikeResponse> Handle(
        TogglePostLikeCommand request,
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

        var existingLike = await _likeRepository.GetAsync(
            request.PostId,
            request.UserId,
            cancellationToken);

        bool isLiked;

        if (existingLike is not null)
        {
            await _likeRepository.DeleteAsync(
                existingLike,
                cancellationToken);

            isLiked = false;
        }
        else
        {
            var like = new PostLike(request.PostId, request.UserId);

            await _likeRepository.AddAsync(
                like,
                cancellationToken);

            isLiked = true;

            await _mediator.Send(
                new CreateNotificationCommand(
                    post.UserId,
                    request.UserId,
                    NotificationType.Like,
                    post.Id),
                cancellationToken);
        }

        await _likeRepository.SaveChangesAsync(cancellationToken);

        var likeCount = await _likeRepository.CountAsync(
            request.PostId,
            cancellationToken);

        return new PostLikeResponse(
            request.PostId,
            isLiked,
            likeCount);
    }
}