using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Common;
using SocialApp.Application.Notifications.Commands.MarkAllNotificationsAsRead;
using SocialApp.Application.Notifications.Commands.MarkNotificationAsRead;
using SocialApp.Application.Notifications.DTOs;
using SocialApp.Application.Notifications.Queries.GetNotifications;
using SocialApp.Application.Notifications.Queries.GetUnreadNotificationCount;

namespace SocialApp.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/notifications")]
public class NotificationsController(
    ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [HttpGet]
    public async Task<
        ActionResult<PagedResponse<NotificationResponse>>>
        GetNotifications(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new GetNotificationsQuery(
                userId.Value,
                page,
                pageSize),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount(
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _sender.Send(
            new GetUnreadNotificationCountQuery(
                userId.Value),
            cancellationToken);

        return Ok(result);
    }

    [HttpPost("{notificationId:guid}/read")]
    public async Task<IActionResult> MarkAsRead(
        Guid notificationId,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            await _sender.Send(
                new MarkNotificationAsReadCommand(
                    notificationId,
                    userId.Value),
                cancellationToken);

            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException)
        {
            return NotFound();
        }
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAllAsRead(
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        await _sender.Send(
            new MarkAllNotificationsAsReadCommand(userId.Value),
            cancellationToken);

        return NoContent();
    }

    private Guid? GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var userId)
            ? userId
            : null;
    }
}