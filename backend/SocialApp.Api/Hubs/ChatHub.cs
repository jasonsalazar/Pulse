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
    IConversationRepository conversationRepository) : Hub
{
    private readonly IMediator _mediator = mediator;

    private readonly IConversationRepository
        _conversationRepository =
            conversationRepository;

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