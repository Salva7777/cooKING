import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Container, Grid, Loader, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import RecipeFilters from "./RecipeFilters";
import RecipeList from "./RecipeList";
import RecipeListItemPlaceholder from "./RecipeListItemPlaceholder";

export default observer(function RecipeDashBoard() {

    const { recipeStore, ingredientStore } = useStore();
    const { loadRecipes, recipeRegistry, predicate, pagination, setPagingParams, clearSelectedRecipe, setPredicate } = recipeStore;
    const { selectedIngredient, clearSelectedIngredient } = ingredientStore;
    const { loadIngredients } = ingredientStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadRecipes().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        clearSelectedRecipe();
        if (selectedIngredient) {
            setPredicate('Reset');
            clearSelectedIngredient();
        }
        if (recipeRegistry.size <= 1) {
            loadRecipes();
            loadIngredients();
        };
    }, [recipeRegistry.size, loadRecipes, selectedIngredient])


    return (
        <Grid columns={2}>
            <Grid.Column width='6'>
                <RecipeFilters />
            </Grid.Column>
            <Grid.Column width='8'>
                {recipeStore.loadingInitial && !loadingNext ? (
                    <>
                        <RecipeListItemPlaceholder />
                        <RecipeListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <RecipeList />
                    </InfiniteScroll>
                )}
                <Container textAlign="center">
                    <Loader active={loadingNext} inline />
                </Container>
            </Grid.Column>
        </Grid>
    )
}
) 