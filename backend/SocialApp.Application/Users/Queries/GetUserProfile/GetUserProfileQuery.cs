using MediatR;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.GetUserProfile;

public record GetUserProfileQuery(
    Guid UserId,
    Guid CurrentUserId
) : IRequest<UserProfileResponse>;