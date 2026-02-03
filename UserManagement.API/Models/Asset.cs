using System;
using System.ComponentModel.DataAnnotations;

namespace UserManagement.API.Models
{
    public class Asset
    {
        public int Id { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty; // Accessories, Docking Station, Headset, Monitor/TV, PC./Laptop, Phone/Table, Printer, Server/Storage, Switch/Network, UPS, Others

        [Required]
        public string Product { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty; // HQ, Canada, USA, France

        [Required]
        public string Company { get; set; } = string.Empty; // NC, KP, RD

        [Required]
        public string SerialNumber { get; set; } = string.Empty;

        public int? AssignedToUserId { get; set; }
        public User? AssignedToUser { get; set; }

        [Required]
        public string Status { get; set; } = "Spare"; // In Use, Spare

        public int? DepartmentId { get; set; }
        // We link directly to the Department name string in typical setups, 
        // but let's use the ID for robustness if the Department model is available.
        public Department? Department { get; set; }

        public DateTime? DeploymentDate { get; set; }

        // Optional Fields
        public string? Vendor { get; set; }
        public string? Manufacturer { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? OrderNo { get; set; }
        public string? Price { get; set; }
        public string? OrderStatus { get; set; } // Ordered, Delivered
        public DateTime? WarrantyEndDate { get; set; }
        
        // Specs
        public string? CPU { get; set; }
        public string? RAM { get; set; }
        public string? HDD { get; set; }
    }
}
