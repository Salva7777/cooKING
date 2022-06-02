using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Ingredients
{
    public class List
    {
        public class Query : IRequest<Result<List<IngredientDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<IngredientDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<IngredientDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var ingredients = await _context.Ingredients.Include(i => i.AppUser)
                .ProjectTo<IngredientDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                return Result<List<IngredientDto>>.Success(ingredients);
            }
        }
    }
}