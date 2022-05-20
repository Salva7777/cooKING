using System.Collections.Generic;
using System.Linq;
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
            // RuleFor(x => x.PreparationSteps).Must(list => !IsDuplicate(list)).WithMessage("The Steps can't have the same number");
            // RuleForEach(x => x.PreparationSteps).ChildRules(x => x.RuleFor(y => y.StepNo).NotEmpty());

        }
        private bool IsDuplicate(ICollection<PreparationStep> PreparationSteps)
        {
            return PreparationSteps.Select(ps => ps.StepNo).Count() != PreparationSteps.Select(ps => ps.StepNo).Distinct().Count();
        }
    }
}