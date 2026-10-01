using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Queries.GetHomeFeed;

public class GetHomeFeedQueryHandler(IPostFeedRepository feedRepository)
        : IRequestHandler<GetHomeFeedQuery, PagedResponse<PostResponse>>
{
    private readonly IPostFeedRepository _feedRepository = feedRepository;

    public async Task<PagedResponse<PostResponse>> Handle(
        GetHomeFeedQuery request,
        CancellationToken cancellationToken)
    {
        var page = request.Page < 1
            ? 1
            : request.Page;

        var pageSize = request.PageSize switch
        {
            < 1 => 20,
            > 50 => 50,
            _ => request.PageSize
        };

        var (Items, TotalCount) =
            await _feedRepository.GetHomeFeedAsync(
                request.UserId,
                page,
                pageSize,
                cancellationToken);

        return new PagedResponse<PostResponse>(
            Items,
            page,
            pageSize,
            TotalCount
        );
    }
}