import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Image, Segment, Header, List, Label, Container, Transition } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";
import RecipeListItem from "./RecipeListItem";

export default observer(function RecipeList() {
    const { recipeStore } = useStore();
    const { recipesByDate } = recipeStore;


    return (
        <>
            {recipesByDate.map(recipe =>
                <RecipeListItem key={recipe.id} recipe={recipe} />
            )}
        </>
    )
})