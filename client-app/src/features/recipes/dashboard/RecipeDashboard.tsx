import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import RecipeList from "./RecipeList";

export default observer(function RecipeDashBoard() {

    const { recipeStore } = useStore();
    const { loadRecipes, recipeRegistry } = recipeStore;

    useEffect(() => {
        if (recipeRegistry.size <= 1) loadRecipes();
    }, [recipeRegistry.size, loadRecipes])

    if (recipeStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

    return (
        <Grid>
            <Grid.Column width='8'>
                <RecipeList />
            </Grid.Column>
        </Grid>
    )
}
) 