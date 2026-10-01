using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Follows.Commands.FollowUser;
using SocialApp.Application.Follows.Commands.UnfollowUser;
using SocialApp.Application.Follows.Queries.GetFollowers;
using SocialApp.Application.Follows.Queries.GetFollowing;
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
    public async Task<ActionResult<UserProfileResponse>> GetMyProfile(
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
    public async Task<ActionResult<UserProfileResponse>> UpdateMyProfile(
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
    public async Task<ActionResult<UserProfileResponse>> GetUserProfile(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        try
        {
            var query = new GetUserProfileQuery(userId, currentUserId.Value);

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

    [Authorize]
    [HttpPost("{userId:guid}/follow")]
    public async Task<IActionResult> Follow(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new FollowUserCommand(
                currentUserId.Value,
                userId);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize]
    [HttpDelete("{userId:guid}/follow")]
    public async Task<IActionResult> Unfollow(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new UnfollowUserCommand(
                currentUserId.Value,
                userId);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize]
    [HttpGet("{userId:guid}/followers")]
    public async Task<IActionResult> GetFollowers(
        Guid userId,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetFollowersQuery(userId);

            var result = await _sender.Send(
                query,
                cancellationToken);

            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [Authorize]
    [HttpGet("{userId:guid}/following")]
    public async Task<IActionResult> GetFollowing(
        Guid userId,
        CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetFollowingQuery(userId);

            var result = await _sender.Send(
                query,
                cancellationToken);

            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    private Guid? GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var userId)
            ? userId
            : null;
    }
}