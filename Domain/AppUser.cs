using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<RecipeCooker> Recipes { get; set; }
        [NotMapped]
        public ICollection<IdentityRole> Roles { get; set; } = new List<IdentityRole>();

    }
}