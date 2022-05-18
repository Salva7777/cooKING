using System;
using System.Collections.Generic;

namespace Domain
{
    public class Ingredient
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public ICollection<RecipeIngredient> Recipes { get; set; } = new List<RecipeIngredient>();
        public ICollection<UserIngredient> Users { get; set; } = new List<UserIngredient>();

    }
}