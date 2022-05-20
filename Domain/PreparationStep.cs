using System;

namespace Domain
{
    public class PreparationStep
    {
        public int StepNo { get; set; }
        public string Text { get; set; }
        public Recipe Recipe { get; set; }
        public Guid RecipeId { get; set; }
    }
}