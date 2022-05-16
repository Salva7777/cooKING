import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import IngredientStore from "./ingredientStore";
import ModalStore from "./modalStore";
import RecipeStore from "./recipeStore";
import UserStore from "./userStore";

interface Store {
    recipeStore: RecipeStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    ingredientStore: IngredientStore;
}

export const store: Store = {
    recipeStore: new RecipeStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    ingredientStore: new IngredientStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}