import React from "react";
import { Container, Grid, List } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";
import RecipeDetails from "../details/RecipeDetails";
import RecipeList from "./RecipeList";

export default function RecipeDashBoard() {
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList/>
            </Grid.Column>
        </Grid>
    )
}