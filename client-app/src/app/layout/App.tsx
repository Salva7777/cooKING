import { useEffect } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import NavBar from './NavBar';
import RecipeDashboard from '../../features/recipes/dashboard/RecipeDashboard';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import RecipeForm from '../../features/recipes/form/RecipeForm';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import RecipeDetails from '../../features/recipes/details/RecipeDetails';
import ProfilePage from '../../features/profles/ProfilePage';
import RecipePhotos from '../../features/recipes/photos/RecipePhotos';
import IngredientForm from '../../features/ingredients/form/IngredientForm';
import IngredientList from '../../features/ingredients/IngredientList/IngredientList';
import IngredientDetails from '../../features/ingredients/details/IngredientDetails';
import AdminDashboard from '../../features/admin/AdminDashboard';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route exact path='/admin' component={AdminDashboard} />
                <Route exact path='/recipes' component={RecipeDashboard} />
                <Route exact path='/ingredients' component={IngredientList} />
                <Route exact path='/recipes/:id' component={RecipeDetails} />
                <Route exact path='/ingredients/:id' component={IngredientDetails} />
                <Route key={location.key} path={['/createrecipe', '/managerecipe/:id']} component={RecipeForm} />
                <Route key={location.key} path={['/createingredient', '/manageingredient/:id']} component={IngredientForm} />
                <Route path={['/recipes/:id/photos']} component={RecipePhotos} />
                <Route path='/profiles/:username' component={ProfilePage} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);