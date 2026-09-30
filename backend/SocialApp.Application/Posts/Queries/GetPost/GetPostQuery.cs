using MediatR;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetPost;

public record GetPostQuery(
    Guid PostId
) : IRequest<PostResponse>;