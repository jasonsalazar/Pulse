using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Comments.Commands.CreateComment;
using SocialApp.Application.Comments.Commands.DeleteComment;
using SocialApp.Application.Comments.DTOs;
using SocialApp.Application.Comments.Queries.GetPostComments;

namespace SocialApp.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class CommentsController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [HttpPost("posts/{postId:guid}/comments")]
    public async Task<ActionResult<CommentResponse>> Create(
        Guid postId,
        CreateCommentRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new CreateCommentCommand(
                postId,
                userId.Value,
                request.Content);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("posts/{postId:guid}/comments")]
    public async Task<ActionResult<IReadOnlyList<CommentResponse>>>
        GetByPost(
            Guid postId,
            CancellationToken cancellationToken)
    {
        try
        {
            var query = new GetPostCommentsQuery(postId);

            var result = await _sender.Send(
                query,
                cancellationToken);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    [HttpDelete("comments/{commentId:guid}")]
    public async Task<IActionResult> Delete(
        Guid commentId,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new DeleteCommentCommand(
                commentId,
                userId.Value);

            await _sender.Send(
                command,
                cancellationToken);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
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