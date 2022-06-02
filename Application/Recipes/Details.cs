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
using Application.Interfaces;

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
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<RecipeDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes
                                .ProjectTo<RecipeDto>(_mapper.ConfigurationProvider, new { currentUsername = _userAccessor.GetUsername() })
                                .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<RecipeDto>.Success(recipe);
            }
        }
    }
}