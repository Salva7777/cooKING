using Application.Profiles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [Authorize]
        [HttpPost("updateinventory")]
        public async Task<IActionResult> UpdateInventory(List<Guid> ids)
        {
            return HandleResult(await Mediator.Send(new UpdateInventory.Command { Ids = ids }));
        }
    }
}