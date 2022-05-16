import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Ingredient } from "../models/ingredient";
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
        return Array.from(this.ingredientRegistry.values());
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

    private setIngredient = (ingredient: Ingredient) => {
        this.ingredientRegistry.set(ingredient.id, ingredient);
    }
}