using SocialApp.Domain.Users;

namespace SocialApp.Application.Common;

public interface IJwtService
{
    string GenerateToken(User user);
}
