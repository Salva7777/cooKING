import { Button, Card, Icon, Image } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";

interface Props {
    recipe: Recipe
}


export default function RecipeDetails({recipe}:Props) {
    return (
        <Card>
            <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
            <Card.Content>
                <Card.Header>{recipe.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{recipe.duration}</span>
                </Card.Meta>
                <Card.Description>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi facere omnis inventore, quos fuga repellat! Nulla animi nam veniam est aliquam id. Facilis cum eius vel tempore? Maxime, accusamus aut?
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button basic color='blue' content='edit'/>
                    <Button basic color='grey' content='cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}