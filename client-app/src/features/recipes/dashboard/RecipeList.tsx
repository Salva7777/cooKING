import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";
import RecipeDetails from "../details/RecipeDetails";
interface Props {
    recipes: Recipe[]
}
export default function RecipeList({ recipes }: Props) {
    let tags = ["lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem", "lorem",]
    return (
        <Segment>
            <Item.Group divided>
                {recipes.map((recipe, index) => (
                    <Item key={recipe.id}>
                        <Item.Image src="https://react.semantic-ui.com/images/wireframe/image.png" alt="recipe image" size="small" />
                        <Item.Content>
                            <Item.Header as='a'>{recipe.title}</Item.Header>
                            <Item.Meta>By: {"recipe.owner"}</Item.Meta>
                            <Item.Description>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus aperiam quos non molestiae quaerat et consequuntur laudantium impedit quisquam, dolores sapiente. Nisi nemo laborum velit eum perspiciatis accusamus ad qui.
                            </Item.Description>
                            <Item.Extra>
                                <Button floated='right' content='Check Recipe' color='black'/>
                                {/* <RecipeDetails recipe={recipes[index]} /> */}
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}