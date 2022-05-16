import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Icon, Label, Transition, Image, Segment } from "semantic-ui-react";
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
        console.log(target)
    }
    const { recipeStore: { likeRecipe, loading } } = useStore();
    const [visible, setVisible] = useState(true);
    return (
        <Segment>
            <Container as={Link} to={`/recipe/${recipe.id}`}>
                <Header size="huge">{recipe.title}</Header>
                <Image fluid src={recipe.image ? recipe.image : 'https://4.bp.blogspot.com/-OCutvC4wPps/XfNnRz5PvhI/AAAAAAAAEfo/qJ8P1sqLWesMdOSiEoUH85s3hs_vn97HACLcBGAsYHQ/s1600/no-image-found-360x260.png'} />
            </Container>
            <Label color={recipe.duration[8] > 59 ? "orange" : recipe.duration[8] > 9 ? "yellow" : "green"} size="big">
                {console.log(recipe.duration)}
                <Icon name="clock outline"></Icon>{(recipe.duration[1] != 0 ? recipe.duration[1] + "d " : "") + ("0" + recipe.duration[2]).slice(-2) + "h " + ("0" + recipe.duration[3]).slice(-2) + "m " + ("0" + recipe.duration[4]).slice(-2) + "s "}
            </Label>
            <Label color={recipe.difficulty == "Hard" ? "orange" : recipe.difficulty == "Medium" ? "yellow" : "green"} size="big">
                {recipe.difficulty}
            </Label>
            {!recipe.isOwner && recipe.liked ? (
                <Transition
                    animation='pulse'
                    duration={750}
                    visible={visible}
                >{loading && target === recipe.id ?
                    <Icon name="heart outline" size={"big"}></Icon> :
                    <Icon name="heart" size={"big"} color="red" onClick={() => { handleRecipeLike(recipe.id); setVisible(!visible) }}></Icon>
                    }
                </Transition>
            ) : (
                <Transition
                    animation='pulse'
                    duration={750}
                    visible={visible}
                >
                    {loading && target === recipe.id ?
                        <Icon name="heart" color="red" size={"big"}></Icon> :
                        <Icon name="heart outline" size={"big"} onClick={() => { handleRecipeLike(recipe.id); setVisible(!visible) }}></Icon>
                    }
                </Transition>
            )}
        </Segment>
    )
})