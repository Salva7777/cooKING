using Domain;
using FluentValidation;

namespace Application.Recipes
{
    public class RecipeValidator : AbstractValidator<Recipe>
    {
        public RecipeValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Difficulty).NotEmpty();
            RuleFor(x => x.Duration).NotEmpty();
            RuleFor(x => x.Ingredients).NotEmpty();
        }
    }
}