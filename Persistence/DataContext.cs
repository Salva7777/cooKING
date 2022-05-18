using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, string, IdentityUserClaim<string>,
AppUserRole, IdentityUserLogin<string>,
IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeCooker> RecipeCookers { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<UserIngredient> UserIngredients { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<RecipeCooker>(x => x.HasKey(aa => new { aa.AppUserId, aa.RecipeId }));

            builder.Entity<RecipeCooker>()
            .HasOne(u => u.Recipe)
            .WithMany(a => a.Cookers)
            .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<RecipeCooker>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Recipes)
            .HasForeignKey(aa => aa.AppUserId);


            builder.Entity<RecipeIngredient>(x => x.HasKey(aa => new { aa.IngredientId, aa.RecipeId }));

            builder.Entity<RecipeIngredient>()
            .HasOne(u => u.Recipe)
            .WithMany(a => a.Ingredients)
            .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<RecipeIngredient>()
            .HasOne(u => u.Ingredient)
            .WithMany(a => a.Recipes)
            .HasForeignKey(aa => aa.IngredientId);


            builder.Entity<AppUserRole>(userRole => userRole.HasKey(ur => new { ur.UserId, ur.RoleId }));

            builder.Entity<AppUserRole>()
            .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            builder.Entity<AppUserRole>()
            .HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            builder.Entity<UserIngredient>(UserIngredient => UserIngredient.HasKey(ui => new { ui.AppUserId, ui.IngredientId }));

            builder.Entity<UserIngredient>()
            .HasOne(u => u.AppUser)
            .WithMany(i => i.Ingredients)
            .HasForeignKey(ui => ui.AppUserId);

            builder.Entity<UserIngredient>()
            .HasOne(i => i.Ingredient)
            .WithMany(u => u.Users)
            .HasForeignKey(ui => ui.IngredientId);
        }
    }
}
