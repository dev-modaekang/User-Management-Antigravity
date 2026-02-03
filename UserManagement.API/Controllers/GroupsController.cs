using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagement.API.Data;
using UserManagement.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GroupsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Groups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetGroups()
        {
            // Return group info with member counts
            return await _context.Groups
                .Include(g => g.Members)
                .Select(g => new
                {
                    g.Id,
                    g.GroupName,
                    g.Type,
                    g.Department,
                    MemberCount = g.Members.Count
                })
                .ToListAsync();
        }

        // GET: api/Groups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetGroup(int id)
        {
            var group = await _context.Groups
                .Include(g => g.Members)
                .FirstOrDefaultAsync(g => g.Id == id);

            if (group == null)
            {
                return NotFound();
            }

            return new
            {
                group.Id,
                group.GroupName,
                group.Type,
                group.Department,
                Members = group.Members.Select(m => new { m.Id, m.FirstName, m.LastName, m.Email })
            };
        }

        // POST: api/Groups
        [HttpPost]
        public async Task<ActionResult<Group>> PostGroup(GroupDto groupDto)
        {
            var group = new Group
            {
                GroupName = groupDto.GroupName,
                Type = groupDto.Type,
                Department = groupDto.Department
            };

            if (groupDto.MemberIds != null && groupDto.MemberIds.Any())
            {
                var users = await _context.Users.Where(u => groupDto.MemberIds.Contains(u.Id)).ToListAsync();
                group.Members = users;
            }

            _context.Groups.Add(group);
            await _context.SaveChangesAsync();

            await LogAction("Create", "Group", group.Id.ToString(), $"Created group {group.GroupName}");

            return CreatedAtAction("GetGroup", new { id = group.Id }, group);
        }

        // PUT: api/Groups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGroup(int id, GroupDto groupDto)
        {
            var group = await _context.Groups.Include(g => g.Members).FirstOrDefaultAsync(g => g.Id == id);
            if (group == null)
            {
                return NotFound();
            }

            group.GroupName = groupDto.GroupName;
            group.Type = groupDto.Type;
            group.Department = groupDto.Department;

            // Update Members
            group.Members.Clear();
            if (groupDto.MemberIds != null && groupDto.MemberIds.Any())
            {
                var users = await _context.Users.Where(u => groupDto.MemberIds.Contains(u.Id)).ToListAsync();
                foreach (var user in users)
                {
                    group.Members.Add(user);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                await LogAction("Update", "Group", id.ToString(), $"Updated group {group.GroupName}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Groups.Any(e => e.Id == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Groups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGroup(int id)
        {
            var group = await _context.Groups.FindAsync(id);
            if (group == null) return NotFound();

            var name = group.GroupName;
            _context.Groups.Remove(group);
            await _context.SaveChangesAsync();

            await LogAction("Delete", "Group", id.ToString(), $"Deleted group {name}");

            return NoContent();
        }

        private bool GroupExists(int id)
        {
            return _context.Groups.Any(e => e.Id == id);
        }

        private async Task LogAction(string action, string entity, string targetId, string summary)
        {
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
    }

    public class GroupDto
    {
        public string GroupName { get; set; } = string.Empty;
        public string Type { get; set; } = "Security";
        public string Department { get; set; } = string.Empty;
        public List<int>? MemberIds { get; set; } = new List<int>();
    }
}
