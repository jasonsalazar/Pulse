using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Notifications;

namespace SocialApp.Infrastructure.Persistence.Configurations;

public class NotificationConfiguration
    : IEntityTypeConfiguration<Notification>
{
    public void Configure(
        EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(notification => notification.Id);

        builder.Property(notification => notification.RecipientId)
            .IsRequired();

        builder.Property(notification => notification.ActorId)
            .IsRequired();

        builder.Property(notification => notification.Type)
            .IsRequired()
            .HasConversion<int>();

        builder.Property(notification => notification.PostId);

        builder.Property(notification => notification.CreatedAt)
            .IsRequired();

        builder.Property(notification => notification.ReadAt);

        builder.HasIndex(notification => new
        {
            notification.RecipientId,
            notification.CreatedAt
        });

        builder.HasIndex(notification => new
        {
            notification.RecipientId,
            notification.ReadAt
        });
    }
}