namespace SocialApp.Application.Comments.DTOs;

public record CommentResponse(
    Guid CommentId,
    Guid PostId,
    Guid UserId,
    string Username,
    string DisplayName,
    string? ProfileImageUrl,
    string Content,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);