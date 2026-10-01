using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetHomeFeed;

public record GetHomeFeedQuery(
    Guid UserId,
    int Page = 1,
    int PageSize = 20
) : IRequest<PagedResponse<PostResponse>>;