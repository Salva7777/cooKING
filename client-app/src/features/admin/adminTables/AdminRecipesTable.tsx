import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Segment, Table } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import AdminRecipeTableItem from "./AdminRecipeTableItem";

export default observer(function AdminRecipesTable() {
    const { recipeStore } = useStore();
    const { loadRecipes, recipesByDate, pagingParams, setPagingParams, loadingInitial } = recipeStore;
    useEffect(() => {
        setPagingParams(new PagingParams(0, 20));
        loadRecipes()
    }, [loadRecipes])
    return (<Table columns={5} divided="vertically" textAlign="center">
        <Table.Header>
            <Table.HeaderCell textAlign="left">Name</Table.HeaderCell>
            <Table.HeaderCell>Veggie</Table.HeaderCell>
            <Table.HeaderCell>Gluten Free</Table.HeaderCell>
            <Table.HeaderCell>Lactose Free</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
        </Table.Header>
        {recipesByDate.map((recipe) =>
            <AdminRecipeTableItem recipe={recipe} key={recipe.id} />
        )}
    </Table>)
})