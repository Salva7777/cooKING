import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get commentsByDate() {
        return Array.from(this.comments.values()).sort((a, b) =>
            b.createdAt!.getTime() - a.createdAt!.getTime());
    }

    createHubConnection = (recipeId: string) => {
        if (store.recipeStore.selectedRecipe) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?recipeId=' + recipeId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            console.log(store.userStore.user?.token!)

            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));

            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt);
                    })
                    this.comments = comments
                });
            })

            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.push(comment)
                });
            })

            this.hubConnection.on('RemoveComment', (id: number) => {
                runInAction(() => {
                    this.comments = this.comments.filter(comment => comment.id != id)
                });
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error))
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.recipeId = store.recipeStore.selectedRecipe?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values)
        } catch (error) {
            console.log(error);
        }
    }
    removeComment = async (id: number) => {
        try {
            await this.hubConnection?.invoke('DeleteComment', id)
        } catch (error) {
            console.log(error);
        }
    }
}