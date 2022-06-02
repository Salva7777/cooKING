export interface Ingredient {
    id: string;
    name: string;
    veggie?: boolean;
    lactoseFree?: boolean;
    glutenFree?: boolean;
    createdAt?: Date;
    creatorId?: string;
    quantity?: number;
    measure?: string;
    ingredientId: string;
    isUserInventory?: boolean;
    ownerUsername?: string;
}

export class Ingredient implements Ingredient {
    constructor(init?: IngredientFormValues) {
        Object.assign(this, init);
    }
}

export class IngredientFormValues {
    id?: string = undefined;
    name: string = '';
    veggie?: boolean | undefined = false;
    lactoseFree?: boolean | undefined = false;
    glutenFree?: boolean | undefined = false;
    constructor(ingredient?: IngredientFormValues) {
        if (ingredient) {
            this.id = ingredient.id;
            this.name = ingredient.name;
            this.veggie = ingredient.veggie;
            this.lactoseFree = ingredient.lactoseFree;
            this.glutenFree = ingredient.glutenFree;
        }
    }
}