using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.GetMyProfile;

public class GetMyProfileQueryHandler(IUserRepository userRepository)
        : IRequestHandler<GetMyProfileQuery, UserProfileResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<UserProfileResponse> Handle(
        GetMyProfileQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(
            request.UserId,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
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