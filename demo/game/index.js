import React, { Component } from "react";
import PropTypes from "prop-types";
import Matter from "matter-js";

import { AudioPlayer, Loop, Stage, KeyListener, World } from "../../src";

import Character from "./character";
import Level from "./level";
import Fade from "./fade";
import Obstacle from "./obstacle"

import GameStore from "./stores/game-store";
// import Obstacle from "../obstacle";

export default class Game extends Component {
  static propTypes = {
    onLeave: PropTypes.func
  };

  componentDidMount() {
    this.player = new AudioPlayer("/assets/summer.mp3", () => {
      this.stopMusic = this.player.play({
        loop: true,
        offset: 1,
        volume: 0.35
      });
    });

    this.setState({
      fade: false
    });

    this.keyListener.subscribe([
      this.keyListener.SPACE
    ]);
  }

  componentWillUnmount() {
    this.stopMusic();
    this.keyListener.unsubscribe();
  }

  render() {
    return (
      <Loop>
        <Stage style={{ background: "url('assets/stars - fast.gif')" }}>
          <World onInit={this.physicsInit}>
            <Level store={GameStore} />
            <Character
              store={GameStore}
              keys={this.keyListener}
            />
          </World>
        </Stage>
        <Fade visible={this.state.fade} />
      </Loop >
    );
  }

  physicsInit(engine) {
    const ground = Matter.Bodies.rectangle(512, 448, 1024 * 3, 64, {
      isStatic: true
    });

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true
    });

    const rightWall = Matter.Bodies.rectangle(2008, 288, 64, 576, {
      isStatic: true
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  }


  constructor(props) {
    super(props);

    this.state = {
      fade: true
    };
    this.keyListener = new KeyListener();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.context = window.context || new AudioContext();
  }
}
