using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.GetUserProfile;

public class GetUserProfileQueryHandler(IUserRepository userRepository)
        : IRequestHandler<GetUserProfileQuery, UserProfileResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<UserProfileResponse> Handle(
        GetUserProfileQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new KeyNotFoundException(
                "User not found.");
        }

        return new UserProfileResponse(
            user.Id,
            user.Username,
            user.Email,
            user.DisplayName,
            user.Bio,
            user.ProfileImageUrl,
            user.CreatedAt);
    }
}