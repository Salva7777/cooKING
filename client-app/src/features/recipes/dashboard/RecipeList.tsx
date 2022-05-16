import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Image, Segment, Header, List, Label, Container, Transition } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";
import RecipeListItem from "./RecipeListItem";

export default observer(function RecipeList() {
    const { recipeStore } = useStore();
    const { recipesById } = recipeStore;
    return (
        <>
            {recipesById.map(recipe =>
                <RecipeListItem recipe={recipe} />
            )}
        </>
    )
})