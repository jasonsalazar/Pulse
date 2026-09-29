using MediatR;
using SocialApp.Application.Common;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Commands.UpdateProfile;

public class UpdateProfileCommandHandler(IUserRepository userRepository)
        : IRequestHandler<UpdateProfileCommand, UserProfileResponse>
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<UserProfileResponse> Handle(
        UpdateProfileCommand request,
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

        user.UpdateProfile(
            request.DisplayName,
            request.Bio,
            request.ProfileImageUrl);

        await _userRepository.SaveChangesAsync(
            cancellationToken);

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