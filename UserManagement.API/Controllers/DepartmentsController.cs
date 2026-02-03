using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagement.API.Data;
using UserManagement.API.Models;

namespace UserManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            return await _context.Departments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null) return NotFound();
            return department;
        }

        [HttpPost]
        public async Task<ActionResult<Department>> PostDepartment(Department department)
        {
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            await LogAction("Create", "Department", department.Id.ToString(), $"Created department {department.Name}");

            return CreatedAtAction("GetDepartment", new { id = department.Id }, department);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment(int id, Department department)
        {
            if (id != department.Id) return BadRequest();
            _context.Entry(department).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                await LogAction("Update", "Department", id.ToString(), $"Updated department {department.Name}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Departments.Any(e => e.Id == id)) return NotFound();
                else throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null) return NotFound();

            var name = department.Name;
            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            await LogAction("Delete", "Department", id.ToString(), $"Deleted department {name}");

            return NoContent();
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
}
