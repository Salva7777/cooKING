import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";

export default observer(function AdminNavBar() {
    return (
        <>
            <Menu vertical>
                <Container>
                    <Menu.Item as={Link} to='admin/recipes'>
                        Recipes
                    </Menu.Item>
                    <Menu.Item>
                        Ingredients
                    </Menu.Item>
                    <Menu.Item>
                        Users
                    </Menu.Item>
                </Container>
            </Menu>
        </>
    )
}
)