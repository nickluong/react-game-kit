import React, { Component } from "react";

import Intro from "./intro";
import Game from "./game";

export default class Presentation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameState: 0,
      slideIndex: 0
    };
  }

  render() {
    this.gameStates = [
      <Intro onStart={this.handleStart} />,
      <Game onLeave={this.handleLeave} />
    ];
    return this.gameStates[this.state.gameState];
  }

  handleStart = () => {
    this.setState({
      gameState: 1
    });
  };

  handleDone = () => {
    this.setState({
      gameState: 1
    });
  };

  handleLeave = index => {
    this.setState({
      gameState: 2,
      slideIndex: index
    });
  };
}
