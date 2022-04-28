import axios, { AxiosResponse } from 'axios';
import { Recipe } from '../models/recipe';


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}
axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000)
        return response;
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get(url).then<T>(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Recipes = {
    list: () => requests.get<Recipe[]>('/recipes'),
    details: (id: string) => requests.get<Recipe>(`/recipes/${id}`),
    put: (recipe: Recipe) => requests.put<void>(`/recipes/${recipe.id}`, recipe),
    post: (recipe: Recipe) => requests.post<void>(`/recipes`,recipe),
    delete:(id:string) => requests.delete<void>(`/recipes/${id}`)
}

const agent = {
    Recipes
}

export default agent;