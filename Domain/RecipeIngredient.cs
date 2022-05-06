using System;

namespace Domain
{
    public class RecipeIngredient
    {
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public Guid IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }
        public double Quantity { get; set; }
        public string Measure { get; set; }
    }
}