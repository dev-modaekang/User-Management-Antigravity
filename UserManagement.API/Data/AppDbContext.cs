using Microsoft.EntityFrameworkCore;
using UserManagement.API.Models;

namespace UserManagement.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Asset> Assets { get; set; }
    }
}
