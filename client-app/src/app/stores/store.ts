import { createContext, useContext } from "react";
import AdminStore from "./adminStore";
import CommentStore from "./commentStore";
import CommonStore from "./commonStore";
import IngredientStore from "./ingredientStore";
import ModalStore from "./modalStore";
import ProfileStore from "./ProfileStore";
import RecipeStore from "./recipeStore";
import UserStore from "./userStore";

interface Store {
    recipeStore: RecipeStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    ingredientStore: IngredientStore;
    profileStore: ProfileStore;
    commentStore: CommentStore;
    adminStore: AdminStore;
}

export const store: Store = {
    recipeStore: new RecipeStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    ingredientStore: new IngredientStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore(),
    adminStore: new AdminStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}