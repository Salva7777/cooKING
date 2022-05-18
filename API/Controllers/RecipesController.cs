using Application.Core;
using Application.Recipes;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetRecipes([FromQuery] RecipeParams param)
        {
            return HandleResult(await Mediator.Send(new List.Query { Params = param }));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe(Recipe recipe)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Recipe = recipe }));
        }

        [Authorize(Policy = "IsRecipeOwner")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditRecipe(Guid id, Recipe recipe)
        {
            recipe.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Recipe = recipe }));
        }

        [Authorize(Policy = "IsRecipeOwner")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [AllowAnonymous]
        [HttpPost("{id}/like")]
        public async Task<IActionResult> Like(Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateCookers.Command { Id = id }));
        }
    }
}