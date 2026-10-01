using MediatR;
using SocialApp.Application.Likes.DTOs;

namespace SocialApp.Application.Likes.Commands.TogglePostLike;

public record TogglePostLikeCommand(
    Guid PostId,
    Guid UserId
) : IRequest<PostLikeResponse>;