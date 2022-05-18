using System;

namespace Domain
{
    public class UserIngredient
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }
    }
}