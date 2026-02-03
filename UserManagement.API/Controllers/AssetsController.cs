using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserManagement.API.Data;
using UserManagement.API.Models;

namespace UserManagement.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AssetsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Assets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAssets()
        {
            return await _context.Assets
                .Include(a => a.AssignedToUser)
                .Include(a => a.Department)
                .Select(a => new {
                    a.Id,
                    a.Category,
                    a.Product,
                    a.Location,
                    a.Company,
                    a.SerialNumber,
                    a.AssignedToUserId,
                    AssignedToUser = a.AssignedToUser != null ? new { a.AssignedToUser.Id, a.AssignedToUser.FirstName, a.AssignedToUser.LastName } : null,
                    a.Status,
                    a.DepartmentId,
                    Department = a.Department != null ? new { a.Department.Id, a.Department.Name } : null,
                    a.DeploymentDate,
                    a.Vendor,
                    a.Manufacturer,
                    a.PurchaseDate,
                    a.OrderNo,
                    a.Price,
                    a.OrderStatus,
                    a.WarrantyEndDate,
                    a.CPU,
                    a.RAM,
                    a.HDD
                })
                .ToListAsync();
        }

        // GET: api/Assets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetAsset(int id)
        {
            var asset = await _context.Assets
                .Include(a => a.AssignedToUser)
                .Include(a => a.Department)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (asset == null) return NotFound();

            return new {
                asset.Id,
                asset.Category,
                asset.Product,
                asset.Location,
                asset.Company,
                asset.SerialNumber,
                asset.AssignedToUserId,
                AssignedToUser = asset.AssignedToUser != null ? new { asset.AssignedToUser.Id, asset.AssignedToUser.FirstName, asset.AssignedToUser.LastName } : null,
                asset.Status,
                asset.DepartmentId,
                Department = asset.Department != null ? new { asset.Department.Id, asset.Department.Name } : null,
                asset.DeploymentDate,
                asset.Vendor,
                asset.Manufacturer,
                asset.PurchaseDate,
                asset.OrderNo,
                asset.Price,
                asset.OrderStatus,
                asset.WarrantyEndDate,
                asset.CPU,
                asset.RAM,
                asset.HDD
            };
        }

        // POST: api/Assets
        [HttpPost]
        public async Task<ActionResult<Asset>> PostAsset(AssetDto assetDto)
        {
            var asset = new Asset
            {
                Category = assetDto.Category,
                Product = assetDto.Product,
                Location = assetDto.Location,
                Company = assetDto.Company,
                SerialNumber = assetDto.SerialNumber,
                AssignedToUserId = assetDto.AssignedToUserId,
                Status = assetDto.Status,
                DepartmentId = assetDto.DepartmentId,
                DeploymentDate = assetDto.DeploymentDate,
                Vendor = assetDto.Vendor,
                Manufacturer = assetDto.Manufacturer,
                PurchaseDate = assetDto.PurchaseDate,
                OrderNo = assetDto.OrderNo,
                Price = assetDto.Price,
                OrderStatus = assetDto.OrderStatus,
                WarrantyEndDate = assetDto.WarrantyEndDate,
                CPU = assetDto.CPU,
                RAM = assetDto.RAM,
                HDD = assetDto.HDD
            };

            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            await LogAction("Create", "Asset", asset.Id.ToString(), $"Created asset {asset.Product} ({asset.SerialNumber})");

            return CreatedAtAction("GetAsset", new { id = asset.Id }, asset);
        }

        // PUT: api/Assets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsset(int id, AssetDto assetDto)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return NotFound();

            asset.Category = assetDto.Category;
            asset.Product = assetDto.Product;
            asset.Location = assetDto.Location;
            asset.Company = assetDto.Company;
            asset.SerialNumber = assetDto.SerialNumber;
            asset.AssignedToUserId = assetDto.AssignedToUserId;
            asset.Status = assetDto.Status;
            asset.DepartmentId = assetDto.DepartmentId;
            asset.DeploymentDate = assetDto.DeploymentDate;
            asset.Vendor = assetDto.Vendor;
            asset.Manufacturer = assetDto.Manufacturer;
            asset.PurchaseDate = assetDto.PurchaseDate;
            asset.OrderNo = assetDto.OrderNo;
            asset.Price = assetDto.Price;
            asset.OrderStatus = assetDto.OrderStatus;
            asset.WarrantyEndDate = assetDto.WarrantyEndDate;
            asset.CPU = assetDto.CPU;
            asset.RAM = assetDto.RAM;
            asset.HDD = assetDto.HDD;

            try
            {
                await _context.SaveChangesAsync();
                await LogAction("Update", "Asset", id.ToString(), $"Updated asset {asset.Product}");
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssetExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/Assets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null) return NotFound();

            var productName = asset.Product;
            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
            await LogAction("Delete", "Asset", id.ToString(), $"Deleted asset {productName}");

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

        private bool AssetExists(int id)
        {
            return _context.Assets.Any(e => e.Id == id);
        }
    }

    public class AssetDto
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Product { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public int? AssignedToUserId { get; set; }
        public string Status { get; set; } = "Spare";
        public int? DepartmentId { get; set; }
        public DateTime? DeploymentDate { get; set; }
        public string? Vendor { get; set; }
        public string? Manufacturer { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public string? OrderNo { get; set; }
        public string? Price { get; set; }
        public string? OrderStatus { get; set; }
        public DateTime? WarrantyEndDate { get; set; }
        public string? CPU { get; set; }
        public string? RAM { get; set; }
        public string? HDD { get; set; }
    }
}
