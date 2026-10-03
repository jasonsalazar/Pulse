using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Messaging;

namespace SocialApp.Infrastructure.Persistence.Configurations.Messaging;

public class MessageConfiguration
    : IEntityTypeConfiguration<Message>
{
    public void Configure(
        EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages");

        builder.HasKey(
            message => message.Id);

        builder.Property(
                message => message.Id)
            .HasColumnName("id");

        builder.Property(
                message => message.ConversationId)
            .HasColumnName("conversation_id")
            .IsRequired();

        builder.Property(
                message => message.SenderId)
            .HasColumnName("sender_id")
            .IsRequired();

        builder.Property(
                message => message.Content)
            .HasColumnName("content")
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(
                message => message.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(
                message => message.ReadAt)
            .HasColumnName("read_at");

        builder.HasIndex(
            message => new
            {
                message.ConversationId,
                message.CreatedAt
            });

        builder.HasIndex(
            message => new
            {
                message.ConversationId,
                message.SenderId,
                message.ReadAt
            });
    }
}