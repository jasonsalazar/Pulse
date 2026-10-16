using MediatR;

namespace SocialApp.Application.Authentication.Commands.Logout;

public record LogoutCommand(string? RefreshToken)
    : IRequest<Unit>;
