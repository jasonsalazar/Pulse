using MediatR;
using SocialApp.Application.Comments.DTOs;

namespace SocialApp.Application.Comments.Commands.CreateComment;

public record CreateCommentCommand(
    Guid PostId,
    Guid UserId,
    string Content
) : IRequest<CommentResponse>;