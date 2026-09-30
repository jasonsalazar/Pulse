using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Posts;

namespace SocialApp.Infrastructure.Persistence.Configurations;

public class PostConfiguration
    : IEntityTypeConfiguration<Post>
{
    public void Configure(
        EntityTypeBuilder<Post> builder)
    {
        builder.ToTable("posts");

        builder.HasKey(post => post.Id);

        builder.Property(post => post.Id)
            .IsRequired();

        builder.Property(post => post.UserId)
            .IsRequired();

        builder.Property(post => post.Content)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(post => post.CreatedAt)
            .IsRequired();

        builder.Property(post => post.UpdatedAt)
            .IsRequired(false);

        builder.HasIndex(post => post.UserId);

        builder.HasIndex(post => post.CreatedAt);
    }
}