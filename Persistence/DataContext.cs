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
        public DbSet<PreparationStep> PreparationSteps { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeCooker> RecipeCookers { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<UserIngredient> UserIngredients { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }
        public DbSet<Comment> Comments { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Recipe>()
            .HasMany(r => r.Cookers)
            .WithOne(c => c.Recipe)
            .HasForeignKey(c => c.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<RecipeCooker>(x => x.HasKey(aa => new { aa.AppUserId, aa.RecipeId }));

            builder.Entity<RecipeCooker>()
            .HasOne(u => u.Recipe)
            .WithMany(a => a.Cookers)
            .HasForeignKey(aa => aa.RecipeId)
            .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<RecipeCooker>()
            .HasOne(u => u.AppUser)
            .WithMany(a => a.Recipes)
            .HasForeignKey(aa => aa.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);


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

            builder.Entity<PreparationStep>(x => x.HasKey(aa => new { aa.StepNo, aa.RecipeId }));

            builder.Entity<UserFollowing>(x => x.HasKey(uf => new { uf.OserverId, uf.TargetId }));

            builder.Entity<UserFollowing>()
            .HasOne(o => o.Observer)
            .WithMany(f => f.Followings)
            .HasForeignKey(o => o.OserverId);

            builder.Entity<UserFollowing>()
            .HasOne(t => t.Target)
            .WithMany(f => f.Followers)
            .HasForeignKey(t => t.TargetId);

            builder.Entity<Comment>()
            .HasOne(a => a.Recipe)
            .WithMany(c => c.Comments)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
