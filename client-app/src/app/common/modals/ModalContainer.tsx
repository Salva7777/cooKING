import { observer } from 'mobx-react-lite';
import { Button, Divider, Modal } from 'semantic-ui-react';
import LoginForm from '../../../features/users/LoginForm';
import RegisterForm from '../../../features/users/RegisterForm';
import { useStore } from '../../stores/store';

export default observer(function ModalContainer() {
    const { modalStore } = useStore();


    return (
        <Modal style={{
            position: 'absolute', top: '4em',
            left: '77%',
        }} open={modalStore.modal.open} onClose={modalStore.closeModal} size='mini'>
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    )
})