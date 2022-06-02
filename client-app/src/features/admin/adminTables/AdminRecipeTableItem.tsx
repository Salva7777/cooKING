import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Table, TableRow, Icon, Item, Label, List, Button, ButtonGroup } from "semantic-ui-react";
import agent from "../../../app/api/agent";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";


interface Props {
    recipe: Recipe
}

export default observer(function AdminRecipeTableItem({ recipe }: Props) {
    const { userStore } = useStore();
    const { user } = userStore;
    return (
        <Table.Row>
            <Table.Cell textAlign="left">{recipe.title}</Table.Cell>
            <Table.Cell>
                <Icon size="small" inverted circular name={recipe.isVeggie ? 'checkmark' : 'x'} color={recipe.isVeggie ? 'green' : 'red'} />
            </Table.Cell>
            <Table.Cell>
                <Icon size="small" inverted circular name={recipe.isGlutenFree ? 'checkmark' : 'x'} color={recipe.isGlutenFree ? 'green' : 'red'} />
            </Table.Cell>
            <Table.Cell>
                <Icon size="small" inverted circular name={recipe.isLactoseFree ? 'checkmark' : 'x'} color={recipe.isLactoseFree ? 'green' : 'red'} />
            </Table.Cell>
            <Table.Cell>
                <Button icon
                    disabled={user?.roles.some(x => x.name !== "Admin")}
                    circular
                    as={Link}
                    basic
                    to={`/managerecipe/${recipe.id}`}
                    color='orange'>
                    <Icon name="pencil" />
                </Button>
                <Button icon
                    disabled={user?.roles.some(x => x.name !== "Admin")}
                    circular
                    basic
                    onClick={() => console.log(recipe.id)}
                    color='red'>
                    <Icon name="x" />
                </Button>
            </Table.Cell>
        </Table.Row>
    )
})