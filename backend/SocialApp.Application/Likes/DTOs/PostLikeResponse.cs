namespace SocialApp.Application.Likes.DTOs;

public record PostLikeResponse(
    Guid PostId,
    bool IsLiked,
    int LikeCount
);