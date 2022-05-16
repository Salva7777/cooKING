import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";
import { RecipeFormValues } from "../../models/recipe";

interface Props {
    placeholder: string;
    name: string;
    options: any;
    search: boolean;
    label?: string;
    recipe?: RecipeFormValues;
}

export default function MySelectInput(props: Props) {
    const [field, meta, helpers] = useField(props.name);
    function defineDisabled(options: any) {
        options.map((option: { value: string; disabled: boolean; }) => {
            var present = false;
            props.recipe?.ingredients.forEach(ingredient => {
                if (option.value == ingredient.id)
                    present = true;
            })
            present ? option.disabled = true : option.disabled = false;
        })
        return options;
    }
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select
                clearable
                search={props.search}
                options={props.recipe ? defineDisabled(props.options) : props.options}
                value={field.value || null}
                onChange={(e, d) => {
                    helpers.setValue(d.value)
                }}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}