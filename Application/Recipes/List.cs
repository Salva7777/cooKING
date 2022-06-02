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
        public class Query : IRequest<Result<PagedList<RecipeDto>>>
        {
            public RecipeParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<RecipeDto>>>
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

            public async Task<Result<PagedList<RecipeDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Ingredients).Include(u => u.Followings).ThenInclude(u => u.Target).FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                var recipes = _context.Recipes.Include(r => r.Cookers).ThenInclude(u => u.AppUser).ThenInclude(u => u.Photos).Include(r => r.Ingredients)
                .ThenInclude(i => i.Ingredient)
                .OrderBy(d => d.CreatedAt)
                .ProjectTo<RecipeDto>(_mapper.ConfigurationProvider,
                new { currentUsername = _userAccessor.GetUsername() })
                .AsQueryable().AsEnumerable();

                if (request.Params.HasIngredients && user != null)
                {
                    recipes = recipes
                    .Where(r => r.Ingredients.Select(ri => ri.Id)
                    .All(riid => user.Ingredients.Select(ui => ui.IngredientId).Any(uiid => uiid == riid)));
                }
                //liked recipes
                if (request.Params.Liked && user != null)
                {
                    recipes = recipes
                    .Where(r => r.Cookers.Any(rc => rc.Username == user.UserName));
                }
                //my recipes
                if (request.Params.IsOwner && user != null)
                {
                    recipes = recipes
                    .Where(r => r.OwnerUsername == user.UserName);
                }
                //following
                if (request.Params.isFollowingOwner && user != null)
                {
                    recipes = recipes
                    .Where(r => user.Followings.Any(uf => uf.Target.UserName == r.OwnerUsername));
                }

                switch (request.Params.Difficulty)
                {
                    case "Easy":
                        recipes = recipes
                    .Where(r => r.Difficulty == "Easy");
                        break;
                    case "Medium":
                        recipes = recipes
                        .Where(r => r.Difficulty == "Medium");
                        break;
                    case "Hard":
                        recipes = recipes
                        .Where(r => r.Difficulty == "Hard");
                        break;
                    default:
                        break;
                }

                if (request.Params.SelectedIngredients?.Count > 0)
                {
                    recipes = recipes
                    .Where(r => r.Ingredients.Any(ri => request.Params.SelectedIngredients.Any(si => si == ri.Id)));
                }

                if (request.Params.Duration != 0)
                {
                    recipes = recipes
                        .Where(r => r.Duration.TotalMinutes < request.Params.Duration);
                }

                if (request.Params.Cautions?.Count > 0)
                {
                    foreach (var Caution in request.Params.Cautions)
                        recipes = recipes
                        .Where(r => r.Ingredients.All(ri => (bool)ri.GetType().GetProperty(Caution).GetValue(ri, null)));
                }

                return Result<PagedList<RecipeDto>>.Success(
                    await PagedList<RecipeDto>.CreateAsync(recipes, request.Params.PageNumber,
                    request.Params.PageSize));
            }
        }
    }
}