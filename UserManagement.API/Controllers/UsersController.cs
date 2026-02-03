using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagement.API.Data;
using UserManagement.API.Models;

namespace UserManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Groups)
                .Select(u => new {
                    u.Id, u.FirstName, u.LastName, u.UserStatus, u.AccountType, 
                    u.Account, u.Domain, u.Upn, u.Email, u.JobTitle, 
                    u.Company, u.Description, u.ManagerName, u.Department,
                    u.Role,
                    Groups = u.Groups.Select(g => new { g.Id, g.GroupName })
                })
                .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Groups)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            return new {
                user.Id, user.FirstName, user.LastName, user.UserStatus, user.AccountType, 
                user.Account, user.Domain, user.Upn, user.Email, user.Password, user.JobTitle, 
                user.Company, user.Description, user.ManagerName, user.Department,
                user.Role,
                Groups = user.Groups.Select(g => new { g.Id, g.GroupName })
            };
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(UserDto userDto)
        {
            var user = new User
            {
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                UserStatus = userDto.UserStatus,
                AccountType = userDto.AccountType,
                Account = userDto.Account,
                Domain = userDto.Domain,
                Upn = userDto.Upn,
                Email = userDto.Email,
                Password = userDto.Password,
                JobTitle = userDto.JobTitle,
                Company = userDto.Company,
                Description = userDto.Description,
                ManagerName = userDto.ManagerName,
                Department = userDto.Department,
                Role = userDto.Role
            };

            if (userDto.GroupIds != null && userDto.GroupIds.Any())
            {
                var groups = await _context.Groups.Where(g => userDto.GroupIds.Contains(g.Id)).ToListAsync();
                user.Groups = groups;
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await LogAction("Create", "User", user.Id.ToString(), $"Created user {user.Account}");

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            Console.WriteLine($"Updating User {id}. Incoming GroupIds: {string.Join(",", userDto.GroupIds ?? new List<int>())}");
            var user = await _context.Users.Include(u => u.Groups).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();

            user.FirstName = userDto.FirstName;
            user.LastName = userDto.LastName;
            user.UserStatus = userDto.UserStatus;
            user.AccountType = userDto.AccountType;
            user.Account = userDto.Account;
            user.Domain = userDto.Domain;
            user.Upn = userDto.Upn;
            user.Email = userDto.Email;
            if (!string.IsNullOrEmpty(userDto.Password)) user.Password = userDto.Password;
            user.JobTitle = userDto.JobTitle;
            user.Company = userDto.Company;
            user.Description = userDto.Description;
            user.ManagerName = userDto.ManagerName;
            user.Department = userDto.Department;
            user.Role = userDto.Role;

            // Update Groups
            user.Groups.Clear();
            if (userDto.GroupIds != null && userDto.GroupIds.Any())
            {
                var groups = await _context.Groups.Where(g => userDto.GroupIds.Contains(g.Id)).ToListAsync();
                Console.WriteLine($"Found {groups.Count} groups to assign.");
                foreach (var group in groups)
                {
                    user.Groups.Add(group);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                Console.WriteLine($"Saved User {id}. Group count: {user.Groups.Count}");
                await LogAction("Update", "User", id.ToString(), $"Updated user {user.Account}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            var account = user.Account;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            await LogAction("Delete", "User", id.ToString(), $"Deleted user {account}");

            return NoContent();
        }

        private async Task LogAction(string action, string entity, string targetId, string summary)
        {
            if (HttpContext == null || Request == null) return;
            var performedBy = Request.Headers["X-Performed-By"].FirstOrDefault() ?? "System";
            var log = new AuditLog
            {
                Timestamp = DateTime.UtcNow,
                PerformedBy = performedBy,
                Action = action,
                TargetEntity = entity,
                TargetId = targetId,
                ChangeSummary = summary
            };
            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserStatus { get; set; } = "Active";
        public string AccountType { get; set; } = "User";
        public string Account { get; set; } = string.Empty;
        public string Domain { get; set; } = string.Empty;
        public string Upn { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ManagerName { get; set; }
        public string Department { get; set; } = string.Empty;
        public string Role { get; set; } = "User";
        public List<int>? GroupIds { get; set; } = new List<int>();
    }
}
