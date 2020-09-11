import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {ThemeProvider} from "styled-components";
import { GlobalStyles } from "./components/globalStyles";
import { lightTheme, darkTheme } from "./components/Themes"

import {BrowserRouter as Router, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {Button} from 'react-bootstrap';


import Suggestions from "./components/suggestions.component"
import FoodOnHand from "./components/current-food.component";
import CreateRecipe from "./components/create-recipe.component";
import CreateIngredient from "./components/edit/create-ingredient.component";
import EditFood from "./components/edit/edit-food.component";
import EditIngredient from "./components/edit/edit-ingredient.component";
import About from "./components/about"

function App() {
  const [theme, setTheme] = React.useState('light');
  const themeToggler = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
}

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <NavLink exact={true} to="/recipe-suggestions/" className="navbar-brand">
            {/* <img src={require("/components/foodlogo.svg")} width="30" height="30" class="d-inline-block align-top" alt="" /> */}
             Recipe Suggestions</NavLink>
        <div className="navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <NavLink exact={true} to="/recipe-suggestions/" className="nav-link">Suggestions</NavLink>
          </li>
          <li className="navbar-item">
          <NavLink to="/recipe-suggestions/foods/add/" className="nav-link">Fridge</NavLink>
          </li>
          <li className="navbar-item">
          <NavLink to="/recipe-suggestions/recipes/add/" className="nav-link">Recipes</NavLink>
          </li>
          <li className="navbar-item">
          <NavLink to="/recipe-suggestions/about/" className="nav-link">About</NavLink>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li className="navbar-item">
          <Button onClick={themeToggler} variant="secondary">Dark Mode Toggle</Button>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
    <>
    <GlobalStyles/>
    <Router>
      {/* this is the styling from bootstrap */}
      <div className="container">
        <Navbar/>
        <br/>
        <Route path = "/recipe-suggestions/ingredients/add/" component={CreateIngredient} />
        <Route path = "/recipe-suggestions/recipes/add/" component={CreateRecipe} />
        <Route path = "/recipe-suggestions/foods/add/" component={FoodOnHand} />
        <Route path = "/recipe-suggestions/ingredients/edit/:id" component={EditIngredient} />
        <Route path = "/recipe-suggestions/foods/edit/:id" component={EditFood} />
        <Route exact={true} path = "/recipe-suggestions/" component={Suggestions} />
        <Route path = "/recipe-suggestions/about/" component={About} />
      </div>

    </Router>
    </>
    </ThemeProvider>
  );
}

export default App;