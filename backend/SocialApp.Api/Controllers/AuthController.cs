using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Authentication.Commands.Login;
using SocialApp.Application.Authentication.Commands.RegisterUser;
using SocialApp.Application.Authentication.DTOs;

namespace SocialApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new RegisterUserCommand(
                request.Username,
                request.Email,
                request.Password);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new
            {
                message = exception.Message
            });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new LoginCommand(
                request.Email,
                request.Password);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
        catch (UnauthorizedAccessException exception)
        {
            return Unauthorized(new
            {
                message = exception.Message
            });
        }
    }
}
