using System;
using System.Collections.Generic;
using Application.Core;

namespace Application.Recipes
{
    public class RecipeParams : PagingParams
    {
        public bool HasIngredients { get; set; }

        //receita com todos os seguintes ingredientes
        public ICollection<Guid> SelectedIngredients { get; set; }
        public ICollection<String> Cautions { get; set; }
        public bool Liked { get; set; }
        public bool IsOwner { get; set; }
        public bool Veggie { get; set; }
        public bool LactoseFree { get; set; }
        public bool GlutenFree { get; set; }
        public string Difficulty { get; set; }
        public double Duration { get; set; }
        public bool isFollowingOwner { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;
    }
}