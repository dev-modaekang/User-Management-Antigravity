namespace UserManagement.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string UserStatus { get; set; }
        public required string AccountType { get; set; }
        public required string Account { get; set; }
        public required string Domain { get; set; }
        public required string Upn { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string JobTitle { get; set; }
        public required string Company { get; set; }
        public string? Description { get; set; }
        public string? ManagerName { get; set; }
        public required string Department { get; set; }

        public string Role { get; set; } = "User"; // Admin, Technician, User

        // Navigation property for Many-to-Many
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
