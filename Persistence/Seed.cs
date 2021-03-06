using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        //SEED DATA INTO TABLE
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            List<AppUser> users;
            if (!userManager.Users.Any())
            {
                users = new List<AppUser>
                {
                    new AppUser{
                        DisplayName="Salvador",
                        UserName="salvador",
                        Email="salvador@test.com"
                    }
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }
            else
            {
                users = userManager.Users.ToList();
            }
            List<Ingredient> ingredients;
            if (!context.Ingredients.Any())
            {
                ingredients = new List<Ingredient>
                {
                    new Ingredient{
                        AppUser = users[0],
                        Name = "Limão",
                    },
                    new Ingredient{
                        AppUser = users[0],
                        Name = "Salsa",
                    },
                    new Ingredient{
                        AppUser = users[0],
                        Name = "Sal",
                    }
                };
                await context.Ingredients.AddRangeAsync(ingredients);
                await context.SaveChangesAsync();
            }
            else
            {
                ingredients = context.Ingredients.ToList();
            }

            //SE A TABELA JA TIVER DADOS
            if (context.Recipes.Any()) return; // NADA
            //LISTA DE OBJETOS
            var recipes = new List<Recipe>
            {
                new Recipe{
                    Title = "Ramen",
                    Difficulty = "Medium",
                    Duration = new TimeSpan(0, 30, 0),
                    CreatedAt = DateTime.Now,
                    Cookers = new List<RecipeCooker>{
                        new RecipeCooker{
                            AppUser = users[0],
                            IsOwner = true
                        }
                    },
                    Ingredients = new List<RecipeIngredient>{
                        new RecipeIngredient{
                            Ingredient = ingredients[0],
                            Quantity = 0.240,
                            Measure = "Kg"
                        }
                    }
                },
                new Recipe{
                    Title = "Burger",
                    Difficulty = "Easy",
                    Duration = new TimeSpan(0, 15, 0),
                    CreatedAt = DateTime.Now.AddMonths(-1),
                    Cookers = new List<RecipeCooker>{
                        new RecipeCooker{
                            AppUser = users[0],
                            IsOwner = true
                        }
                    }
                },
            };

            //Adiciona a lista à tabela
            await context.Recipes.AddRangeAsync(recipes);
            //guarda os dados na db
            await context.SaveChangesAsync();
        }

        public static Task SeedData()
        {
            throw new NotImplementedException();
        }
    }
}