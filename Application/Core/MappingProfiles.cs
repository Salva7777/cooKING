using System.Linq;
using Application.Ingredients;
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
            CreateMap<Ingredient, Ingredient>()
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.AppUserId, o => o.Ignore());
            CreateMap<RecipeIngredient, IngredientDto>()
            .ForMember(d => d.Name, o => o.MapFrom(s => s.Ingredient.Name))
            .ForMember(d => d.Id, o => o.MapFrom(s => s.Ingredient.Id));
            CreateMap<Ingredient, BasicIngredientDto>()
            .ForMember(d => d.CreatorId, o => o.MapFrom(s => s.AppUser.Id));
        }
    }
}