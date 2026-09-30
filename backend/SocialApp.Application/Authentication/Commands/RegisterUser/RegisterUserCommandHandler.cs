using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialApp.Application.Authentication.DTOs;
using SocialApp.Application.Authentication.PasswordValidation;
using SocialApp.Application.Common;
using SocialApp.Domain.Users;

namespace SocialApp.Application.Authentication.Commands.RegisterUser;

public class RegisterUserCommandHandler(
    IUserRepository userRepository,
    IPasswordHasher<User> passwordHasher
    ) : IRequestHandler<RegisterUserCommand, AuthResponse>
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPasswordHasher<User> _passwordHasher = passwordHasher;

    public async Task<AuthResponse> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var username = request.Username.Trim();

        if (request.Password != request.ConfirmPassword)
        {
            throw new ArgumentException(
                "Passwords do not match.");
        }

        var passwordValidation = PasswordValidator.Validate(request.Password);

        if (!passwordValidation.IsValid)
        {
            throw new ArgumentException(
                string.Join(" ", passwordValidation.Errors));
        }

        var existingEmail =
            await _userRepository.GetByEmailAsync(
                email,
                cancellationToken);

        if (existingEmail is not null)
        {
            throw new InvalidOperationException(
                "An account with this email already exists.");
        }

        var existingUsername =
            await _userRepository.GetByUsernameAsync(
                username,
                cancellationToken);

        if (existingUsername is not null)
        {
            throw new InvalidOperationException(
                "This username is already taken.");
        }

        var user = new User(username, email, string.Empty);

        var passwordHash = _passwordHasher.HashPassword(
            user,
            request.Password);

        user.SetPasswordHash(passwordHash);

        await _userRepository.AddAsync(user, cancellationToken);

        await _userRepository.SaveChangesAsync(cancellationToken);

        return new AuthResponse(
            user.Id,
            user.Username,
            user.Email);
    }
}
