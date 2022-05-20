using FluentValidation;
using Domain;

namespace Application.Ingredients
{
    public class IngredientValidator : AbstractValidator<Ingredient>
    {
        public IngredientValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Veggie).NotEmpty();
            RuleFor(x => x.LactoseFree).NotEmpty();
            RuleFor(x => x.GlutenFree).NotEmpty();
        }
    }
}