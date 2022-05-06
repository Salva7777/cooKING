using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsOwnerRequirement : IAuthorizationRequirement
    {
    }
    public class IsOwnerRequirementHandler : AuthorizationHandler<IsOwnerRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsOwnerRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsOwnerRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var teste = context.User.FindAll(ClaimTypes.Role).Any(x => x.Value == "Admin");
            if (context.User.FindAll(ClaimTypes.Role).Any(x => x.Value == "Admin")) context.Succeed(requirement);

            if (userId == null) return Task.CompletedTask;

            var recipeId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
            .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var cooker = _dbContext.RecipeCookers
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.AppUserId == userId && x.RecipeId == recipeId)
            .Result;

            if (cooker == null) return Task.CompletedTask;

            if (cooker.IsOwner) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}