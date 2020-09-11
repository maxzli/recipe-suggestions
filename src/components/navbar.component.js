import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <NavLink exact={true} to="/suggestions/" className="navbar-brand">
            <img src={require("../foodlogo.svg")} width="30" height="30" class="d-inline-block align-top" alt="" /> Recipe Suggestions</NavLink>
        <div className="navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <NavLink to="/suggestions/" className="nav-link">Suggestions</NavLink>
          </li>
          <li className="navbar-item">
          <NavLink to="/foods/add/" className="nav-link">Fridge</NavLink>
          </li>
          <li className="navbar-item">
          <NavLink to="/recipes/add/" className="nav-link">Recipes</NavLink>
          </li>
          <li className="navbar-item">
          <NavLink to="/about/" className="nav-link">About</NavLink>
          </li>
        </ul>
        </div>
      </nav>
    );
  }
}