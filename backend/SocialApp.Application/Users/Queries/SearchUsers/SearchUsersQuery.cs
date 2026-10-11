using MediatR;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.SearchUsers;

public record SearchUsersQuery(
    Guid CurrentUserId,
    string SearchTerm,
    int Page = 1,
    int PageSize = 20
) : IRequest<IReadOnlyList<UserSearchResponse>>;