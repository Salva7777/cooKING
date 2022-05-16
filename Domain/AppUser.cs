using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser<string>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<RecipeCooker> Recipes { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }

    }
}