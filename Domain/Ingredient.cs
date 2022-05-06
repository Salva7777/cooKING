using System;
using System.Collections.Generic;

namespace Domain
{
    public class Ingredient
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<RecipeIngredient> Recipes { get; set; } = new List<RecipeIngredient>();
    }
}