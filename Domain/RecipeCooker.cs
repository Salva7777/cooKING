using System;

namespace Domain
{
    public class RecipeCooker
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public bool IsOwner { get; set; }
    }
}