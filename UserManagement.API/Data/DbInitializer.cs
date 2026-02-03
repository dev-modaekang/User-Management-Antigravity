using UserManagement.API.Models;

namespace UserManagement.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            // 1. Seed System Users (Admin, Technician) regardless of table state
            if (!context.Users.Any(u => u.Account == "admin"))
            {
                context.Users.Add(new User
                {
                    FirstName = "System",
                    LastName = "Administrator",
                    UserStatus = "Active",
                    AccountType = "System",
                    Account = "admin",
                    Domain = "system.local",
                    Upn = "admin@system.local",
                    Email = "admin@system.local",
                    Password = "admin",
                    JobTitle = "System Admin",
                    Company = "MK CORE",
                    Department = "IT",
                    Description = "Super Administrator",
                    Role = "Admin"
                });
            }

            if (!context.Users.Any(u => u.Account == "tech"))
            {
                context.Users.Add(new User
                {
                    FirstName = "System",
                    LastName = "Technician",
                    UserStatus = "Active",
                    AccountType = "System",
                    Account = "tech",
                    Domain = "system.local",
                    Upn = "tech@system.local",
                    Email = "tech@system.local",
                    Password = "password",
                    JobTitle = "Technician",
                    Company = "MK CORE",
                    Department = "IT",
                    Description = "System Technician",
                    Role = "Technician"
                });
            }
            
            context.SaveChanges(); // Save system accounts first

            // 2. Seed Sample Users ONLY if table is mostly empty (e.g. only system accounts exist)
            // Checking if we have less than 5 users as a proxy for "no sample data"
            if (context.Users.Count() < 5)
            {
                var users = new List<User>();
                var departments = new[] { "IT", "HR", "Sales", "Marketing", "Accounting", "Operation" };
                var companies = new[] { "MyCompany", "PartnerCorp" };
                var domains = new[] { "company.com", "test.com" };

                for (int i = 1; i <= 22; i++)
                {
                    var firstName = $"User{i}";
                    var lastName = $"Test";
                    var domain = domains[i % 2];
                    var account = $"{firstName}.{lastName}".ToLower();
                    
                    if (!context.Users.Any(u => u.Account == account))
                    {
                        users.Add(new User
                        {
                            FirstName = firstName,
                            LastName = lastName,
                            UserStatus = i % 5 == 0 ? "Disable" : "Active",
                            AccountType = i % 3 == 0 ? "Service" : "User",
                            Account = account,
                            Domain = domain,
                            Upn = $"{account}@{domain}",
                            Email = $"{account}@{domain}",
                            Password = "Password123!",
                            JobTitle = "Employee",
                            Company = companies[i % 2],
                            Department = departments[i % departments.Length],
                            Description = $"Auto-generated user {i}",
                            ManagerName = i > 1 ? "User1 Test" : "",
                            Role = "User"
                        });
                    }
                }
                if (users.Any())
                {
                    context.Users.AddRange(users);
                    context.SaveChanges();
                }
            }

            if (!context.Departments.Any())
            {
                var departmentNames = new[] 
                { 
                    "IT", "HR", "Sales", "Marketing", "Accounting", "Operation",
                    "Customer Service", "Global", "Research", "Legal", "Quality Assurance", "Product" 
                };
                foreach (var name in departmentNames)
                {
                    context.Departments.Add(new Department { Name = name, Description = $"{name} Department" });
                }
                context.SaveChanges();
            }

            if (!context.Groups.Any())
            {
                var allUsers = context.Users.ToList();
                var departments = new[] { "IT", "HR", "Sales", "Marketing", "Accounting", "Operation" };
                var groupNames = new List<(string Name, string Dept)>
                {
                    ("IT Security Group", "IT"),
                    ("HR Global Team", "HR"),
                    ("Sales Force One", "Sales"),
                    ("Marketing Creative", "Marketing"),
                    ("Accounting Audit", "Accounting"),
                    ("Operation Support", "Operation"),
                    ("Cloud Infrastructure", "IT"),
                    ("Recruitment Taskforce", "HR"),
                    ("Key Account Managers", "Sales"),
                    ("Product Launch 2026", "Marketing"),
                    ("Internal Control", "Accounting"),
                    ("Quality Assurance", "Operation")
                };

                var random = new Random();
                foreach (var gInfo in groupNames)
                {
                    var group = new Group
                    {
                        GroupName = gInfo.Name,
                        Department = gInfo.Dept,
                        Type = random.Next(2) == 0 ? "Security" : "Distribution",
                        Members = allUsers.OrderBy(u => random.Next()).Take(random.Next(3, 8)).ToList()
                    };
                    context.Groups.Add(group);
                }
                context.SaveChanges();
            }

            if (!context.Assets.Any())
            {
                var itDept = context.Departments.FirstOrDefault(d => d.Name == "IT");
                var hrDept = context.Departments.FirstOrDefault(d => d.Name == "HR");
                var salesDept = context.Departments.FirstOrDefault(d => d.Name == "Sales");
                
                var adminUser = context.Users.FirstOrDefault(u => u.Account == "admin");
                var techUser = context.Users.FirstOrDefault(u => u.Account == "tech");
                var allUsers = context.Users.ToList();
                
                var categories = new[] { "PC/LAPTOP", "PC/LAPTOP", "Monitor/TV", "Phone/Table", "Accessories", "Switch/Network", "Printer", "Docking Station", "Headset", "UPS", "Server/Storage" };
                var locations = new[] { "HQ", "Canada", "USA", "France" };
                var companies = new[] { "NC", "KP", "RD" };
                var manufacturers = new[] { "Apple", "Dell", "Lenovo", "HP", "Cisco", "Samsung", "Logitech", "APC" };
                var vendors = new[] { "Amazon", "Direct", "CDW", "Verizon", "Best Buy", "Internal" };

                var assets = new List<Asset>();
                var random = new Random();

                for (int i = 1; i <= 35; i++)
                {
                    var cat = categories[i % categories.Length];
                    var manuf = manufacturers[i % manufacturers.Length];
                    var loc = locations[i % locations.Length];
                    var comp = companies[i % companies.Length];
                    var vendor = vendors[i % vendors.Length];
                    
                    var product = cat switch {
                        "PC/LAPTOP" => manuf == "Apple" ? "MacBook Pro 14" : manuf == "Lenovo" ? "ThinkPad X1" : "EliteBook 840",
                        "Monitor/TV" => $"{manuf} UltraSharp 27\"",
                        "Phone/Table" => manuf == "Apple" ? "iPhone 15" : "Galaxy S23",
                        "Accessories" => $"{manuf} Wireless Mouse",
                        "Switch/Network" => "Catalyst 9300",
                        "Printer" => "LaserJet Pro",
                        "Server/Storage" => "PowerEdge R750",
                        _ => $"{manuf} Generic {cat}"
                    };

                    assets.Add(new Asset
                    {
                        Category = cat,
                        Product = product,
                        Location = loc,
                        Company = comp,
                        SerialNumber = $"SN-{cat.Substring(0, 2).ToUpper()}-{1000 + i}",
                        Status = i % 5 == 0 ? "Spare" : "In Use",
                        AssignedToUserId = i % 5 == 0 ? null : allUsers[random.Next(allUsers.Count)].Id,
                        DeploymentDate = DateTime.Now.AddDays(-random.Next(1, 400)),
                        Manufacturer = manuf,
                        Vendor = vendor,
                        PurchaseDate = DateTime.Now.AddDays(-random.Next(400, 800)),
                        WarrantyEndDate = DateTime.Now.AddDays(random.Next(100, 500)),
                        CPU = cat == "PC/LAPTOP" ? (manuf == "Apple" ? "M2" : "i7-12700H") : null,
                        RAM = cat == "PC/LAPTOP" ? "16GB" : null,
                        HDD = cat == "PC/LAPTOP" ? "512GB SSD" : null,
                        OrderNo = $"PO-{2024000 + i}",
                        Price = $"{random.Next(100, 3000)}.00"
                    });
                }
                
                context.Assets.AddRange(assets);
                context.SaveChanges();
            }

            if (!context.AuditLogs.Any())
            {
                context.AuditLogs.AddRange(new List<AuditLog>
                {
                    new AuditLog { Timestamp = DateTime.UtcNow.AddHours(-48), PerformedBy = "admin", Action = "Create", TargetEntity = "Department", ChangeSummary = "Created 'IT' department" },
                    new AuditLog { Timestamp = DateTime.UtcNow.AddHours(-47), PerformedBy = "admin", Action = "Create", TargetEntity = "User", TargetId = "tech", ChangeSummary = "Created system technician account" },
                    new AuditLog { Timestamp = DateTime.UtcNow.AddHours(-46), PerformedBy = "admin", Action = "Create", TargetEntity = "Group", ChangeSummary = "Created 'IT Security Group' with initial members" },
                    new AuditLog { Timestamp = DateTime.UtcNow.AddHours(-24), PerformedBy = "tech", Action = "Create", TargetEntity = "Asset", TargetId = "SN-PC-1001", ChangeSummary = "Registered new MacBook Pro 14" },
                    new AuditLog { Timestamp = DateTime.UtcNow.AddHours(-22), PerformedBy = "tech", Action = "Update", TargetEntity = "Asset", TargetId = "SN-PC-1001", ChangeSummary = "Assigned asset to System Administrator" },
                    new AuditLog { Timestamp = DateTime.UtcNow.AddHours(-5), PerformedBy = "admin", Action = "Update", TargetEntity = "User", TargetId = "User1.Test", ChangeSummary = "Changed status to Disabled" }
                });
                context.SaveChanges();
            }
        }
    }
}
