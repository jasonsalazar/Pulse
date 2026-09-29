using MediatR;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Commands.UpdateProfile;

public record UpdateProfileCommand(
    Guid UserId,
    string DisplayName,
    string Bio,
    string? ProfileImageUrl
) : IRequest<UserProfileResponse>;