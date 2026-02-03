using UserManagement.API.Models;

namespace UserManagement.API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            if (context.Users.Any())
            {
                return;   // DB has been seeded
            }

            var users = new User[22];
            var departments = new[] { "IT", "HR", "Sales", "Marketing", "Accounting", "Operation" };
            var companies = new[] { "MyCompany", "PartnerCorp" };
            var domains = new[] { "company.com", "test.com" };

            for (int i = 1; i <= 22; i++)
            {
                var firstName = $"User{i}";
                var lastName = $"Test";
                var domain = domains[i % 2];
                var account = $"{firstName}.{lastName}".ToLower();
                
                users[i - 1] = new User
                {
                    FirstName = firstName,
                    LastName = lastName,
                    UserStatus = i % 5 == 0 ? "Disable" : "Active",
                    AccountType = i % 3 == 0 ? "Service" : "User",
                    Account = account,
                    Domain = domain,
                    Upn = $"{account}@{domain}",
                    Email = $"{account}@{domain}",
                    Password = "Password123!", // Meets complexity requirements
                    JobTitle = "Employee",
                    Company = companies[i % 2],
                    Department = departments[i % departments.Length],
                    Description = $"Auto-generated user {i}",
                    ManagerName = i > 1 ? "User1 Test" : ""
                };
            }

            context.Users.AddRange(users);
            context.SaveChanges();
        }
    }
}
