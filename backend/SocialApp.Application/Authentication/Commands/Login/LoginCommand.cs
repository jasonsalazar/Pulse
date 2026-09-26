using MediatR;
using SocialApp.Application.Authentication.DTOs;

namespace SocialApp.Application.Authentication.Commands.Login;

public record LoginCommand(
    string Email,
    string Password
) : IRequest<LoginResponse>;