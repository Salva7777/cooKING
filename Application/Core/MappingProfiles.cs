using System;
using System.Linq;
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
            CreateMap<Recipe, Recipe>();
            CreateMap<Recipe, RecipeDto>()
            .ForMember(d => d.OwnerUsername, o => o.MapFrom(s => s.Cookers.FirstOrDefault(x => x.IsOwner).AppUser.UserName))
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.Duration, o => o.MapFrom(s => s.Duration));
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
            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<TimeSpan,DurationDto>()
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
        }
    }
}