import { makeAutoObservable, runInAction } from "mobx";
import { arrayBuffer } from "stream/consumers";
import agent from "../api/agent";
import { Recipe } from "../models/recipe";
import { v4 as uuid } from 'uuid';

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
    recipes: Recipe[] = [];
    selectedRecipe: Recipe | undefined = undefined;
    loading = false;
    loadingInitial = true;

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
            runInAction(() => {
                recipes.forEach(recipe => {
                    this.loadingInitial = false;
                    this.recipeRegistry.set(recipe.id, recipe)
                })
                this.setLoadingInitial(false);
            }
            )
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
        this.recipeRegistry.set(recipe.id, recipe);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createRecipe = async (recipe: Recipe) => {
        this.loading = true;
        recipe.id = uuid();
        try {
            await agent.Recipes.post(recipe);
            runInAction(() => {
                this.recipeRegistry.set(recipe.id, recipe);
                this.selectedRecipe = recipe;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateRecipe = async (recipe: Recipe) => {
        this.loading = true;
        try {
            await agent.Recipes.put(recipe);
            runInAction(() => {
                this.recipeRegistry.set(recipe.id, recipe);
                this.selectedRecipe = recipe;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }


}