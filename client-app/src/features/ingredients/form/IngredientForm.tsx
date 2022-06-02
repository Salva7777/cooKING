import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, FormField, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import MyTextInput from "../../../app/common/form/MyTextInput";
import { IngredientFormValues } from "../../../app/models/ingredient";
import MyCheckBox from "../../../app/common/form/MyCheckBox";


export default observer(function IngredientForm() {
    const history = useHistory();
    const { ingredientStore } = useStore();
    const { createIngredient, updateIngredient, loading, loadIngredient, loadingInitial } = ingredientStore;
    const { id } = useParams<{ id: string }>();

    const [ingredient, setIngredient] = useState<IngredientFormValues>(new IngredientFormValues());

    const validationSchema = Yup.object({
        name: Yup.string().required('The ingredient name is required'),
        veggie: Yup.bool(),
        glutenFree: Yup.bool(),
        lactoseFree: Yup.bool(),

    })

    useEffect(() => {
        if (id) {
            loadIngredient(id).then(ingredient => setIngredient(new IngredientFormValues(ingredient)))
        }
    }, [id, loadIngredient]);

    function handleFormSubmit(ingredient: IngredientFormValues) {
        if (!ingredient.id) {
            console.log(ingredient)
            let newIngredient = {
                ...ingredient,
                id: uuid()
            };
            console.log("my id is " + newIngredient.id)
            createIngredient(newIngredient).then(() => history.push(`/ingredients/${newIngredient.id}`))
        } else {
            updateIngredient(ingredient).then(() => history.push(`/ingredients/${ingredient.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading Form..." />
    return (
        <Segment clearing>
            <Header as='h3' content='Ingredient Details:' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={ingredient}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, dirty, values, isValid, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} autoComplete='off'>
                        <FormField>
                            <MyTextInput label="Name" placeholder="Name" name="name" type="text" />
                            <Header as='h5' content='Cautions' />
                            <Form.Group>
                                <MyCheckBox name="veggie" label={"Veggie"} />
                                <MyCheckBox name="glutenFree" label={"Gluten Free"} />
                                <MyCheckBox name="lactoseFree" label={"Lactose Free"} />
                            </Form.Group>
                            <Button disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                            <Button as={Link} to={'/ingredients'} floated='right' type='submit' content='Cancel' />
                        </FormField>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})