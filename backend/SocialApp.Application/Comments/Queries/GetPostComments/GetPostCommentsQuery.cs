using MediatR;
using SocialApp.Application.Comments.DTOs;

namespace SocialApp.Application.Comments.Queries.GetPostComments;

public record GetPostCommentsQuery(
    Guid PostId
) : IRequest<IReadOnlyList<CommentResponse>>;