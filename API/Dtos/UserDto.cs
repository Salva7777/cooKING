using Application.Ingredients;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace API.Dtos
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string Image { get; set; }
        public ICollection<IdentityRole> Roles { get; set; }
        public ICollection<IngredientDto> Ingredients { get; set; }
    }
}