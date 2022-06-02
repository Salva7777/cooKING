import { Formik, Form, Field, FieldProps } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Segment, Header, Comment, Button, Loader, Icon } from 'semantic-ui-react'
import MyTextArea from '../../../app/common/form/MyTextArea';
import { store, useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';
import { Recipe } from '../../../app/models/recipe';


interface Props {
    recipe: Recipe;
}

export default observer(function RecipeDetailedChat({ recipe }: Props) {
    const { commentStore } = useStore();
    const { commentsByDate } = commentStore;

    useEffect(() => {
        if (recipe.id) {
            commentStore.createHubConnection(recipe.id);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, recipe]);
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='black'
                style={{ border: 'none' }}
            >
                <Header>Comments</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>

                    <Formik
                        onSubmit={(values, { resetForm }) =>
                            commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={Yup.object({
                            body: Yup.string().required()
                        })}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (

                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{ position: 'relative' }}>
                                            <Loader active={isSubmitting} />
                                            <textarea
                                                disabled={!store.userStore.isLoggedIn}
                                                placeholder={store.userStore.isLoggedIn ? 'Enter your comment (Enter to submit, SHIFT + enter for new line)' : 'Log in to comment'}
                                                rows={2}
                                                {...props.field}
                                                onKeyPress={e => {
                                                    if (e.key === 'enter' && e.shiftKey) {
                                                        return;
                                                    }
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        isValid && handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>

                    {commentsByDate.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{comment.body}</Comment.Text>
                                {store.userStore.isLoggedIn &&
                                    <Comment.Actions>
                                        <a>Reply</a>
                                        {(recipe.isOwner || comment.username == store.userStore.user?.username) &&
                                            <Icon onClick={() => { commentStore.removeComment(comment.id); }} link name='trash alternate outline'></Icon>}
                                    </Comment.Actions>
                                }
                            </Comment.Content>
                        </Comment>
                    ))}

                </Comment.Group>
            </Segment>
        </>

    )
})