using FluentValidation;
using Domain;

namespace Application.Ingredients
{
    public class IngredientValidator : AbstractValidator<Ingredient>
    {
        public IngredientValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
        }
    }
}