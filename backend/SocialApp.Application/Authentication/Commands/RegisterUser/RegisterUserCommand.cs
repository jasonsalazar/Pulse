using MediatR;
using SocialApp.Application.Authentication.DTOs;

namespace SocialApp.Application.Authentication.Commands.RegisterUser;

public record RegisterUserCommand(
    string Username,
    string Email,
    string Password,
    string ConfirmPassword
) : IRequest<AuthResponse>;
