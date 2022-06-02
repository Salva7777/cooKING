using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser<string>
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();

        public ICollection<RecipeCooker> Recipes { get; set; } = new List<RecipeCooker>();
        public ICollection<UserFollowing> Followings { get; set; }
        public ICollection<UserFollowing> Followers { get; set; }
        public ICollection<UserIngredient> Ingredients { get; set; } = new List<UserIngredient>();
        public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();

    }
}