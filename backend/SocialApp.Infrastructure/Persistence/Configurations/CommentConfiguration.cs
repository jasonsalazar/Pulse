using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Comments;

namespace SocialApp.Infrastructure.Persistence.Configurations;

public class CommentConfiguration
    : IEntityTypeConfiguration<Comment>
{
    public void Configure(
        EntityTypeBuilder<Comment> builder)
    {
        builder.ToTable("comments");

        builder.HasKey(comment => comment.Id);

        builder.Property(comment => comment.Id)
            .IsRequired();

        builder.Property(comment => comment.PostId)
            .IsRequired();

        builder.Property(comment => comment.UserId)
            .IsRequired();

        builder.Property(comment => comment.Content)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(comment => comment.CreatedAt)
            .IsRequired();

        builder.Property(comment => comment.UpdatedAt)
            .IsRequired(false);

        builder.HasIndex(
            comment => comment.PostId);

        builder.HasIndex(
            comment => comment.UserId);
    }
}