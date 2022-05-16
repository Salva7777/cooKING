import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Header, Icon, Segment } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";

interface Props {
    recipe: Recipe
}

export default observer(function RecipDetailedSidebar({ recipe }: Props) {
    return (
        <>
            <Segment clearing attached='top'>
                <Header content={"Ingredients"} />
                {recipe.ingredients.map(ingredient =>
                    <>
                        <Icon name="caret right"></Icon>
                        {ingredient.quantity} {ingredient.measure} <strong><Link to={`/ingredients/${ingredient.id}`}>{ingredient.name}</Link></strong>
                        <br />
                    </>
                )}
            </Segment>
        </>
    )
})