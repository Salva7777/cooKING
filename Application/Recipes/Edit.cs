using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Recipe Recipe { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Recipe).SetValidator(new RecipeValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes.Include(a => a.Ingredients).Include(r => r.PreparationSteps).FirstOrDefaultAsync(x => x.Id == request.Recipe.Id);

                if (recipe == null) return null;

                foreach (var previewIngredient in request.Recipe.Ingredients)
                {
                    var realIngredient = recipe.Ingredients.FirstOrDefault(x => x.IngredientId == previewIngredient.IngredientId);
                    if (realIngredient != null)
                    {
                        realIngredient.IngredientId = previewIngredient.IngredientId;
                        realIngredient.Quantity = previewIngredient.Quantity;
                        realIngredient.Measure = previewIngredient.Measure;
                    }
                    else
                    {
                        var newIngredient = new RecipeIngredient
                        {
                            Recipe = recipe,
                            Ingredient = await _context.Ingredients.FindAsync(previewIngredient.IngredientId),
                            Quantity = previewIngredient.Quantity,
                            Measure = previewIngredient.Measure,
                        };
                        recipe.Ingredients.Add(newIngredient);
                    }
                }
                foreach (var existingIngredient in recipe.Ingredients.ToList())
                {
                    if (!request.Recipe.Ingredients.Any(x => x.IngredientId == existingIngredient.IngredientId))
                        recipe.Ingredients.Remove(existingIngredient);
                }
                if (request.Recipe.PreparationSteps != null)
                {


                    for (int i = 0; i != request.Recipe.PreparationSteps.Count(); i++)
                    {
                        var previewStep = request.Recipe.PreparationSteps.ToList()[i];
                        request.Recipe.PreparationSteps.FirstOrDefault(x => request.Recipe.PreparationSteps.ToList()[i] == x).StepNo = i;
                        var realStep = recipe.PreparationSteps.FirstOrDefault(x => x.StepNo == i);
                        if (realStep != null)
                        {
                            realStep.Text = previewStep.Text;
                        }
                        else
                        {
                            var newStep = new PreparationStep
                            {
                                StepNo = i,
                                Text = previewStep.Text,
                            };
                            recipe.PreparationSteps.Add(newStep);
                        }
                    }
                    foreach (var existingStep in recipe.PreparationSteps.ToList())
                    {
                        if (existingStep.StepNo >= request.Recipe.PreparationSteps.Count())
                        {
                            _context.PreparationSteps.Remove(existingStep);
                        }
                    }
                }
                _mapper.Map(request.Recipe, recipe);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("failed to update recipe");
            }
        }
    }
}