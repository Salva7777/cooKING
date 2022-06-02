import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, FormField, Header, Label, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { RecipeFormValues } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";
import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { difficultyOptions } from "../../../app/common/options/difficultyOptions";
import MyTextArea from "../../../app/common/form/MyTextArea";
import { ingredientMeasuresOptions } from "../../../app/common/options/ingredientMeasuresOptions";
import IngredientNamesOptions from "../../../app/common/options/ingredientNamesOptions";
import MyIcon from "../../../app/common/form/MyIcon";


export default observer(function RecipeForm() {
    const history = useHistory();
    const { recipeStore } = useStore();
    const { createRecipe, updateRecipe, loading, loadRecipe, loadingInitial } = recipeStore;
    const { id } = useParams<{ id: string }>();


    const [clicked, setClicked] = useState(false);

    const a = (IngredientNamesOptions())

    const [recipe, setRecipe] = useState<RecipeFormValues>(new RecipeFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The recipe title is required'),
        difficulty: Yup.string().required('The recipe difficulty is required'),
        description: Yup.string(),
        ingredients: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().required('The ingredient name is required'),
                quantity: Yup.number().required('The ingredient quantity is required'),
                measure: Yup.string().required('The ingredient measure is required'),
            })
        ),
        preparationSteps: Yup.array().of(
            Yup.object().shape({
                stepNo: Yup.number().required('The Step number is required'),
                text: Yup.string().required('The Step content is required'),
                recipeID: Yup.string(),
            })
        ),
        duration: Yup.array().of(Yup.number().required('the time is required'))

    })

    useEffect(() => {
        if (id) {
            loadRecipe(id).then(recipe => setRecipe(new RecipeFormValues(recipe)))
        }
    }, [id, loadRecipe]);

    function handleRemoveIngredient(e: SyntheticEvent, values: RecipeFormValues) {
        values.ingredients.splice(Number(e.currentTarget.ariaLabel), 1);

    }

    function handleRemoveStep(e: SyntheticEvent, values: RecipeFormValues) {
        values.preparationSteps.splice(Number(e.currentTarget.ariaLabel), 1);
    }

    function handleAddIngredient(values: RecipeFormValues) {
        try {
            values.ingredients.push({ id: "", name: '', quantity: 0, measure: '', ingredientId: "" });
        } catch (error) {
            console.log(error)
        }
    }
    function handleAddStep(values: RecipeFormValues) {
        try {
            values.preparationSteps.push({ stepNo: values.preparationSteps.length, text: '' });
        } catch (error) {
            console.log(error)
        }
    }

    function handleFormSubmit(recipe: RecipeFormValues) {
        recipe.duration.unshift(0);
        recipe.ingredients.forEach(element => {
            element.ingredientId = element.id;
        });
        recipe.duration = recipe.duration[1] + '.' + recipe.duration[2] + ':' + recipe.duration[3] + ':00'
        if (!recipe.id) {
            console.log("i dont have id")
            let newRecipe = {
                ...recipe,
                id: uuid()
            };
            console.log("my id is " + newRecipe.id)
            createRecipe(newRecipe).then(() => history.push(`/recipes/${newRecipe.id}`))
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
                {({ handleSubmit, dirty, values, isValid, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} autoComplete='off'>
                        <FormField>
                            <MyTextInput label="Title" placeholder="Title" name="title" type="text" />
                            <MySelectInput label="Difficulty" search={false} options={difficultyOptions} placeholder='Difficulty' name='difficulty' />
                            <MyTextArea label="Description" rows={3} placeholder='Description' name='description' />
                            <Header as='h5' content='Ingredients' />
                            {values.ingredients.map((ingredient, index) =>
                                <Form.Group>
                                    <MySelectInput search label="Name" options={a} recipe={values} placeholder='Name' name={`ingredients[${index}].id`} />
                                    <MyTextInput label="Quantity" type="number" placeholder='Quantity' name={`ingredients[${index}].quantity`} min={0.01} max={1000} step={0.01} />
                                    <MySelectInput search label="Measure" options={ingredientMeasuresOptions} placeholder='Measure' name={`ingredients[${index}].measure`} />
                                    <MyIcon size="small" aria-label={index + ""} clicked={clicked} name="x" color="red" onClick={(e: SyntheticEvent) => { handleRemoveIngredient(e, values); setClicked(!clicked); dirty = true; }} />
                                </Form.Group>
                            )}
                            <MyIcon size="large" clicked={clicked} name="add circle" color="grey" onClick={() => { handleAddIngredient(values); setClicked(!clicked) }} />
                            <Header as='h5' content='Preparation' />
                            {values.preparationSteps.map((preparationStep, index) =>
                                <Form.Group>
                                    <MyTextArea label={`Step nº ${index + 1}`} placeholder={"Write some preparation info"} name={`preparationSteps[${index}].text`} rows={3} />
                                    <MyIcon size="small" aria-label={index + ""} clicked={clicked} name="x" color="red" onClick={(e: SyntheticEvent) => { handleRemoveStep(e, values); setClicked(!clicked); dirty = true; }} />
                                </Form.Group>
                            )}
                            <MyIcon size="large" clicked={clicked} name="add circle" color="grey" onClick={() => { handleAddStep(values); setClicked(!clicked) }} />
                            <Header as='h5' content='Duration' />
                            <Form.Group>
                                <MyTextInput type="number" label="Days" placeholder='Days' name='duration[0]' max={7} min={0} />
                                <MyTextInput type="number" label="Hours" placeholder='Hours' name='duration[1]' max={23} min={0} />
                                <MyTextInput type="number" label="Minutes" placeholder='Minutes' name='duration[2]' max={59} min={0} />
                            </Form.Group>
                            < Button disabled={isSubmitting || !dirty || !isValid} loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                            <Button as={Link} to={'/recipes'} floated='right' type='submit' content='Cancel' />
                        </FormField>
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})