import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import LoginForm from '../../features/users/LoginForm';
import { useStore } from '../stores/store';

export default observer(function NavBar() {
    const { modalStore, userStore: { user, logout, isLoggedIn } } = useStore();
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={Link} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{ marginRight: '10px' }} />
                    COOKING
                </Menu.Item>
                <Menu.Item as={Link} to='/recipes' name='Recipes' />
                <Menu.Item>
                    <Button disabled={!isLoggedIn}
                    as={Link} color='black' to='/createrecipe' content='Create Recipe' />
                </Menu.Item>
                {isLoggedIn ?
                    <Menu.Item position='right'>
                        <Image src={user?.image || '/assets/user.png'} avatar spaced='right' />
                        <Dropdown pointing='top left' text={user?.displayName}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/profile/${user?.username}`}
                                    text='My Profile' icon='user' />
                                <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    : <Menu.Item onClick={() => modalStore.openModal(<LoginForm />)} position='right' name='Login'></Menu.Item>}
            </Container>
        </Menu>
    )
})