import React from "react";
import { Container, Grid, List } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";
import RecipeDetails from "../details/RecipeDetails";
import RecipeList from "./RecipeList";

interface Props {
    recipes: Recipe[]
}

export default function RecipeDashBoard({ recipes }: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <RecipeList recipes={recipes} />
            </Grid.Column>
        </Grid>
    )
}