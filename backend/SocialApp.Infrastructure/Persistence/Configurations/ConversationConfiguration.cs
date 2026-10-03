using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Messaging;

namespace SocialApp.Infrastructure.Persistence.Configurations.Messaging;

public class ConversationConfiguration
    : IEntityTypeConfiguration<Conversation>
{
    public void Configure(
        EntityTypeBuilder<Conversation> builder)
    {
        builder.ToTable("conversations");

        builder.HasKey(
            conversation => conversation.Id);

        builder.Property(
                conversation => conversation.Id)
            .HasColumnName("id");

        builder.Property(
                conversation => conversation.User1Id)
            .HasColumnName("user1_id")
            .IsRequired();

        builder.Property(
                conversation => conversation.User2Id)
            .HasColumnName("user2_id")
            .IsRequired();

        builder.Property(
                conversation => conversation.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(
                conversation => conversation.LastMessageAt)
            .HasColumnName("last_message_at");

        builder.HasIndex(
                conversation => new
                {
                    conversation.User1Id,
                    conversation.User2Id
                })
            .IsUnique();

        builder.HasIndex(
            conversation =>
                conversation.LastMessageAt);
    }
}