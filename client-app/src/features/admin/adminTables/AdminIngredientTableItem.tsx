import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Table, TableRow, Icon, Item, Label, List, Button, ButtonGroup } from "semantic-ui-react";
import agent from "../../../app/api/agent";
import { Ingredient } from "../../../app/models/ingredient";
import { useStore } from "../../../app/stores/store";


interface Props {
    ingredient: Ingredient
}

export default observer(function AdminIngredientTableItem({ ingredient }: Props) {
    const { userStore } = useStore();
    const { user } = userStore;
    return (
        <Table.Row>
            <Table.Cell textAlign="left">{ingredient.name}</Table.Cell>
            <Table.Cell>
                <Icon size="small" inverted circular name={ingredient.veggie ? 'checkmark' : 'x'} color={ingredient.veggie ? 'green' : 'red'} />
            </Table.Cell>
            <Table.Cell>
                <Icon size="small" inverted circular name={ingredient.glutenFree ? 'checkmark' : 'x'} color={ingredient.glutenFree ? 'green' : 'red'} />
            </Table.Cell>
            <Table.Cell>
                <Icon size="small" inverted circular name={ingredient.lactoseFree ? 'checkmark' : 'x'} color={ingredient.lactoseFree ? 'green' : 'red'} />
            </Table.Cell>
            <Table.Cell>
                <Button icon
                    disabled={user?.roles.some(x => x.name !== "Admin")}
                    circular
                    as={Link}
                    basic
                    to={`/manageingredient/${ingredient.id}`}
                    color='orange'>
                    <Icon name="pencil" />
                </Button>
                <Button icon
                    disabled={user?.roles.some(x => x.name !== "Admin")}
                    circular
                    basic
                    onClick={() => console.log(ingredient.id)}
                    color='red'>
                    <Icon name="x" />
                </Button>
            </Table.Cell>
        </Table.Row>
    )
})