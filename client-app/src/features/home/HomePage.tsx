import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import LoginForm from '../users/LoginForm';

export default observer(function HomePage() {
    const { userStore, userStore: { user } } = useStore();
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />

                </Header>
                {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Cooking' />
                        <Button as={Link} to='/recipes' size='huge' inverted content={`Continue as ${user?.displayName}`} />
                    </>
                ) : (
                    <>
                        <Header as='h2' inverted content='Welcome to Cooking' />
                        <Button as={Link} to='/recipes' size='huge' inverted content='Continue without LogIn' />
                    </>
                )}
            </Container>
        </Segment>
    )
})