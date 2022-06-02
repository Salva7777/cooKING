import { useField } from "formik";
import { Checkbox, Form, Label } from "semantic-ui-react";

interface Props {
    name: string;
    label: string;
}

export default function MyCheckBox(props: Props) {
    const [field, meta, helpers] = useField(props.name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <Checkbox
                {...field}{...props} checked={field.value} onChange={(e, { checked }) => {
                    helpers.setValue(checked)
                }} />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}