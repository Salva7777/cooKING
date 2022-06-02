import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Checkbox, Container, Grid, GridColumn, Header, Icon, Input, Menu, Radio } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import { useStore } from "../../../app/stores/store";

export default observer(function RecipeFilters() {


    const { userStore, ingredientStore, recipeStore: { predicate, setPredicate } } = useStore();
    const { ingredientsById } = ingredientStore;
    const { isLoggedIn } = userStore;

    const [duration, setDuration] = useState(predicate.get('Duration') || 0);

    const sleep = (delay: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, delay)
        })
    }

    async function handleChange(value: any) {
        setDuration(value);
        await sleep(1000);
        setPredicate('Duration', value);
    }


    return (
        <Menu vertical size='large' style={{ width: '100%' }}>
            <Menu.Item>
                <Menu.Menu>
                    <Grid columns={2} verticalAlign='middle'>
                        <GridColumn width={9}>
                            <Header icon='filter' color='black' content='Filters'></Header>
                        </GridColumn>
                        <GridColumn width={7}>
                            <Icon link name="redo" onClick={() => (setPredicate('Reset'), setDuration(0))}>
                                <p>Restore Filters</p>
                            </Icon>
                        </GridColumn>
                    </Grid>
                </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
                <Menu.Menu>
                    <Menu.Item>
                        <Checkbox
                            disabled={!isLoggedIn}
                            toggle
                            label='Only Inventory Ingredients'
                            checked={isLoggedIn && predicate.get('HasIngredients')}
                            onClick={() => isLoggedIn && setPredicate('HasIngredients')}
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
                <Menu.Header>Difficulty</Menu.Header>
                <Menu.Menu>
                    <Menu.Item>
                        <Checkbox
                            label='Easy'
                            checked={predicate.get('Difficulty') == 'Easy'}
                            onClick={() => setPredicate('Difficulty', 'Easy')} />
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox
                            label='Medium'
                            checked={predicate.get('Difficulty') == 'Medium'}
                            onClick={() => setPredicate('Difficulty', 'Medium')} />
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox
                            label='Hard'
                            checked={predicate.get('Difficulty') == 'Hard'}
                            onClick={() => setPredicate('Difficulty', 'Hard')} />
                    </Menu.Item>
                </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
                <Menu.Header>Ingredients</Menu.Header>
                <Menu.Menu>
                    {ingredientsById.map(ingredient =>
                        <Menu.Item key={ingredient.id}
                        >
                            <Checkbox
                                label={ingredient.name}
                                checked={predicate.get('SelectedIngredients') != null ? predicate.get('SelectedIngredients').some((a: string) => a === ingredient.id) : false}
                                onClick={() => setPredicate('SelectedIngredients', ingredient.id)}
                            />
                        </Menu.Item>
                    )}
                </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
                <Menu.Header>Cautions</Menu.Header>
                <Menu.Menu>
                    <Menu.Item>
                        <Checkbox
                            label={'Veggie'}
                            checked={predicate.get('Cautions') != null ? predicate.get('Cautions').some((a: string) => a === 'Veggie') : false}
                            onClick={() => setPredicate('Cautions', 'Veggie')}
                        />
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox label={'Gluten free'}
                            checked={predicate.get('Cautions') != null ? predicate.get('Cautions').some((a: string) => a === 'GlutenFree') : false}
                            onClick={() => setPredicate('Cautions', 'GlutenFree')}
                        />
                    </Menu.Item>
                    <Menu.Item>
                        <Checkbox label={'Lactose free'}
                            checked={predicate.get('Cautions') != null ? predicate.get('Cautions').some((a: string) => a === 'LactoseFree') : false}
                            onClick={() => setPredicate('Cautions', 'LactoseFree')}
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu.Item>
            <Menu.Item>
                <Menu.Header>Time</Menu.Header>
                <Menu.Menu>
                    <Menu.Item>
                        <p>
                            Minutes {duration == 60 ? ' > ' + duration : duration == 0 ? ' > ' + duration : ' < ' + duration}
                        </p>
                        <Input
                            min={0}
                            max={60}
                            name='duration'
                            onChange={(e) => handleChange(e.currentTarget['value'])}
                            step={5}
                            type='range'
                            value={duration}>
                        </Input>
                    </Menu.Item>
                </Menu.Menu>
            </Menu.Item>
        </Menu >
    )
})