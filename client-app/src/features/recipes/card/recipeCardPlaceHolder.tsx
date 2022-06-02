import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Card, Image, Icon, Button, Placeholder, Segment } from "semantic-ui-react";

export default observer(function RecipeCard() {
    return (
        <Card>
            <Card.Content>
                <Image
                    floated="right"
                    size="tiny"
                    src={'/assets/recipe-image-placeholder.jpg'}
                />
                <Placeholder>
                    <Placeholder.Header>
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line length="very short" />
                        <Placeholder.Line length="long" />
                    </Placeholder.Paragraph>
                </Placeholder>
                <br />
                <Card.Meta>
                    <Image size="mini" circular src={'/assets/user.png'} />
                </Card.Meta>
            </Card.Content>





            <Button attached content='Check this Recipe' color="green"></Button>
        </Card >
    )
})