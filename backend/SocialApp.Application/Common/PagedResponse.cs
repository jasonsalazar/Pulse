namespace SocialApp.Application.Common;

public record PagedResponse<T>(
    IReadOnlyList<T> Items,
    int Page,
    int PageSize,
    int TotalCount)
{
    public bool HasNextPage =>
        Page * PageSize < TotalCount;
}