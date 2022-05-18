using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class List
    {
        public class Query : IRequest<Result<List<RecipeDto>>>
        {
            public RecipeParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<RecipeDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<RecipeDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Ingredients).FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var recipes = _context.Recipes.Include(r => r.Cookers).Include(r => r.Ingredients)
                .ThenInclude(i => i.Ingredient)
                .OrderBy(d => d.CreatedAt)
                .ProjectTo<RecipeDto>(_mapper.ConfigurationProvider,
                new { currentUsername = _userAccessor })
                .AsEnumerable();

                if (user == null)
                    return recipes != null ? Result<List<RecipeDto>>.Success(recipes.ToList()) : null;

                if (request.Params.HasIngredients)
                {
                    recipes = recipes
                    .Where(r => r.Ingredients.Select(ri => ri.Id)
                    .All(riid => user.Ingredients.Select(ui => ui.IngredientId).Any(uiid => uiid == riid)));
                }

                if (request.Params.Liked)
                {
                    recipes = recipes
                    .Where(r => r.Cookers.Any(rc => rc.Username == user.UserName));
                }

                if (request.Params.IsOwner)
                {
                    recipes = recipes
                    .Where(r => r.OwnerUsername == user.UserName);
                }

                switch (request.Params.Difficulty)
                {
                    case "easy":
                        recipes = recipes
                    .Where(r => r.Difficulty == "Easy");
                        break;
                    case "medium":
                        recipes = recipes
                        .Where(r => r.Difficulty == "Medium");
                        break;
                    case "hard":
                        recipes = recipes
                        .Where(r => r.Difficulty == "Hard");
                        break;
                    default:
                        break;
                }

                if (request.Params.SelectedIngredients?.Count > 0)
                {
                    recipes = recipes
                    .Where(r => request.Params.SelectedIngredients.All(si => r.Ingredients.Any(ri => ri.Id == si)));
                }

                if (request.Params.Duration != 0)
                {
                    recipes = recipes
                        .Where(r => r.Duration.TotalMinutes < request.Params.Duration);
                }


                return recipes != null ? Result<List<RecipeDto>>.Success(recipes.ToList()) : null;
            }
        }
    }
}