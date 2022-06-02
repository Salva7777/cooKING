

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class Create
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
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.UserName == _userAccessor.GetUsername());

                var cooker = new RecipeCooker
                {
                    AppUser = user,
                    Recipe = request.Recipe,
                    IsOwner = true
                };
                request.Recipe.Cookers.Add(cooker);
                int i = 0;
                foreach (var PreparationStep in request.Recipe.PreparationSteps)
                {
                    request.Recipe.PreparationSteps.FirstOrDefault(x => request.Recipe.PreparationSteps.ToList()[i] == x).StepNo = i;
                    i++;
                }

                _context.Recipes.Add(request.Recipe);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to creeate recipe");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}