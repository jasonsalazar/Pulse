using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialApp.Application.Common;
using SocialApp.Application.Messaging.Commands.MarkConversationAsRead;
using SocialApp.Application.Messaging.Commands.SendMessage;
using SocialApp.Application.Messaging.DTOs;

namespace SocialApp.Api.Hubs;

[Authorize]
public class ChatHub(
    IMediator mediator,
    IConversationRepository conversationRepository,
    IUserPresenceService presenceService) : Hub
{
    private readonly IMediator _mediator = mediator;

    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

    private readonly IUserPresenceService _presenceService = presenceService;

    public async Task<MessageResponse> SendMessage(
        Guid conversationId,
        string content)
    {
        var currentUserId =
            GetCurrentUserId();

        var conversation =
            await _conversationRepository.GetByIdAsync(
                conversationId,
                Context.ConnectionAborted);

        if (conversation is null)
        {
            throw new HubException(
                "Conversation not found.");
        }

        if (!conversation.ContainsUser(currentUserId))
        {
            throw new HubException(
                "You do not belong to this conversation.");
        }

        var command =
            new SendMessageCommand(
                currentUserId,
                conversationId,
                content);

        var message =
            await _mediator.Send(
                command,
                Context.ConnectionAborted);

        var recipientId =
            conversation.GetOtherUserId(
                currentUserId);

        await Clients.User(
                recipientId.ToString())
            .SendAsync(
                "messageReceived",
                message,
                Context.ConnectionAborted);

        return message;
    }

    public async Task MarkConversationAsRead(Guid conversationId)
    {
        var currentUserId = GetCurrentUserId();

        var conversation =
            await _conversationRepository.GetByIdAsync(
                conversationId,
                Context.ConnectionAborted);

        if (conversation is null)
        {
            throw new HubException(
                "Conversation not found.");
        }

        if (!conversation.ContainsUser(currentUserId))
        {
            throw new HubException(
                "You do not belong to this conversation.");
        }

        var result = await _mediator.Send(
            new MarkConversationAsReadCommand(
                currentUserId,
                conversationId),
            Context.ConnectionAborted);

        if (result.MessageIds.Count == 0)
        {
            return;
        }

        var senderUserId =
            conversation.GetOtherUserId(currentUserId);

        await Clients.User(senderUserId.ToString())
            .SendAsync(
                "messagesRead",
                result,
                Context.ConnectionAborted);
    }

    public async Task StartTyping(Guid conversationId)
    {
        var currentUserId = GetCurrentUserId();

        var conversation =
            await _conversationRepository.GetByIdAsync(
                conversationId,
                Context.ConnectionAborted);

        if (conversation is null)
        {
            throw new HubException(
                "Conversation not found.");
        }

        if (!conversation.ContainsUser(currentUserId))
        {
            throw new HubException(
                "You do not belong to this conversation.");
        }

        var recipientId =
            conversation.GetOtherUserId(currentUserId);

        await Clients.User(recipientId.ToString())
            .SendAsync(
                "userTyping",
                new
                {
                    ConversationId = conversationId,
                    UserId = currentUserId
                },
                Context.ConnectionAborted);
    }

    public async Task StopTyping(Guid conversationId)
    {
        var currentUserId = GetCurrentUserId();

        var conversation =
            await _conversationRepository.GetByIdAsync(
                conversationId,
                Context.ConnectionAborted);

        if (conversation is null)
        {
            throw new HubException(
                "Conversation not found.");
        }

        if (!conversation.ContainsUser(currentUserId))
        {
            throw new HubException(
                "You do not belong to this conversation.");
        }

        var recipientId =
            conversation.GetOtherUserId(currentUserId);

        await Clients.User(recipientId.ToString())
            .SendAsync(
                "userStoppedTyping",
                new
                {
                    ConversationId = conversationId,
                    UserId = currentUserId
                },
                Context.ConnectionAborted);
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetCurrentUserId();

        var becameOnline =
            await _presenceService.UserConnectedAsync(
                userId);

        if (becameOnline)
        {
            await Clients.Others
                .SendAsync(
                    "userOnline",
                    userId,
                    Context.ConnectionAborted);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetCurrentUserId();

        var lastSeen =
            await _presenceService.UserDisconnectedAsync(
                userId);

        if (lastSeen.HasValue)
        {
            await Clients.Others
                .SendAsync(
                    "userOffline",
                    new
                    {
                        UserId = userId,
                        LastSeen = lastSeen.Value
                    });
        }

        await base.OnDisconnectedAsync(exception);
    }

    public Task<bool> IsUserOnline(Guid userId)
    {
        return Task.FromResult(
            _presenceService.IsOnline(userId));
    }

    public Task<DateTimeOffset?> GetUserLastSeen(Guid userId)
    {
        if (_presenceService.IsOnline(userId))
        {
            return Task.FromResult<DateTimeOffset?>(
                null);
        }

        return Task.FromResult(
            _presenceService.GetLastSeen(userId));
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim =
            Context.User?.FindFirstValue(
                ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(
                userIdClaim,
                out var userId))
        {
            throw new HubException(
                "Authenticated user ID is invalid.");
        }

        return userId;
    }
}