using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Ingredients
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Ingredient Ingredient { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Ingredient).SetValidator(new IngredientValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var ingredient = await _context.Ingredients.FindAsync(request.Ingredient.Id);

                if (ingredient == null) return null;
                
                _mapper.Map(request.Ingredient, ingredient);

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("failed to update ingredient");
            }
        }
    }
}