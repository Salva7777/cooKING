import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Image, Icon, Button } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";

interface Props {
    recipe: Recipe
}

export default observer(function RecipeCard({ recipe }: Props) {
    return (
        <Card key={recipe.id}>
            <Card.Content>
                <Image
                    floated="right"
                    size="tiny"
                    src={recipe.image || '/assets/recipe-image-placeholder.jpg'}
                />
                <Card.Header>{recipe.title}</Card.Header>
                <Card.Content>{recipe.difficulty}</Card.Content>
                <Card.Content> <Icon name="clock outline"></Icon>{(recipe.duration[1] != 0 ? recipe.duration[1] + "d " : "") + ("0" + recipe.duration[2]).slice(-2) + "h " + ("0" + recipe.duration[3]).slice(-2) + "m " + ("0" + recipe.duration[4]).slice(-2) + "s "}</Card.Content>
                <Card.Meta><Image size="mini" circular src={recipe.owner?.image || '/assets/user.png'} /> {recipe.owner?.displayName}</Card.Meta>
            </Card.Content>
            <Button attached as={Link} to={`/recipes/${recipe.id}`} content='Check this Recipe' color="green"></Button>
        </Card>
    )
})