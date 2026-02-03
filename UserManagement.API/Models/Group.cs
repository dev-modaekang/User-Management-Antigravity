using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace UserManagement.API.Models
{
    public class Group
    {
        public int Id { get; set; }

        [Required]
        public string GroupName { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = "Security"; // Security or Distribution

        [Required]
        public string Department { get; set; } = string.Empty;

        // Navigation property for Many-to-Many
        public ICollection<User> Members { get; set; } = new List<User>();
    }
}
