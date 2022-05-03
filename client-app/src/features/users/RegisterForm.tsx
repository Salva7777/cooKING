import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Divider, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import ValidationErrors from "../errors/ValidationErrors";
import LoginForm from "./LoginForm";

export default observer(function RegisterForm() {
    const { userStore, modalStore } = useStore();
    return (
        <Formik initialValues={{ displayName: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error =>
                setErrors({ error }))}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string().required(),
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up' textAlign="center" />
                    <MyTextInput label='DisplayName' name='displayName' placeholder="Display Name" type="text" />
                    <MyTextInput label='UserName' name='username' placeholder="Username" type="text" />
                    <MyTextInput label='Email' name='email' placeholder="Email" type="email" />
                    <MyTextInput label='Password' name='password' placeholder="Password" type='password' />
                    <ErrorMessage name='error' render={() =>
                        <ValidationErrors errors={errors.error} />} />
                    <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content='Register' type='submit' fluid />
                    <Divider horizontal>Or</Divider>
                    <Button fluid color='black' onClick={() => {
                        modalStore.changeModal(<LoginForm />);
                    }}>Already have an account? Login here.</Button>
                </Form>
            )}
        </Formik>
    )
})