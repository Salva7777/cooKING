import { Fragment } from "react";
import { Container, Header, Segment, Image, Grid, Icon, Transition, Placeholder, Button, GridColumn } from "semantic-ui-react";

export default function RecipeListItemPlaceholder() {
    return (
        <Fragment>
            <Placeholder fluid>
                <Segment.Group>
                    <Segment style={{ minHeight: 60 }}>
                        <Placeholder>
                            <Placeholder.Header>
                                <Placeholder.Line />
                            </Placeholder.Header>
                        </Placeholder>
                    </Segment>
                    <Segment>
                        <Placeholder fluid style={{ minHeight: 518 }}>
                            <Placeholder.Image />
                        </Placeholder>
                    </Segment>
                    <Segment clearing>
                        <Grid columns={3}>
                            <GridColumn>
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line />
                                    </Placeholder.Header>
                                </Placeholder>
                            </GridColumn>
                            <GridColumn>
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line />
                                    </Placeholder.Header>
                                </Placeholder>
                            </GridColumn>
                            <GridColumn>
                                <Icon name="heart outline" size={"big"} ></Icon>
                            </GridColumn>
                        </Grid>
                    </Segment>
                </Segment.Group>
            </Placeholder>
        </Fragment>
    )
}