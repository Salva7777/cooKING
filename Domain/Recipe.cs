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
        public ICollection<PreparationStep> PreparationSteps { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<Photo> Photos { get; set; }
        //inicializar como lista para conseguir adicionar cookers
        public ICollection<RecipeCooker> Cookers { get; set; } = new List<RecipeCooker>();
        public ICollection<RecipeIngredient> Ingredients { get; set; } = new List<RecipeIngredient>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    }
}