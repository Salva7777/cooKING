import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Header, Tab, Grid, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileEditForm from "./ProfileEditForm";

export default observer(function ProfileAbout() {
    const { profileStore } = useStore();
    const { isCurrentUser, profile } = profileStore;
    const [editMode, setEditMode] = useState(false)

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon="user" content={`About ${profile?.displayName}`} />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width='16'>
                    {editMode ? <ProfileEditForm setEditMode={setEditMode} /> :
                    <span style={{whiteSpace:"pre-wrap", wordBreak:"break-all" }}>{profile?.bio}</span>
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})