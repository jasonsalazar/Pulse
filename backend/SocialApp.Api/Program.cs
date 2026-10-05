using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using SocialApp.Api.Hubs;
using SocialApp.Application;
using SocialApp.Infrastructure;
using SocialApp.Infrastructure.Authentication;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddApplication();

builder.Services.AddInfrastructure(builder.Configuration);

var jwtSettings =
    builder.Configuration
        .GetSection("Jwt")
        .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JWT settings are not configured.");

var signingKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(jwtSettings.Key));

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey = signingKey,

                ValidateIssuer = true,

                ValidIssuer = jwtSettings.Issuer,

                ValidateAudience = true,

                ValidAudience = jwtSettings.Audience,

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };

        options.Events =
            new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken =
                        context.Request.Query[
                            "access_token"];

                    var path =
                        context.HttpContext.Request.Path;

                    if (!string.IsNullOrEmpty(accessToken) &&
                        path.StartsWithSegments(
                            "/hubs/chat"))
                    {
                        context.Token =
                            accessToken;
                    }

                    return Task.CompletedTask;
                }
            };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactClient", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "http://192.168.1.12:3000",
                "http://192.168.1.12:5000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSignalR();

builder.Services.AddSingleton<IUserIdProvider, UserIdProvider>();

var app = builder.Build();

app.UseExceptionHandler(exceptionApp =>
{
    exceptionApp.Run(async context =>
    {
        context.Response.ContentType =
            "application/json";

        var exception =
            context.Features
                .Get<
                    Microsoft.AspNetCore.Diagnostics
                    .IExceptionHandlerFeature>()
                ?.Error;

        context.Response.StatusCode =
            exception switch
            {
                UnauthorizedAccessException
                    => StatusCodes.Status403Forbidden,

                KeyNotFoundException
                    => StatusCodes.Status404NotFound,

                ArgumentException
                    => StatusCodes.Status400BadRequest,

                InvalidOperationException
                    => StatusCodes.Status400BadRequest,

                _ => StatusCodes.Status500InternalServerError
            };

        var message =
            exception?.Message ??
            "An unexpected error occurred.";

        await context.Response.WriteAsJsonAsync(
            new
            {
                message
            });
    });
});

app.UseHttpsRedirection();

app.UseCors("ReactClient");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/hubs/chat");

app.MapGet("/api/health", () =>
{
    return Results.Ok(new
    {
        status = "ok",
        service = "SocialApp API"
    });
});

app.Run();