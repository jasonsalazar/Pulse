using Microsoft.EntityFrameworkCore;

namespace SocialApp.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
}

