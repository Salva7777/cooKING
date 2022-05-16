using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost("{id?}")]
        public async Task<IActionResult> Add([FromForm] IFormFile file, Guid ?id)
        {
            return HandleResult(await Mediator.Send(new Add.Command { File = file, Id = id }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}