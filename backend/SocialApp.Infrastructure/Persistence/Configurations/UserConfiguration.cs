using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialApp.Domain.Users;

namespace SocialApp.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(user => user.Id);

        builder.Property(user => user.Username)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(user => user.Username)
            .IsUnique();

        builder.Property(user => user.Email)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(user => user.Email)
            .IsUnique();

        builder.Property(user => user.PasswordHash)
            .IsRequired();

        builder.Property(user => user.CreatedAt)
            .IsRequired();

        builder.Property(user => user.DisplayName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(user => user.Bio)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(user => user.ProfileImageUrl)
            .HasMaxLength(500);
    }
}
