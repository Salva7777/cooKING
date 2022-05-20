using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                var user = await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var recipe = await _context.Recipes.Include(p => p.Photos).FirstOrDefaultAsync(x => x.Photos.Any(y => y.Id == request.Id));
                if (user == null && recipe == null) return null;
                var photo = user?.Photos.FirstOrDefault(x => x.Id == request.Id) != null ?
                 user?.Photos.FirstOrDefault(x => x.Id == request.Id) :
                  recipe?.Photos.FirstOrDefault(x => x.Id == request.Id) != null ?
                   recipe?.Photos.FirstOrDefault(x => x.Id == request.Id) : null;

                if (photo == null) return null;
                var currentMain = recipe == null ? user.Photos.FirstOrDefault(x => x.IsMain) : recipe.Photos.FirstOrDefault(x => x.IsMain);

                if (currentMain != null) currentMain.IsMain = false;

                photo.IsMain = true;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}