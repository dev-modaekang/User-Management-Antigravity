using System;

namespace UserManagement.API.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string PerformedBy { get; set; } = string.Empty; // Account name or email
        public string Action { get; set; } = string.Empty; // Create, Update, Delete
        public string TargetEntity { get; set; } = string.Empty; // User, Group, Department
        public string? TargetId { get; set; }
        public string ChangeSummary { get; set; } = string.Empty;
    }
}
