namespace SocialApp.Application.Posts.DTOs;

public record PostResponse(
    Guid PostId,
    Guid UserId,
    string Username,
    string DisplayName,
    string? ProfileImageUrl,
    string Content,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    int LikeCount,
    int CommentCount,
    bool IsLikedByCurrentUser
);