import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Segment, Table } from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import AdminProfileTableItem from "./AdminProfileTableItem";

export default observer(function AdminRecipesTable() {
    const { profileStore } = useStore();
    const { loadProfiles, profilesById } = profileStore;
    useEffect(() => {
        loadProfiles()
    }, [loadProfiles])
    return (<Table columns={5} divided="vertically" textAlign="center">
        <Table.Header>
            <Table.HeaderCell>Photo</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Username</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Display name</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Bio</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Recipes</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Followers</Table.HeaderCell>
            <Table.HeaderCell textAlign="left">Following</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
        </Table.Header>
        {profilesById.map((profile) =>
            <AdminProfileTableItem profile={profile} key={profile.username} />
        )}
    </Table>)
})