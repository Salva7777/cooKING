import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Recipe, RecipeFormValues } from "../models/recipe";
import { v4 as uuid } from 'uuid';
import { store } from "./store";
import { Photo, Profile } from "../models/profile";
import { array } from "yup";
import { Pagination, PagingParams } from "../models/pagination";

export default class RecipeStore {
    recipeRegistry = new Map<string, Recipe>();
    selectedRecipe: Recipe | undefined = undefined;
    loading = false;
    uploading = false;
    loadingInitial = false;
    predicate = new Map().set('HasIngredients', true);
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    refreshPredicate = false;

    constructor() {
        makeAutoObservable(this)
        reaction(
            () => this.refreshPredicate,
            () => {
                this.recipeRegistry.clear();
                this.loadRecipes();
            }
        )
    }

    get recipesByDate() {
        return Array.from(this.recipeRegistry.values()).sort((a, b) =>
            a.createdAt!.getTime() - b.createdAt!.getTime());
    }

    private getRecipe = (id: string) => {
        return this.recipeRegistry.get(id);
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'SelectedIngredients' || key === 'Cautions') {
                value.map((s: any) => [params.append(key, s)])
            } else {
                params.append(key, value);
            }
        })
        params.getAll('SelectedIngredient')
        return params;
    }

    setPredicate = (predicate: string, value?: any) => {
        this.pagingParams.pageNumber = 1;
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'HasIngredients') this.predicate.delete(key);
                else this.predicate.set(key, true)
            })
        }
        switch (predicate) {
            case 'Reset':
                resetPredicate()
                break;
            case 'Difficulty':
                if (this.predicate.get('Difficulty') === value)
                    this.predicate.set('Difficulty', null)
                else
                    switch (value) {
                        case 'Easy':
                            this.predicate.set('Difficulty', 'Easy');
                            break;
                        case 'Medium':
                            this.predicate.set('Difficulty', 'Medium');
                            break;
                        case 'Hard':
                            this.predicate.set('Difficulty', 'Hard');
                            break;
                    }
                break;
            case 'SelectedIngredients':
                this.predicate.get('SelectedIngredients') ? this.predicate = this.predicate : this.predicate.set('SelectedIngredients', []);
                if (this.predicate.get('SelectedIngredients').some((a: string) => a === value)) {
                    let ingredientsHelper = this.predicate.get('SelectedIngredients');
                    ingredientsHelper = ingredientsHelper.filter((name: string) => name !== value);
                    this.predicate.set('SelectedIngredients', ingredientsHelper)
                }
                else {
                    let ingredientsHelper = this.predicate.get('SelectedIngredients');
                    ingredientsHelper.push(value)
                    this.predicate.set('SelectedIngredients', ingredientsHelper)
                }
                break;
            case 'Cautions':
                this.predicate.get('Cautions') ? this.predicate = this.predicate : this.predicate.set('Cautions', []);
                if (this.predicate.get('Cautions').some((a: string) => a === value)) {
                    let cautionssHelper = this.predicate.get('Cautions');
                    cautionssHelper = cautionssHelper.filter((name: string) => name !== value);
                    this.predicate.set('Cautions', cautionssHelper)
                }
                else {
                    let cautionssHelper = this.predicate.get('Cautions');
                    cautionssHelper.push(value)
                    this.predicate.set('Cautions', cautionssHelper)
                }
                break;
            case 'Duration':
                this.predicate.set('Duration', Number(value))
                break;
            case 'HasIngredients':
                this.predicate.set('HasIngredients', !this.predicate.get('HasIngredients'));
                break;
        }
        this.refreshPredicate = !this.refreshPredicate;
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    loadRecipes = async () => {
        this.setLoadingInitial(true);
        try {
            await this.axiosParams;
            const result = await agent.Recipes.list(this.axiosParams);
            console.log(this.axiosParams.toString());
            result.data.forEach(recipe => {
                this.setRecipe(recipe)
            })
            this.setPagination(result.pagination);
            console.log(result.pagination)
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadRecipe = async (id: string) => {
        console.log(id);
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
        //porque o MAP.set nao aguenta com keys transforma-se o objeto em array
        recipe.duration = Object.values(recipe.duration);
        const user = store.userStore.user;
        if (user) {
            recipe.liked = recipe.cookers!.some(
                a => a.username === user.username
            )
            recipe.isOwner = recipe.ownerUsername === user.username;
            recipe.ingredients.forEach(ingredient => {
                ingredient.isUserInventory = user.ingredients?.some(
                    a => a.id === ingredient.id
                )
            })
        }
        recipe.createdAt = new Date(recipe.createdAt!);
        recipe.isVeggie = !recipe.ingredients!.some(
            r => r.veggie === false
        )
        recipe.isGlutenFree = !recipe.ingredients!.some(
            r => r.glutenFree === false
        )
        recipe.isLactoseFree = !recipe.ingredients!.some(
            r => r.lactoseFree === false
        )
        recipe.owner = recipe.cookers?.find(x => x.username === recipe.ownerUsername);
        this.recipeRegistry.set(recipe.id, recipe);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createRecipe = async (recipe: RecipeFormValues) => {
        const user = store.userStore.user;
        const cooker = new Profile(user!);
        try {
            await agent.Recipes.post(recipe);
            const newRecipe = new Recipe(recipe);
            newRecipe.ownerUsername = user!.username;
            newRecipe.cookers = [cooker];
            this.setRecipe(newRecipe);
            runInAction(() => {
                this.selectedRecipe = newRecipe;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateRecipe = async (recipe: RecipeFormValues) => {
        this.loading = true;
        try {
            await agent.Recipes.put(recipe);
            if (recipe.id) {
                var updatedRecipeFromApi = await agent.Recipes.details(recipe.id);
                updatedRecipeFromApi.duration = Object.values(updatedRecipeFromApi.duration);
                let updateRecipe = { ...this.getRecipe(recipe.id), ...updatedRecipeFromApi }
                this.recipeRegistry.set(recipe.id, updateRecipe as Recipe);
                this.selectedRecipe = updateRecipe as Recipe;
                this.loading = false
            }
        } catch (error) {
            console.log(error);
        }
    }

    likeRecipe = async (id?: string) => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            if (!this.selectedRecipe) this.selectedRecipe = this.getRecipe(id!);
            await agent.Recipes.like(this.selectedRecipe!.id);

            runInAction(() => {
                if (this.selectedRecipe?.liked) {
                    this.selectedRecipe.cookers = this.selectedRecipe.cookers?.filter(a => a.username !== user?.username);
                    this.selectedRecipe.liked = false;
                } else {
                    const cooker = new Profile(user!);
                    this.selectedRecipe?.cookers?.push(cooker);
                    this.selectedRecipe!.liked = true;
                }
                this.recipeRegistry.set(this.selectedRecipe!.id, this.selectedRecipe!)
            })
            if (id)
                this.clearSelectedRecipe();
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    updateCookerFollowing = (username: string) => {
        this.recipeRegistry.forEach(recipe => {
            recipe.cookers.forEach(cooker => {
                if (cooker.username === username) {
                    cooker.following ? cooker.followersCount-- : cooker.followersCount++;
                    cooker.following = !cooker.following
                }
            })
        })
    }


    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            let response = await agent.Recipes.uploadPhoto(this.selectedRecipe?.id!, file);
            const photo = response.data;
            runInAction(() => {
                if (this.selectedRecipe) {
                    this.selectedRecipe.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.selectedRecipe.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => this.uploading = false);
        }
    }

    setImage = async (url: string) => {
        if (this.selectedRecipe)
            this.selectedRecipe.image = url;
    }


    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Recipes.setMainPhoto(photo.id);
            this.setImage(photo.url);
            runInAction(() => {
                if (this.selectedRecipe && this.selectedRecipe.photos) {
                    this.selectedRecipe.photos.find(p => p.isMain)!.isMain = false;
                    this.selectedRecipe.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.selectedRecipe.image = photo.url;
                    this.loading = false;
                }
            })

        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Recipes.deletePhoto(photo.id)
            runInAction(() => {
                if (this.selectedRecipe) {
                    this.selectedRecipe.photos = this.selectedRecipe.photos?.filter(p => p.id !== photo.id);
                    this.loading = false;

                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }


    clearSelectedRecipe = () => {
        this.selectedRecipe = undefined;
    }

}