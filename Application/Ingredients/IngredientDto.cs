using System;
using System.Collections.Generic;
using Domain;

namespace Application.Ingredients
{
    public class IngredientDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Quantity { get; set; }
        public string Measure { get; set; }
    }
}