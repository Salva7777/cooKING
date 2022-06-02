import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Container, Header, Icon, Item, Segment } from "semantic-ui-react";
import { Recipe } from "../../../app/models/recipe";

interface Props {
    recipe: Recipe
}

export default observer(function RecipDetailedInfo({ recipe }: Props) {
    return (
        <Segment >
            <Header as={'h2'} content={"Preparation"} />
            <Item.Group>
                {recipe.preparationSteps.map(step =>
                    <Item key={step.stepNo}>
                        <Item.Content>
                            <Item.Header content={step.stepNo! + 1 + "."} />
                            <Item.Description>{step.text}</Item.Description>
                        </Item.Content>
                    </Item>
                )}
            </Item.Group>
        </Segment>
    )
})