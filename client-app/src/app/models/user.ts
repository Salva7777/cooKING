import { Ingredient } from "./ingredient";

export interface User {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    roles: Role[];
    ingredients: Ingredient[];
}
export interface UserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}

export interface Role {
    id: string;
    name: string;
    normalizedName: string;
    concurrencyStamp: string;
}