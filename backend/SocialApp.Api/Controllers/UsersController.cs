using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Users.Commands.UpdateProfile;
using SocialApp.Application.Users.DTOs;
using SocialApp.Application.Users.Queries.GetMyProfile;
using SocialApp.Application.Users.Queries.GetUserProfile;

namespace SocialApp.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserProfileResponse>> GetMe(
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var query = new GetMyProfileQuery(
            userId.Value);

        var result = await _sender.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult<UserProfileResponse>> UpdateMe(
        UpdateProfileRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new UpdateProfileCommand(
                userId.Value,
                request.DisplayName,
                request.Bio,
                request.ProfileImageUrl);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    [Authorize]
    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<UserProfileResponse>> GetUser(
        Guid userId,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetUserProfileQuery(
                userId);

            var result = await _sender.Send(
                query,
                cancellationToken);

            return Ok(result);
        }
        catch (KeyNotFoundException exception)
        {
            return NotFound(new
            {
                message = exception.Message
            });
        }
    }

    private Guid? GetCurrentUserId()
    {
        var value = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        return Guid.TryParse(
            value,
            out var userId)
            ? userId
            : null;
    }
}