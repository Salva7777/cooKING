import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Table, TableRow, Icon, Item, Label, List, Button } from "semantic-ui-react";
import { Ingredient } from "../../../app/models/ingredient";
import { useStore } from "../../../app/stores/store";


interface Props {
    ingredient: Ingredient
}

export default observer(function IngredientListItem({ ingredient }: Props) {
    const { userStore } = useStore();
    const { user } = userStore;
    return (
        <List.Item as={Link} to={`/ingredients/${ingredient.id}`}>
            {ingredient.name}
        </List.Item>
    )
})


// USAR NA ADMIN DASHBOARD
// <Table.Row>
// <Table.Cell>{ingredient.name}</Table.Cell>
// <Table.Cell>
//     <Icon size="small" inverted circular name={ingredient.veggie ? 'checkmark' : 'x'} color={ingredient.veggie ? 'green' : 'red'} />
// </Table.Cell>
// <Table.Cell>
//     <Icon size="small" inverted circular name={ingredient.glutenFree ? 'checkmark' : 'x'} color={ingredient.glutenFree ? 'green' : 'red'} />
// </Table.Cell>
// <Table.Cell>
//     <Icon size="small" inverted circular name={ingredient.lactoseFree ? 'checkmark' : 'x'} color={ingredient.glutenFree ? 'green' : 'red'} />
// </Table.Cell>
// <Table.Cell>
//     <Button
//         disabled={user?.username !== ingredient.ownerUsername}
//         circular
//         as={Link}
//         to={`/manageingredient/${ingredient.id}`}
//         color='orange'>
//         Edit Ingredient
//     </Button>
// </Table.Cell>
// </Table.Row>