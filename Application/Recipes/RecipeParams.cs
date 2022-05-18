using System;
using System.Collections.Generic;

namespace Application.Recipes
{
    public class RecipeParams
    {
        public bool HasIngredients { get; set; }

        //receita com todos os seguintes ingredientes
        public ICollection<Guid> SelectedIngredients { get; set; }
        public bool Liked { get; set; }
        public bool IsOwner { get; set; }
        public string Difficulty { get; set; }
        public double Duration { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;
    }
}