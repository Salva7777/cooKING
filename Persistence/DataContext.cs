using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeCooker> RecipeCookers { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }

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



        // builder.Entity<AppUserRole>(x => x.HasKey(aa => new { aa.AppUserId, aa.RoleId }));

        // builder.Entity<AppUserRole>()
        // .HasOne(u => u.Role)
        // .WithMany(a => a.Users)
        // .HasForeignKey(aa => aa.RoleId);

        // builder.Entity<AppUserRole>()
        // .HasOne(u => u.AppUser)
        // .WithMany(a => a.Roles)
        // .HasForeignKey(aa => aa.AppUserId);
    }
}
}
