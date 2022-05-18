using System;
using System.Collections;
using System.Collections.Generic;
using Application.Durations;
using Application.Ingredients;
using Application.Profiles;
using Domain;

namespace Application.Recipes
{
    public class RecipeDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Difficulty { get; set; }
        public string Description { get; set; }
        public DurationDto Duration { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string OwnerUsername { get; set; }
        public string Image { get; set; }
        public ICollection<Profile> Cookers { get; set; }
        public ICollection<RecipeIngredientDto> Ingredients { get; set; }
    }
}