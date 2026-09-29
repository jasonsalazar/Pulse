using MediatR;
using SocialApp.Application.Users.DTOs;

namespace SocialApp.Application.Users.Queries.GetMyProfile;

public record GetMyProfileQuery(
    Guid UserId
) : IRequest<UserProfileResponse>;