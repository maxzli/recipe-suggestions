import React, { Component } from 'react';


export default class About extends Component {
  render() {
    return (
      <div>
        <h3>About</h3>
        <p>A small project created by Max Li to practice creating and deploying a MERN app.</p>
        <p>To simplify the cooking decision making process, meal ideas are offered to the user in order of earliest expiration date.</p>
        <p>Suggestions are based on current food in the fridge and saved recipes.</p>
      </div>
    )
  }
}