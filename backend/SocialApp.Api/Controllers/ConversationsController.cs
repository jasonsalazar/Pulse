using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Messaging.Commands.CreateConversation;
using SocialApp.Application.Messaging.Commands.MarkConversationAsRead;
using SocialApp.Application.Messaging.Commands.SendMessage;
using SocialApp.Application.Messaging.DTOs;
using SocialApp.Application.Messaging.Queries.GetConversationMessages;
using SocialApp.Application.Messaging.Queries.GetConversations;

namespace SocialApp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/conversations")]
public class ConversationsController(
    IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    // POST: /api/conversations
    [HttpPost]
    public async Task<ActionResult<ConversationResponse>>
        CreateConversation(
            [FromBody] CreateConversationRequest request,
            CancellationToken cancellationToken)
    {
        var currentUserId = GetCurrentUserId();

        var command =
            new CreateConversationCommand(
                currentUserId,
                request.OtherUserId);

        var result =
            await _mediator.Send(
                command,
                cancellationToken);

        return Ok(result);
    }

    // GET: /api/conversations
    [HttpGet]
    public async Task<
        ActionResult<IReadOnlyList<ConversationListItemResponse>>>
        GetConversations(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            return BadRequest(
                new
                {
                    message = "Page must be greater than zero."
                });
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest(
                new
                {
                    message =
                        "Page size must be between 1 and 100."
                });
        }

        var currentUserId = GetCurrentUserId();

        var query =
            new GetConversationsQuery(
                currentUserId,
                page,
                pageSize);

        var result =
            await _mediator.Send(
                query,
                cancellationToken);

        return Ok(result);
    }

    // GET:
    // /api/conversations/{conversationId}/messages
    [HttpGet("{conversationId:guid}/messages")]
    public async Task<
        ActionResult<IReadOnlyList<MessageResponse>>>
        GetMessages(
            Guid conversationId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50,
            CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            return BadRequest(
                new
                {
                    message = "Page must be greater than zero."
                });
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest(
                new
                {
                    message =
                        "Page size must be between 1 and 100."
                });
        }

        var currentUserId = GetCurrentUserId();

        var query =
            new GetConversationMessagesQuery(
                currentUserId,
                conversationId,
                page,
                pageSize);

        var result =
            await _mediator.Send(
                query,
                cancellationToken);

        return Ok(result);
    }

    // POST:
    // /api/conversations/{conversationId}/messages
    [HttpPost("{conversationId:guid}/messages")]
    public async Task<ActionResult<MessageResponse>>
        SendMessage(
            Guid conversationId,
            [FromBody] SendMessageRequest request,
            CancellationToken cancellationToken)
    {
        var currentUserId = GetCurrentUserId();

        var command =
            new SendMessageCommand(
                currentUserId,
                conversationId,
                request.Content);

        var result =
            await _mediator.Send(
                command,
                cancellationToken);

        return Ok(result);
    }

    // POST:
    // /api/conversations/{conversationId}/read
    [HttpPost("{conversationId:guid}/read")]
    public async Task<IActionResult>
        MarkConversationAsRead(
            Guid conversationId,
            CancellationToken cancellationToken)
    {
        var currentUserId = GetCurrentUserId();

        var command =
            new MarkConversationAsReadCommand(
                currentUserId,
                conversationId);

        await _mediator.Send(
            command,
            cancellationToken);

        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                userIdClaim,
                out var userId))
        {
            throw new UnauthorizedAccessException(
                "The authenticated user ID is invalid.");
        }

        return userId;
    }
}