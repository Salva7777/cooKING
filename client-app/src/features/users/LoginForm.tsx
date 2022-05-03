import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Divider, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import ValidationErrors from "../errors/ValidationErrors";
import RegisterForm from "./RegisterForm";

export default observer(function LoginForm() {
    const { userStore, modalStore } = useStore();
    return (
        <Formik initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values).catch(error =>
                setErrors({ error: error.response.data }))}>
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login' textAlign="center" />
                    <MyTextInput label='Email' name='email' placeholder="Email" type="email" />
                    <MyTextInput label='Password' name='password' placeholder="Password" type='password' />
                    <ErrorMessage name='error' render={() => <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />} />
                    <Button loading={isSubmitting} positive content='Login' type='submit' fluid />
                    <Divider horizontal>Or</Divider>
                    <Button fluid color='black' onClick={() => {
                        modalStore.changeModal(<RegisterForm />);
                    }}>Don't have an account yet? Register here.</Button>
                </Form>
            )}
        </Formik>
    )
})