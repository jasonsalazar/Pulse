using Microsoft.EntityFrameworkCore;
using SocialApp.Domain.Comments;
using SocialApp.Domain.Likes;
using SocialApp.Domain.Posts;
using SocialApp.Domain.Users;

namespace SocialApp.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    public DbSet<Post> Posts => Set<Post>();

    public DbSet<PostLike> PostLikes => Set<PostLike>();

    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);
    }
}

