using Microsoft.EntityFrameworkCore;
using SocialApp.Application.Common;
using SocialApp.Domain.Users;

namespace SocialApp.Infrastructure.Persistence.Repositories;

public class UserRepository(AppDbContext context) : IUserRepository
{
    private readonly AppDbContext _context = context;

    public async Task AddAsync(
        User user,
        CancellationToken cancellationToken = default)
    {
        await _context.Users.AddAsync(
            user,
            cancellationToken);
    }

    public async Task<User?> GetByEmailAsync(
        string email,
        CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .SingleOrDefaultAsync(
                user => user.Email == email,
                cancellationToken);
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
        .SingleOrDefaultAsync(
            user => user.Id == id,
            cancellationToken);
    }

    public async Task<IReadOnlyList<User>> GetByIdsAsync(
        IEnumerable<Guid> ids,
        CancellationToken cancellationToken = default)
    {
        var userIds = ids
            .Distinct()
            .ToList();

        if (userIds.Count == 0)
        {
            return [];
        }

        return await _context.Users
            .AsNoTracking()
            .Where(user => userIds.Contains(user.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task<User?> GetByUsernameAsync(
        string username,
        CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .SingleOrDefaultAsync(
                user => user.Username == username,
                cancellationToken);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
