import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Recipe, RecipeFormValues } from "../models/recipe";
import { v4 as uuid } from 'uuid';
import { store } from "./store";
import { Profile } from "../models/profile";
import { array } from "yup";

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
    selectedRecipe: Recipe | undefined = undefined;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get recipesById() {
        return Array.from(this.recipeRegistry.values());
    }

    private getRecipe = (id: string) => {
        return this.recipeRegistry.get(id);
    }

    loadRecipes = async () => {
        this.setLoadingInitial(true);
        try {
            const recipes = await agent.Recipes.list();
            recipes.forEach(recipe => {
                this.setRecipe(recipe)
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadRecipe = async (id: string) => {
        let recipe = this.getRecipe(id);
        if (recipe) {
            this.selectedRecipe = recipe;
            return recipe;
        } else {
            this.loadingInitial = true
            try {
                recipe = await agent.Recipes.details(id);
                this.setRecipe(recipe);
                runInAction(() => {
                    this.selectedRecipe = recipe;
                })
                this.setLoadingInitial(false);
                return recipe;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setRecipe = (recipe: Recipe) => {
        //porque o MAP.set nao aguenta com keys transforma-se o objeto em array
        recipe.duration = Object.values(recipe.duration);
        const user = store.userStore.user;
        if (user) {
            recipe.liked = recipe.cookers!.some(
                a => a.username === user.username
            )
            recipe.isOwner = recipe.ownerUsername === user.username;
        }
        recipe.owner = recipe.cookers?.find(x => x.username === recipe.ownerUsername);
        this.recipeRegistry.set(recipe.id, recipe);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createRecipe = async (recipe: RecipeFormValues) => {
        const user = store.userStore.user;
        const cooker = new Profile(user!);
        try {
            await agent.Recipes.post(recipe);
            const newRecipe = new Recipe(recipe);
            newRecipe.ownerUsername = user!.username;
            newRecipe.cookers = [cooker];
            this.setRecipe(newRecipe);
            runInAction(() => {
                this.selectedRecipe = newRecipe;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateRecipe = async (recipe: RecipeFormValues) => {
        this.loading = true;
        try {
            console.log(recipe);
            await agent.Recipes.put(recipe);
            if (recipe.id) {
                var updatedRecipeFromApi = await agent.Recipes.details(recipe.id);
                updatedRecipeFromApi.duration = Object.values(updatedRecipeFromApi.duration);
                console.log(updatedRecipeFromApi);
                let updateRecipe = { ...this.getRecipe(recipe.id), ...updatedRecipeFromApi }
                this.recipeRegistry.set(recipe.id, updateRecipe as Recipe);
                this.selectedRecipe = updateRecipe as Recipe;
                console.log(this.getRecipe(recipe.id));
                this.loading = false
            }
        } catch (error) {
            console.log(error);
        }
    }

    likeRecipe = async (id?: string) => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            if (!this.selectedRecipe) this.selectedRecipe = this.getRecipe(id!);
            await agent.Recipes.like(this.selectedRecipe!.id);

            runInAction(() => {
                if (this.selectedRecipe?.liked) {
                    this.selectedRecipe.cookers = this.selectedRecipe.cookers?.filter(a => a.username !== user?.username);
                    this.selectedRecipe.liked = false;
                } else {
                    const cooker = new Profile(user!);
                    this.selectedRecipe?.cookers?.push(cooker);
                    this.selectedRecipe!.liked = true;
                }
                this.recipeRegistry.set(this.selectedRecipe!.id, this.selectedRecipe!)
            })
            if (id)
                this.clearSelectedRecipe();
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedRecipe = () => {
        this.selectedRecipe = undefined;
    }

}