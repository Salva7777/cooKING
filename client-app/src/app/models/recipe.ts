//json to ts
//duration porque nao existe nenhum datatype para Timespan

import { Ingredient } from "./ingredient";
import { Photo, Profile } from "./profile";

export interface Duration {
    ticks: number | undefined;
    days: number | undefined;
    hours: number | undefined;
    milliseconds: number | undefined;
    minutes: number | undefined;
    seconds: number | undefined;
    totalDays: number | undefined;
    totalHours: number | undefined;
    totalMilliseconds: number | undefined;
    totalMinutes: number | undefined;
    totalSeconds: number | undefined;
}

export interface Recipe {
    id: string;
    title: string;
    difficulty: string;
    description: string;
    duration: Duration | any | null;
    createdAt: Date | null;
    ownerUsername?: string;
    owner?: Profile;
    isOwner: boolean;
    image?: string;
    liked: boolean;
    photos?: Photo[];
    cookers: Profile[];
    ingredients: Ingredient[];
}

export class Recipe implements Recipe {
    constructor(init?: RecipeFormValues) {
        Object.assign(this, init);
    }
}

export class RecipeFormValues {
    id?: string = undefined;
    title: string = '';
    difficulty: string = '';
    description: string = '';
    duration: Duration | any = [];
    ingredients: Ingredient[] = [];
    constructor(recipe?: RecipeFormValues) {
        if (recipe) {
            this.id = recipe.id;
            this.title = recipe.title;
            this.difficulty = recipe.difficulty;
            this.description = recipe.description;
            this.ingredients = recipe.ingredients;
            this.duration[0] = recipe.duration[1];
            this.duration[1] = recipe.duration[2];
            this.duration[2] = recipe.duration[3];
        }
    }
}
