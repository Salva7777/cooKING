import { makeAutoObservable, reaction } from "mobx";

export default class AdminStore {
    activeTab = 0;


    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {

            }
        )
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }
}