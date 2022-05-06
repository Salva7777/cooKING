using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;
using Persistence;

namespace Application.Recipes
{
    public class Details
    {
        public class Query : IRequest<Result<RecipeDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<RecipeDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<RecipeDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes
                                .ProjectTo<RecipeDto>(_mapper.ConfigurationProvider)
                                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<RecipeDto>.Success(recipe);
            }
        }
    }
}