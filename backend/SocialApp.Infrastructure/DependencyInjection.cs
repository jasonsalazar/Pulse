using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SocialApp.Application.Common;
using SocialApp.Domain.Users;
using SocialApp.Infrastructure.Authentication;
using SocialApp.Infrastructure.Persistence;
using SocialApp.Infrastructure.Persistence.Repositories;

namespace SocialApp.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
        {
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddScoped<IUserRepository, UserRepository>();

        services.AddScoped<IPostRepository, PostRepository>();

        services.AddScoped<IPostLikeRepository, PostLikeRepository>();

        services.AddScoped<ICommentRepository, CommentRepository>();

        services.AddScoped<IUserFollowRepository, UserFollowRepository>();

        services.AddScoped<IPostFeedRepository, PostFeedRepository>();

        services.AddScoped<INotificationRepository, NotificationRepository>();

        services.AddScoped<IConversationRepository, ConversationRepository>();

        services.AddScoped<IMessageRepository, MessageRepository>();

        services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}