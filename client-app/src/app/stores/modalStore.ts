import { makeAutoObservable } from "mobx"
import { bool } from "yup";

interface Modal {
    open: boolean;
    body: JSX.Element | null;
    login: boolean;
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        body: null,
        login: false
    }

    constructor() {
        makeAutoObservable(this)
    }

    openModal = (content: JSX.Element) => {
        this.modal.open = true;
        this.modal.body = content;
    }

    changeModal = (content: JSX.Element) => {
        if (this.modal.open) {
            this.modal.body = content;
            this.modal.login = !this.modal.login;
        }
    }

    closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}