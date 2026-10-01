using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Likes;

namespace SocialApp.Infrastructure.Persistence.Configurations;

public class PostLikeConfiguration
    : IEntityTypeConfiguration<PostLike>
{
    public void Configure(
        EntityTypeBuilder<PostLike> builder)
    {
        builder.ToTable("post_likes");

        builder.HasKey(like => like.Id);

        builder.Property(like => like.Id)
            .IsRequired();

        builder.Property(like => like.PostId)
            .IsRequired();

        builder.Property(like => like.UserId)
            .IsRequired();

        builder.Property(like => like.CreatedAt)
            .IsRequired();

        // A user can like a post only once.
        builder.HasIndex(
                like => new
                {
                    like.PostId,
                    like.UserId
                })
            .IsUnique();

        builder.HasIndex(
            like => like.PostId);
    }
}