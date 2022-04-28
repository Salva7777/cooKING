import { ErrorMessage, Field, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, FormField, Header, Label, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { difficultyOptions } from "../../../app/common/options/difficultyOptions";
import MyNumInput from "../../../app/common/form/MyNumInput";



export default observer(function RecipeForm() {
    const history = useHistory();
    const { recipeStore } = useStore();
    const { createRecipe, updateRecipe, loading, loadRecipe, loadingInitial } = recipeStore;
    const { id } = useParams<{ id: string }>();

    const [recipe, setRecipe] = useState<any>({
        id: '',
        title: '',
        difficulty: '',
        duration: {
            days: undefined,
            hours: undefined,
            minutes: undefined,
        },
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The recipe title is required'),
        difficulty: Yup.string().required('The recipe difficulty is required'),
        duration: Yup.object().shape(
            {
                days: Yup.string().required('The recipe days are required'),
                hours: Yup.string().required('The recipe hours are required'),
                minutes: Yup.string().required('The recipe minutes are required'),
            })
    })

    useEffect(() => {
        if (id) loadRecipe(id).then(recipe => setRecipe(recipe!))
    }, [id, loadRecipe]);

    function handleFormSubmit(recipe: Recipe) {
        recipe.duration = recipe.duration?.days + '.' + recipe.duration?.hours + ':' + recipe.duration?.minutes + ':00'
        if (recipe.id.length === 0) {
            let newRecipe = {
                ...recipe,
                id: uuid()
            };
            createRecipe(newRecipe).then(() => history.push(`/recipes/${newRecipe.id}`))
            console.log(newRecipe);
        } else {
            updateRecipe(recipe).then(() => history.push(`/recipes/${recipe.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading Form..." />
    return (
        <Segment clearing>
            <Header as='h3' content='Recipe Details:' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={recipe}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit }) => (
                    <Form onSubmit={handleSubmit} autoComplete='off'>
                        <FormField>
                            <MyTextInput label="Title" placeholder="Title" name="title" />
                            <MySelectInput label="Difficulty" options={difficultyOptions} placeholder='Difficulty' name='difficulty' />
                            <Header as='h5' content='Duration' />
                            <Form.Group>
                                <MyNumInput label="Days" value={recipe.duration?.days} placeholder='Days' name='duration.days' max={7} min={0} />
                                <MyNumInput label="Hours" value={recipe.duration?.days} placeholder='Hours' name='duration.hours' max={23} min={0} />
                                <MyNumInput label="Minutes" value={recipe.duration?.days} placeholder='Minutes' name='duration.minutes' max={59} min={0} />
                            </Form.Group>
                            <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                            <Button as={Link} to='/recipes' floated='right' type='submit' content='Cancel' />
                        </FormField>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})