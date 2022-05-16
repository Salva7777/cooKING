import { observer } from "mobx-react-lite";
import { Segment } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";

interface Props {
    recipe: Recipe
}

export default observer(function RecipDetailedInfo({ recipe }: Props) {
    return (
        <Segment>

        </Segment>
    )
})