using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
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
        public class Query : IRequest<Result<List<RecipeDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<RecipeDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<RecipeDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var recipes = await _context.Recipes
                .ProjectTo<RecipeDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                return Result<List<RecipeDto>>.Success(recipes);
            }
        }
    }
}