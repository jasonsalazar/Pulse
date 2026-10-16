using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialApp.Application.Authentication.DTOs;
using SocialApp.Application.Common;
using SocialApp.Domain.Users;

namespace SocialApp.Application.Authentication.Commands.Login;

public sealed class LoginCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher<User> passwordHasher,
    IJwtService jwtService,
    IRefreshTokenRepository refreshTokens,
    IRefreshTokenService tokenService)
    : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;
    private readonly IJwtService _jwtService = jwtService;
    private readonly IRefreshTokenRepository _refreshTokens = refreshTokens;
    private readonly IRefreshTokenService _tokenService = tokenService;

    public async Task<LoginResult> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var user = await _userRepository.GetByEmailAsync(
            email,
            cancellationToken);

        if (user is null)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException(
                "Invalid email or password.");
        }

        // Generate the access token before persisting a refresh token.
        var accessToken = _jwtService.GenerateToken(user);

        var rawRefreshToken = _tokenService.GenerateToken();
        var refreshTokenHash = _tokenService.HashToken(rawRefreshToken);
        var expiresAt = DateTime.UtcNow.AddDays(7);

        var refreshToken = Domain.Authentication.RefreshToken.Create(
            user.Id,
            refreshTokenHash,
            expiresAt);

        await _refreshTokens.AddAsync(
            refreshToken,
            cancellationToken);

        await _refreshTokens.SaveChangesAsync(
            cancellationToken);

        return new LoginResult(
            user.Id,
            user.Username,
            user.Email,
            accessToken,
            rawRefreshToken,
            expiresAt);
    }
}
