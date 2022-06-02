using System;

namespace Application.Ingredients
{
    public class IngredientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool Veggie { get; set; }
        public bool LactoseFree { get; set; }
        public bool GlutenFree { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatorId { get; set; }
        public string OwnerUsername { get; set; }
    }
}