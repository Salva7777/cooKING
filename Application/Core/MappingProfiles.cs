using System;
using System.Linq;
using Application.Comments;
using Application.Durations;
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
            string currentUsername = null;
            CreateMap<Recipe, Recipe>();
            CreateMap<Recipe, RecipeDto>()
            .ForMember(d => d.OwnerUsername, o => o.MapFrom(s => s.Cookers.FirstOrDefault(x => x.IsOwner).AppUser.UserName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.Duration, o => o.MapFrom(s => s.Duration));
            CreateMap<RecipeCooker, CookerDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Ingredient, Ingredient>()
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.AppUserId, o => o.Ignore());
            CreateMap<Ingredient, Ingredient>()
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.AppUserId, o => o.Ignore());
            CreateMap<RecipeIngredient, RecipeIngredientDto>()
            .ForMember(d => d.Name, o => o.MapFrom(s => s.Ingredient.Name))
            .ForMember(d => d.Id, o => o.MapFrom(s => s.Ingredient.Id))
            .ForMember(d => d.Veggie, o => o.MapFrom(s => s.Ingredient.Veggie))
            .ForMember(d => d.GlutenFree, o => o.MapFrom(s => s.Ingredient.GlutenFree))
            .ForMember(d => d.LactoseFree, o => o.MapFrom(s => s.Ingredient.LactoseFree));
            CreateMap<Ingredient, IngredientDto>()
            .ForMember(d => d.CreatorId, o => o.MapFrom(s => s.AppUser.Id))
            .ForMember(d => d.OwnerUsername, o => o.MapFrom(s => s.AppUser.UserName));
            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.RecipesCount, o => o.MapFrom(s => s.Recipes.Where(x => x.IsOwner).Count()))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<TimeSpan, DurationDto>()
            .ForMember(d => d.Ticks, o => o.MapFrom(s => s.Ticks))
            .ForMember(d => d.Days, o => o.MapFrom(s => s.Days))
            .ForMember(d => d.Hours, o => o.MapFrom(s => s.Hours))
            .ForMember(d => d.Minutes, o => o.MapFrom(s => s.Minutes))
            .ForMember(d => d.Seconds, o => o.MapFrom(s => s.Seconds))
            .ForMember(d => d.Milliseconds, o => o.MapFrom(s => s.Milliseconds))
            .ForMember(d => d.TotalDays, o => o.MapFrom(s => s.TotalDays))
            .ForMember(d => d.TotalHours, o => o.MapFrom(s => s.TotalHours))
            .ForMember(d => d.TotalMinutes, o => o.MapFrom(s => s.TotalMinutes))
            .ForMember(d => d.TotalSeconds, o => o.MapFrom(s => s.TotalSeconds))
            .ForMember(d => d.TotalMilliseconds, o => o.MapFrom(s => s.TotalMilliseconds));
            CreateMap<PreparationStep, PreparationStepDto>();
            CreateMap<Comment, CommentDto>()
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
            .ForMember(d => d.Username, O => O.MapFrom(S => S.Author.UserName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}