using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialApp.Application.Common;
using SocialApp.Application.Likes.Commands.TogglePostLike;
using SocialApp.Application.Likes.DTOs;
using SocialApp.Application.Posts.Commands.CreatePost;
using SocialApp.Application.Posts.Commands.DeletePost;
using SocialApp.Application.Posts.DTOs;
using SocialApp.Application.Posts.Queries.GetHomeFeed;
using SocialApp.Application.Posts.Queries.GetPost;
using SocialApp.Application.Posts.Queries.GetRecentPosts;
using SocialApp.Application.Posts.Queries.GetUserPosts;

namespace SocialApp.Api.Controllers;

[ApiController]
[Route("api/posts")]
[Authorize]
public class PostsController(ISender sender) : ControllerBase
{
    private readonly ISender _sender = sender;

    [HttpPost]
    public async Task<ActionResult<PostResponse>> Create(
        CreatePostRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new CreatePostCommand(
                userId.Value,
                request.Content);

            var result = await _sender.Send(
                command,
                cancellationToken);

            return CreatedAtAction(
                nameof(GetById),
                new { postId = result.PostId },
                result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<PostResponse>>> GetRecent(
        [FromQuery] int take = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var query = new GetRecentPostsQuery(userId.Value, take);

        var result = await _sender.Send(query, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{postId:guid}")]
    public async Task<ActionResult<PostResponse>> GetById(
        Guid postId,
        CancellationToken cancellationToken)
    {
        try
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId is null)
            {
                return Unauthorized();
            }

            var query = new GetPostQuery(
                postId,
                currentUserId.Value);

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

    [HttpGet("user/{userId:guid}")]
    public async Task<
        ActionResult<IReadOnlyList<PostResponse>>>
        GetByUser(
            Guid userId,
            CancellationToken cancellationToken)
    {
        try
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId is null)
            {
                return Unauthorized();
            }

            var query = new GetUserPostsQuery(
                userId,
                currentUserId.Value);

            var result = await _sender.Send(query, cancellationToken);

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

    [HttpDelete("{postId:guid}")]
    public async Task<IActionResult> Delete(
        Guid postId,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new DeletePostCommand(postId, userId.Value);

            await _sender.Send(command, cancellationToken);

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

    [HttpPost("{postId:guid}/like")]
    public async Task<ActionResult<PostLikeResponse>> ToggleLike(
    Guid postId,
    CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        try
        {
            var command = new TogglePostLikeCommand(
                postId,
                userId.Value);

            var result = await _sender.Send(
                command,
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

    [Authorize]
    [HttpGet("feed")]
    public async Task<ActionResult<PagedResponse<PostResponse>>> GetHomeFeed(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var userId = GetCurrentUserId();

        if (userId is null)
        {
            return Unauthorized();
        }

        var query = new GetHomeFeedQuery(
            userId.Value,
            page,
            pageSize);

        var result = await _sender.Send(
            query,
            cancellationToken);

        return Ok(result);
    }

    private Guid? GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return Guid.TryParse(value, out var userId)
            ? userId
            : null;
    }
}