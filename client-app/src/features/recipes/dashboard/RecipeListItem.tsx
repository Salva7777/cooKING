import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Icon, Label, Transition, Image, Segment, GridColumn, Grid, GridRow, SegmentGroup } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";

interface Props {
    recipe: Recipe
}


export default observer(function RecipeListItem({ recipe }: Props) {
    const [target, setTarget] = useState('');
    function handleRecipeLike(id: string) {
        likeRecipe(id);
        setTarget(id);
    }
    const { recipeStore: { likeRecipe, loading } } = useStore();
    const [visible, setVisible] = useState(true);
    return (
        <Fragment>
            <SegmentGroup>
                <Container as={Link} to={`/recipes/${recipe.id}`}>
                    <SegmentGroup>
                        <Segment>
                            <Header size="huge">{recipe.title}</Header>
                        </Segment>
                        <Segment>
                            <Image fluid src={recipe.image || '/assets/recipe-image-placeholder.jpg'} />
                        </Segment>
                    </SegmentGroup>
                </Container>
                <Segment>
                    <Grid columns={3} >
                        <Grid.Column>
                            <Header>
                                <Icon name="clock outline"></Icon>{(recipe.duration[1] != 0 ? recipe.duration[1] + "d " : "") + ("0" + recipe.duration[2]).slice(-2) + "h " + ("0" + recipe.duration[3]).slice(-2) + "m " + ("0" + recipe.duration[4]).slice(-2) + "s "}
                            </Header>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            <Header>
                                {recipe.difficulty}
                            </Header>
                        </Grid.Column>
                        <Grid.Column>
                            {!recipe.isOwner && recipe.liked ? (
                                <Transition
                                    animation='pulse'
                                    duration={750}
                                    visible={visible}
                                >{loading && target === recipe.id ?
                                    <Icon link name="heart outline" size={"big"}></Icon> :
                                    <Icon link name="heart" size={"big"} color="red" onClick={() => { handleRecipeLike(recipe.id); setVisible(!visible) }}></Icon>
                                    }
                                </Transition>
                            ) : (
                                <Transition
                                    animation='pulse'
                                    duration={750}
                                    visible={visible}
                                >
                                    {loading && target === recipe.id ?
                                        <Icon link name="heart" color="red" size={"big"}></Icon> :
                                        <Icon link name="heart outline" size={"big"} onClick={() => { handleRecipeLike(recipe.id); setVisible(!visible) }}></Icon>
                                    }
                                </Transition>
                            )}
                        </Grid.Column>
                    </Grid>
                </Segment>
            </SegmentGroup>
        </Fragment>
    )
})