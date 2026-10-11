using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.SearchUsers;

public class SearchUsersQueryHandler(
    IUserRepository userRepository)
        : IRequestHandler<
        SearchUsersQuery,
        IReadOnlyList<UserSearchResponse>>
{
    private readonly IUserRepository _userRepository =
            userRepository;

    public async Task<
        IReadOnlyList<UserSearchResponse>> Handle(
        SearchUsersQuery request,
        CancellationToken cancellationToken)
    {
        var searchTerm = request.SearchTerm.Trim();

        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return [];
        }

        if (searchTerm.Length < 2)
        {
            return [];
        }

        if (request.Page < 1)
        {
            throw new ArgumentException(
                "Page must be greater than zero.");
        }

        if (request.PageSize < 1 ||
            request.PageSize > 50)
        {
            throw new ArgumentException(
                "Page size must be between 1 and 50.");
        }

        var users =
            await _userRepository.SearchAsync(
                searchTerm,
                request.CurrentUserId,
                request.Page,
                request.PageSize,
                cancellationToken);

        return [.. users
            .Select(user =>
                new UserSearchResponse(
                    user.Id,
                    user.Username,
                    user.DisplayName,
                    user.ProfileImageUrl))];
    }
}