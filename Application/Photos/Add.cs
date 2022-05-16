using System;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
            public Guid? Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataContext _context;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) return null;
                Recipe recipe = null;
                if (request.Id != null)
                {
                    recipe = await _context.Recipes.Include(p => p.Photos).Include(p => p.Cookers)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                    if (recipe == null) return null;
                    if (!recipe.Cookers.Any(x => x.IsOwner && x.AppUserId == user.Id)) return Result<Photo>.Failure("User is not owner of the recipe");
                }

                var PhotoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = PhotoUploadResult.Url,
                    Id = PhotoUploadResult.PublicId
                };


                if (request.Id == null)
                {
                    if (!user.Photos.Any(x => x.IsMain)) photo.IsMain = true;
                    user.Photos.Add(photo);
                }
                else
                {
                    if (!recipe.Photos.Any(x => x.IsMain)) photo.IsMain = true;
                    recipe.Photos.Add(photo);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}