import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify'
import { history } from '../..';
import { Ingredient, IngredientFormValues } from '../models/ingredient';
import { PaginatedResult } from '../models/pagination';
import { Photo, Profile } from '../models/profile';
import { Recipe, RecipeFormValues } from '../models/recipe';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors?.hasOwnProperty('id')) {
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorised');
            break;
        case 404:
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            toast.error("server error")
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get(url).then<T>(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Recipes = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Recipe[]>>('/recipes', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Recipe>(`/recipes/${id}`),
    put: (recipe: RecipeFormValues) => requests.put<void>(`/recipes/${recipe.id}`, recipe).then(() => console.log("saodcsa")),
    post: (recipe: RecipeFormValues) => requests.post<void>(`/recipes`, recipe),
    delete: (id: string) => requests.delete<void>(`/recipes/${id}`),
    like: (id: string) => requests.post<void>(`/recipes/${id}/like`, {}),
    uploadPhoto: (id: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>(`photos/${id}`, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
}
const Ingredients = {
    list: () => requests.get<Ingredient[]>('/ingredients'),
    details: (id: string) => requests.get<Ingredient>(`/ingredients/${id}`),
    put: (recipe: IngredientFormValues) => requests.put<void>(`/ingredients/${recipe.id}`, recipe),
    post: (recipe: IngredientFormValues) => requests.post<void>(`/ingredients`, recipe),
    delete: (id: string) => requests.delete<void>(`/ingredients/${id}`),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    list: () => requests.get<Profile[]>('/profiles'),
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
}

const agent = {
    Recipes,
    Account,
    Ingredients,
    Profiles
}

export default agent;