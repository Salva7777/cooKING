import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Table, Image, Icon, Item, Label, List, Button, ButtonGroup } from "semantic-ui-react";
import agent from "../../../app/api/agent";
import { Profile } from "../../../app/models/profile";
import { useStore } from "../../../app/stores/store";


interface Props {
    profile: Profile
}

export default observer(function AdminprofileTableItem({ profile }: Props) {
    const { userStore } = useStore();
    const { user } = userStore;
    return (
        <Table.Row>
            <Table.Cell>
                <Image size="mini" centered rounded src={profile.image || '/assets/user.png'} />
            </Table.Cell>
            <Table.Cell textAlign="left">
                {profile.username}
            </Table.Cell>
            <Table.Cell textAlign="left">
                {profile.displayName}
            </Table.Cell>
            <Table.Cell textAlign="left">
                {profile.bio}
            </Table.Cell>
            <Table.Cell textAlign="left">
                {profile.recipesCount}
            </Table.Cell>
            <Table.Cell textAlign="left">
                {profile.followersCount}
            </Table.Cell>
            <Table.Cell textAlign="left">
                {profile.followingCount}
            </Table.Cell>
            <Table.Cell textAlign="left">
                <Button icon
                    disabled={user?.roles.some(x => x.name !== "Admin")}
                    circular
                    basic
                    color='orange'>
                    <Icon name="pencil"></Icon></Button>
            </Table.Cell>
        </Table.Row>
    )
})