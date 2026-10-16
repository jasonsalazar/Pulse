namespace SocialApp.Application.Common;

public interface IRefreshTokenService
{
    string GenerateToken();

    string HashToken(string token);
}