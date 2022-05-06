using System.Linq;
using Application.Recipes;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Recipe, Recipe>();
            CreateMap<Recipe, RecipeDto>()
            .ForMember(d => d.OwnerUsername, o => o.MapFrom(s => s.Cookers.FirstOrDefault(x => x.IsOwner).AppUser.UserName));
            CreateMap<RecipeCooker, Profiles.Profile>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
            CreateMap<RecipeIngredient, Ingredients.Ingredient>()
            .ForMember(d => d.Id, o => o.MapFrom(s => s.Ingredient.Id))
            .ForMember(d => d.Name, o => o.MapFrom(s => s.Ingredient.Name))
            .ForMember(d => d.Quantity, o => o.MapFrom(s => s.Quantity))
            .ForMember(d => d.Measure, o => o.MapFrom(s => s.Measure));
        }
    }
}