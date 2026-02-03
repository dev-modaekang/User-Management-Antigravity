using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagement.API.Data;

namespace UserManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Account == request.Account && u.Password == request.Password);
            if (user == null) return Unauthorized(new { message = "Invalid Account or Password" });

            return new
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Account = user.Account,
                Email = user.Email,
                Role = user.Role
            };
        }
    }

    public class LoginRequest
    {
        public string Account { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
