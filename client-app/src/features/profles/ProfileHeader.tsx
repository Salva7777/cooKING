import { observer } from "mobx-react-lite";
import { Segment, Image, Item, GridColumn, Grid, Statistic, Button, Divider } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import FollowButton from "./FollowButton";

interface Props {
    profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
    return (
        <Grid columns={2}>
            <GridColumn>
                <Item.Group>
                    <Item>
                        {console.log(profile)}
                        <Item.Image avatar size="small" src={profile?.image || "/assets/user.png"} />
                        <Item.Content verticalAlign='middle'>
                            <Item.Header>{profile.displayName}</Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </GridColumn>
            <GridColumn>
                <Statistic.Group widths={3}>
                    <Statistic>
                        <Statistic.Value>{profile.recipesCount}</Statistic.Value>
                        <Statistic.Label>Recipes</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{profile.followersCount}</Statistic.Value>
                        <Statistic.Label>Followers</Statistic.Label>
                    </Statistic>
                    <Statistic>
                        <Statistic.Value>{profile.followingCount}</Statistic.Value>
                        <Statistic.Label>Following</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                <Divider />
                <FollowButton profile={profile} />
            </GridColumn>
        </Grid >
    )
})