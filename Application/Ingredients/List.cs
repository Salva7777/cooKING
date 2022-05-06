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
        public class Query : IRequest<Result<List<BasicIngredientDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<BasicIngredientDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<BasicIngredientDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var ingredients = await _context.Ingredients
                .ProjectTo<BasicIngredientDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                return Result<List<BasicIngredientDto>>.Success(ingredients);
            }
        }
    }
}