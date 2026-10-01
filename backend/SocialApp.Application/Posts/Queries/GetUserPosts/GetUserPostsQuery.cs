using MediatR;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetUserPosts;

public record GetUserPostsQuery(
    Guid UserId,
    Guid CurrentUserId
) : IRequest<IReadOnlyList<PostResponse>>;