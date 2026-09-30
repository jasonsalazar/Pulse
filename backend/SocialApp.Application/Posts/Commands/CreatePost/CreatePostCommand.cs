using MediatR;
using SocialApp.Application.Posts.DTOs;

namespace SocialApp.Application.Posts.Commands.CreatePost;

public record CreatePostCommand(
    Guid UserId,
    string Content
) : IRequest<PostResponse>;