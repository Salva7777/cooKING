using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppRole : IdentityRole
    {
            public ICollection<AppUserRole> UserRoles { get; set; }
    }
}