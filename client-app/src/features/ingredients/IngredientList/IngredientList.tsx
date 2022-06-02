import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Container, Divider, Item, List, Segment, Table } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Ingredient } from "../../../app/models/ingredient";
import { useStore } from "../../../app/stores/store";
import IngredientListItem from "./IngredientListItem";

export default observer(function IngredientList() {
    const { ingredientStore } = useStore();
    const { loadIngredients, ingredientsById, loadingInitial } = ingredientStore;
    useEffect(() => {
        loadIngredients()
    }, [loadIngredients])
    if (loadingInitial) return <LoadingComponent />;
    return <Segment>
        <List divided selection size="huge">
            {ingredientsById.map((Ingredient) =>
                <IngredientListItem ingredient={Ingredient} key={Ingredient.id} />
            )}
        </List>
    </Segment>
})

