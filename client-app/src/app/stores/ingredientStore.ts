import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Ingredient, IngredientFormValues } from "../models/ingredient";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class IngredientStore {
    ingredientRegistry = new Map<string, Ingredient>();
    selectedIngredient: Ingredient | undefined = undefined;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    get ingredientsById() {
        return Array.from(this.ingredientRegistry.values()).sort((a, b) =>
            a.name > b.name ? 1 : a.name == b.name ? 0 : -1
        );
    }

    private getIngredient = (id: string) => {
        return this.ingredientRegistry.get(id);
    }


    loadIngredients = async () => {
        this.setLoadingInitial(true);
        try {
            const ingredients = await agent.Ingredients.list();
            ingredients.forEach(ingredient => {
                this.setIngredient(ingredient)
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadIngredient = async (id: string) => {
        let ingredient = this.getIngredient(id);
        if (ingredient) {
            this.selectedIngredient = ingredient;
            return ingredient;
        } else {
            this.loadingInitial = true
            try {
                ingredient = await agent.Ingredients.details(id);
                this.setIngredient(ingredient);
                runInAction(() => {
                    this.selectedIngredient = ingredient;
                })
                this.setLoadingInitial(false)
                return ingredient;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    createIngredient = async (ingredient: IngredientFormValues) => {
        const user = store.userStore.user;
        const creator = new Profile(user!)
        try {
            await agent.Ingredients.post(ingredient);
            const newIngredient = new Ingredient(ingredient);
            // newIngredient.creatorId = user!.;
            this.setIngredient(newIngredient);
            runInAction(() => {
                this.selectedIngredient = newIngredient;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateIngredient = async (ingredient: IngredientFormValues) => {
        this.loading = true;
        try {
            await agent.Ingredients.put(ingredient);
            if (ingredient.id) {
                this.ingredientRegistry.set(ingredient.id, ingredient as Ingredient);
                this.selectedIngredient = ingredient as Ingredient;
                this.loading = false
            }
        } catch (error) {
            console.log(error);
        }
    }

    private setIngredient = (ingredient: Ingredient) => {
        this.ingredientRegistry.set(ingredient.id, ingredient);
    }

    clearSelectedIngredient = () => {
        this.selectedIngredient = undefined;
    }
}