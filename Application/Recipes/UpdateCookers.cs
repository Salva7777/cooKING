using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class UpdateCookers
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                if (user == null) return Result<Unit>.Failure("You must have an account to like a recipe");

                var recipe = await _context.Recipes
                .Include(a => a.Cookers)
                .ThenInclude(u => u.AppUser)
                .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (recipe == null) return Result<Unit>.Failure("Recipe not found");

                var ownerUsername = recipe.Cookers.FirstOrDefault(x => x.IsOwner)?.AppUser.UserName;
                if (ownerUsername == user.UserName) return Result<Unit>.Failure("You can't like your own recipe");

                var like = recipe.Cookers.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (like != null)
                    recipe.Cookers.Remove(like);

                if (like == null)
                {
                    var cooker = new RecipeCooker
                    {
                        AppUser = user,
                        Recipe = recipe,
                        IsOwner = false
                    };

                    recipe.Cookers.Add(cooker);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to like recipe");
            }
        }
    }
}