import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Segment, Table } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import IngredientListItem from "../../ingredients/IngredientList/IngredientListItem";
import AdminIngredientTableItem from "./AdminIngredientTableItem";

export default observer(function AdminIngredientsTable() {
    const { ingredientStore } = useStore();
    const { loadIngredients, ingredientsById, loadingInitial } = ingredientStore;
    useEffect(() => {
        loadIngredients()
    }, [loadIngredients])
    return (<Table columns={5} divided="vertically" textAlign="center">
        <Table.Header>
            <Table.HeaderCell textAlign="left">Name</Table.HeaderCell>
            <Table.HeaderCell>Veggie</Table.HeaderCell>
            <Table.HeaderCell>Gluten Free</Table.HeaderCell>
            <Table.HeaderCell>Lactose Free</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
        </Table.Header>
        {ingredientsById.map((Ingredient) =>
            <AdminIngredientTableItem ingredient={Ingredient} key={Ingredient.id} />
        )}
    </Table>)



    //ADMIN DASHBOARD
    {/* <Table columns={5} divided="vertically" textAlign="center">
    <Table.Header>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Veggie</Table.HeaderCell>
        <Table.HeaderCell>Gluten Free</Table.HeaderCell>
        <Table.HeaderCell>Lactose Free</Table.HeaderCell>
        <Table.HeaderCell></Table.HeaderCell>
    </Table.Header>
    {ingredientsById.map((Ingredient) =>
        <IngredientListItem ingredient={Ingredient} key={Ingredient.id} />
    )}
    </Table> */}
})