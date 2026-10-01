using MediatR;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetRecentPosts;

public record GetRecentPostsQuery(
    Guid CurrentUserId,
    int Take = 20
) : IRequest<IReadOnlyList<PostResponse>>;