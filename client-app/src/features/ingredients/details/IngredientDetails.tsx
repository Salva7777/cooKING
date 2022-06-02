import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Container, Header, Icon, Image, Loader, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Ingredient } from "../../../app/models/ingredient";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import RecipeCard from "../../recipes/card/recipeCard";
import RecipeCardPlaceHolder from "../../recipes/card/recipeCardPlaceHolder";

export default observer(function IngredientDetails() {
    const { recipeStore, ingredientStore, userStore } = useStore();
    const { isLoggedIn, user } = userStore;
    const { selectedIngredient: ingredient, loadIngredient, loadingInitial } = ingredientStore;
    const { recipesByDate, setPredicate, recipeRegistry, pagination, setPagingParams, loadRecipes } = recipeStore;
    const { id } = useParams<{ id: string }>();
    const [loadingNext, setLoadingNext] = useState(false);


    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1, pagination!.itemsPerPage))
        loadRecipes().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (id) {
            setPagingParams(new PagingParams(0, 3));
            loadIngredient(id); setPredicate('Reset'); setPredicate('HasIngredients', false);
            setPredicate('SelectedIngredients', id);
        };
    }, [id, loadIngredient, isLoggedIn])

    if (loadingInitial || !ingredient) return <LoadingComponent />;

    return (
        <Segment>
            <Header as={'h1'} content={ingredient.name} />
            <p>
                Created by <strong><Link to={`/profiles/${ingredient.ownerUsername}`}>{ingredient.ownerUsername}</Link></strong>
            </p>
            <Header as={'h2'} content={"Recipes made with this ingredient: "} />
            {recipeStore.loadingInitial && !loadingNext ? (
                <>
                    <Card.Group >
                        <RecipeCardPlaceHolder />
                        <RecipeCardPlaceHolder />
                        <RecipeCardPlaceHolder />
                    </Card.Group >
                </>
            ) : (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                    initialLoad={false}
                >
                    <Card.Group >
                        {recipesByDate.map(recipe =>
                            <RecipeCard recipe={recipe} />
                        )
                        }
                    </Card.Group>
                    <Loader inline active={loadingNext} />
                </InfiniteScroll>
            )}
        </Segment >
    )
})