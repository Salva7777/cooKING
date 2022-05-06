using Application.Ingredients;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class IngredientsController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetIngredients()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Ingredient>> GetRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe(Ingredient ingredient)
        {
            return HandleResult(await Mediator.Send(new Create.Command { Ingredient = ingredient }));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditRecipe(Guid id, Ingredient ingredient)
        {
            ingredient.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command { Ingredient = ingredient }));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}