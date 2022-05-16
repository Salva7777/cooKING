import { useField } from "formik";
import { SyntheticEvent } from "react";
import { Form, Icon, Label, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { IconSizeProp } from "semantic-ui-react/dist/commonjs/elements/Icon/Icon";
import { boolean } from "yup/lib/locale";

interface Props {
    "onClick": (e: SyntheticEvent) => void;
    color: SemanticCOLORS | undefined;
    name: SemanticICONS | undefined;
    size: IconSizeProp | undefined;
    clicked:boolean;
}

export default function MyIcon(props: Props) {
    const [field, meta] = useField("" + props.name);
    return (
        <Form.Field error={meta.touched}>
            <Icon {...props} onChange={field.onChange} onBlur={field.onBlur}></Icon>
            {props.clicked ? !props.clicked : null}
        </Form.Field>
    )
}