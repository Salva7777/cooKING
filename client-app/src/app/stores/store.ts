import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import RecipeStore from "./recipeStore";
import UserStore from "./userStore";

interface Store {
    recipeStore: RecipeStore;
    userStore: UserStore;
    commonStore: CommonStore;
}

export const store: Store = {
    recipeStore: new RecipeStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}