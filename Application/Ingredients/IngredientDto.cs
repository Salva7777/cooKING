using System;

namespace Application.Ingredients
{
    public class IngredientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatorId { get; set; }
    }
}