using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var comment = await _context.Comments.Include(c => c.Author).Include(c => c.Recipe).FirstOrDefaultAsync(c => c.Id == request.Id);
                var recipe = await _context.Recipes.Include(r => r.Cookers).ThenInclude(rc => rc.AppUser).FirstOrDefaultAsync(r => r.Id == comment.Recipe.Id);
                if (comment == null) return null;
                var user = _context.Users.FirstOrDefault(u => u.UserName == _userAccessor.GetUsername());
                if (user == null) return null;
                if (user.UserName != comment.Author?.Id && user.UserName != recipe.Cookers.FirstOrDefault(rc => rc.IsOwner).AppUser.UserName)
                    return null;
                _context.Comments.Remove(comment);
                var success = await _context.SaveChangesAsync() > 0;
                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to delete photo from api");

            }
        }
    }
}