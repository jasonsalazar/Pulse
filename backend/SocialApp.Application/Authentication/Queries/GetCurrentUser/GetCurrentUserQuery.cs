using MediatR;
using SocialApp.Application.Authentication.DTOs;

namespace SocialApp.Application.Authentication.Queries.GetCurrentUser;

public record GetCurrentUserQuery(
    Guid UserId) : IRequest<AuthResponse>;