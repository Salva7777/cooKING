using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        public readonly IMediator _mediator;
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.RecipeId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public async Task DeleteComment(int id)
        {
            var comment = await _mediator.Send(new Delete.Command { Id = id });
            //manda info para a client app
            await Clients.Group("5d789102-4901-460a-a878-7dee3432ee6b")
            .SendAsync("RemoveComment", id);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var recipeId = httpContext.Request.Query["recipeId"];
            await Groups.AddToGroupAsync(Context.ConnectionId, recipeId);
            var result = await _mediator.Send(new List.Query { RecipeId = Guid.Parse(recipeId) });
            await Clients.Caller.SendAsync("LoadComments", result.Value);

        }


    }
}