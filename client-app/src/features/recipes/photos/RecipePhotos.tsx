import { observer } from "mobx-react-lite";
import { SyntheticEvent, useEffect, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button, GridColumn } from "semantic-ui-react";
import { setSyntheticTrailingComments } from "typescript";
import PhotoUploadWidget from "../../../app/common/imageUpload/PhotoUploadWidget";
import { Recipe } from "../../../app/models/recipe";
import { Photo } from "../../../app/models/profile";
import { useStore } from "../../../app/stores/store";
import { useParams } from "react-router-dom";



export default observer(function RecipePhotos() {
    const { recipeStore: { loadRecipe, loading, uploading, uploadPhoto, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('')
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<Recipe>(new Recipe());
    useEffect(() => {
        if (id) loadRecipe(id).then(recipe => setRecipe(new Recipe(recipe)))
    }, [id, loadRecipe, recipe]);

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='image' content='Photos' />
                    {recipe.isOwner && (
                        <Button floated='right' basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <GridColumn>
                            <Card.Group itemsPerRow={5}>

                                {recipe?.photos?.map(photo => (
                                    <Card key={photo.id}>
                                        <Image src={photo.url} />
                                        {recipe.isOwner && (
                                            <Button.Group fluid widths={2}>
                                                <Button
                                                    basic
                                                    color='green'
                                                    content='Main'
                                                    name={photo.id}
                                                    disabled={photo.isMain}
                                                    loading={target === photo.id && loading}
                                                    onClick={e => handleSetMainPhoto(photo, e)}
                                                />
                                                <Button
                                                    basic
                                                    color='red'
                                                    icon='trash'
                                                    name={photo.id + "delete"}
                                                    disabled={photo.isMain || loading}
                                                    loading={target === photo.id + "delete" && loading}
                                                    onClick={e => handleDeletePhoto(photo, e)}
                                                />
                                            </Button.Group>
                                        )}
                                    </Card>
                                ))}
                            </Card.Group>
                        </GridColumn>
                    )}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    )
})