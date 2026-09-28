using MediatR;
using SocialApp.Application.Authentication.DTOs;
using SocialApp.Application.Common;

namespace SocialApp.Application.Authentication.Queries.GetCurrentUser;

public class GetCurrentUserQueryHandler(
    IUserRepository userRepository)
        : IRequestHandler<GetCurrentUserQuery, AuthResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<AuthResponse> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "User no longer exists.");
        }

        return new AuthResponse(
            user.Id,
            user.Username,
            user.Email);
    }
}
