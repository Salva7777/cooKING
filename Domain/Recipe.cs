using System;
using System.Collections.Generic;

namespace Domain
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Difficulty { get; set; }
        public string Description { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        //inicializar como lista para conseguir adicionar cookers
        public ICollection<RecipeCooker> Cookers { get; set; } = new List<RecipeCooker>();
        public ICollection<RecipeIngredient> Ingredients { get; set; } = new List<RecipeIngredient>();
    }
}