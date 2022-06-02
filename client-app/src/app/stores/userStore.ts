import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { history } from "../..";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";
import { Console } from "console";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }
    get isAdmin() {
        return !!this.user?.roles.some(a => a.name === 'Admin');
    }

    login = async (creds: UserFormValues) => {
        try {
            store.recipeStore.recipeRegistry.clear();
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        store.recipeStore.recipeRegistry.clear();
        this.user = null;
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    setImage = (url: string) => {
        if (this.user) {
            this.user.image = url;
        }
    }
    setDisplayName = (name: string) => {
        if (this.user)
            this.user.displayName = name;
    }
}