import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Header, Icon, Image, Item, Segment, Transition } from "semantic-ui-react";
import { OutliningSpanKind } from "typescript";
import { Recipe } from "../../../app/models/recipe";
import { useStore } from "../../../app/stores/store";

const recipeImageStyle = {
    filter: 'brightness(30%)'
};

const recipeImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white',
};



interface Props {
    recipe: Recipe
}

export default observer(function RecipeDetailedHeader({ recipe }: Props) {
    const { recipeStore: { likeRecipe, loading } } = useStore();
    const [visible, setVisible] = useState(true);

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={recipe.image} fluid style={recipeImageStyle} />
                <Segment style={recipeImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={recipe.title}
                                    style={{ maxWidth: '90%', color: 'white', wordBreak: 'break-word' }}
                                />
                                <p><Icon name="clock outline"></Icon>{(recipe.duration[1] != 0 ? recipe.duration[1] + "d " : "") + ("0" + recipe.duration[2]).slice(-2) + "h " + ("0" + recipe.duration[3]).slice(-2) + "m " + ("0" + recipe.duration[4]).slice(-2) + "s "}</p>
                                <p>{recipe.difficulty!}</p>
                                <p>
                                    Created by <strong><Link to={`/profiles/${recipe.owner?.username}`}>{recipe.owner?.displayName}</Link></strong>
                                </p>
                                {recipe.isOwner ? (
                                    <>
                                        <Button as={Link}
                                            to={`/manage/${recipe.id}`}
                                            color='orange'>
                                            Manage Recipe
                                        </Button>
                                    </>
                                ) : recipe.liked ? (
                                    <Transition
                                        animation='pulse'
                                        duration={750}
                                        visible={visible}
                                    >{loading ?
                                        <Icon name="heart outline" size={"big"}></Icon> :
                                        <Icon name="heart" size={"big"} color="red" onClick={() => { likeRecipe(); setVisible(!visible) }}></Icon>
                                        }
                                    </Transition>
                                ) : (
                                    <Transition
                                        animation='pulse'
                                        duration={750}
                                        visible={visible}
                                    >
                                        {loading ?
                                            <Icon name="heart" color="red" size={"big"}></Icon> :
                                            <Icon name="heart outline" size={"big"} onClick={() => { likeRecipe(); setVisible(!visible) }}></Icon>
                                        }
                                    </Transition>
                                )}
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {recipe.description}
            </Segment>
        </Segment.Group>
    )
})