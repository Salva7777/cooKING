using System;
using System.Collections;
using System.Collections.Generic;
using Application.Profiles;
using Domain;

namespace Application.Recipes
{
    public class RecipeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Difficulty { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string OwnerUsername { get; set; }
        public ICollection<Profile> Cookers { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; }
    }
}