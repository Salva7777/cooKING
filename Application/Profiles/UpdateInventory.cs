using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class UpdateInventory
    {
        public class Command : IRequest<Result<Unit>>
        {
            public List<Guid> Ids { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var ingredients = await _context.Ingredients.Include(i => i.Users).Where(a => request.Ids.Any(b => b == a.Id)).ToListAsync();

                if (ingredients == null) return null;

                var user = await _context.Users.Include(u => u.Ingredients).FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                bool dataChanged = false;
                foreach (var ingredient in ingredients)
                {
                    if (user.Ingredients == null || user.Ingredients?.FirstOrDefault(x => x.IngredientId == ingredient.Id) == null)
                    {
                        var newIngredient = new UserIngredient
                        {
                            AppUser = user,
                            Ingredient = ingredient,
                        };
                        user.Ingredients.Add(newIngredient);
                        dataChanged = true;
                    }
                }
                foreach (var existingIngredient in user.Ingredients.ToList())
                {
                    if (!ingredients.Any(x => x.Id == existingIngredient.IngredientId))
                    {
                        user.Ingredients.Remove(existingIngredient);
                        dataChanged = true;
                    }
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("failed to update inventory" + (dataChanged ? "" : " (No changes were found)"));
            }
        }
    }
}