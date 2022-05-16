import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Grid, Icon, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";
import RecipDetailedInfo from "./RecipDetailedInfo";
import RecipDetailedSidebar from "./RecipDetailedSidebar";
import RecipeDetailedHeader from "./RecipeDetailedHeader";



export default observer(function RecipeDetails() {
    const { recipeStore, userStore } = useStore();
    const { isLoggedIn } = userStore;
    const { selectedRecipe: recipe, clearSelectedRecipe, loadRecipe, loadingInitial } = recipeStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) loadRecipe(id);
        return () => clearSelectedRecipe();
    }, [id, loadRecipe, isLoggedIn])

    if (loadingInitial || !recipe) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <RecipeDetailedHeader recipe={recipe} />
                <RecipDetailedInfo recipe={recipe} />
                {/* <RecipDetailedChat recipeId={recipe.id} /> */}
            </Grid.Column>
            <Grid.Column width={6}>
                <RecipDetailedSidebar recipe={recipe} />
            </Grid.Column>
        </Grid>
    )
})