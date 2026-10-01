using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Follows;

namespace SocialApp.Infrastructure.Persistence.Configurations;

public class UserFollowConfiguration
    : IEntityTypeConfiguration<UserFollow>
{
    public void Configure(
        EntityTypeBuilder<UserFollow> builder)
    {
        builder.ToTable("user_follows");

        builder.HasKey(follow => follow.Id);

        builder.Property(follow => follow.Id)
            .IsRequired();

        builder.Property(follow => follow.FollowerId)
            .IsRequired();

        builder.Property(follow => follow.FollowingId)
            .IsRequired();

        builder.Property(follow => follow.CreatedAt)
            .IsRequired();

        // A user can only follow another user once.
        builder.HasIndex(
                follow => new
                {
                    follow.FollowerId,
                    follow.FollowingId
                })
            .IsUnique();

        // Useful when retrieving followers.
        builder.HasIndex(
            follow => follow.FollowingId);

        // Useful when retrieving following.
        builder.HasIndex(
            follow => follow.FollowerId);
    }
}