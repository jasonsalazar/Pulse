using MediatR;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetRecentPosts;

public record GetRecentPostsQuery(
    int Take = 20
) : IRequest<IReadOnlyList<PostResponse>>;