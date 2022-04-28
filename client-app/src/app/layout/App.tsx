import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import HomePage from "../../features/home/HomePage";
import RecipeDashBoard from "../../features/recipes/dashboard/RecipeDashboard";
import RecipeForm from "../../features/recipes/form/RecipeForm";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import NavBar from "./NavBar";

function App() {
  const { recipeStore } = useStore();
  useEffect(() => {
    recipeStore.loadRecipes();
  }, [recipeStore])
  if (recipeStore.loadingInitial) return <LoadingComponent content='Loading app...' />
  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <Route exact path='/' component={HomePage} />
        <Route path='/recipes' component={RecipeDashBoard} />
        <Route path='/createrecipe' component={RecipeForm} />
      </Container>
    </>
  );
}
export default observer(App);
