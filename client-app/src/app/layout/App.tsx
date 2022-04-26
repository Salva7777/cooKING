import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Container, Header, List } from "semantic-ui-react";
import RecipeDashBoard from "../../features/recipes/dashboard/RecipeDashboard";
import agent from "../api/agent";
import { Recipe } from '../models/recipe'
import NavBar from "./NavBar";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    agent.Recipes.list().then(Response => {
      setRecipes(Response);
    })
  }, [])
  return (<>
    <NavBar />
    <Container style={{ marginTop: '7em' }}>
      <RecipeDashBoard recipes={recipes} />
    </Container>
  </>
  );
}
export default App;
