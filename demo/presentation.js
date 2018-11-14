import React, { Component } from "react";

import Intro from "./intro";
import Game from "./game";
import Leaderboard from "./leaderboard"
import About from "./about"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Presentation extends Component {
  state = {
    playing: false,
    player: []
  }

  gameStarted = () => {
    this.setState({
      playing: true
    })
  }

  handleLeave = (bacon) => {
    if (this.state.playing) {
      let prompt = window.prompt("Enter Username", "")
      let count = parseInt(document.getElementById('baconCount').innerText.split(' ')[1])
      this.setState({ playing: false, player: [...this.state.player, { name: prompt, count: count }] })
      // let data = { username: prompt, score: 10 }
      // fetch('http://localhost:3000/api/v1/games', {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json'
      //   }
      // }).then(r => r.json())
    }
  }


  render() {
    return (
      <Router>
        <div id="inDiv">
          <nav>
            <ul>
              <li><Link to="/" onClick={this.handleLeave} className="retro">Home</Link></li>
              <li><Link to="/leaderboard" onClick={this.handleLeave} className="retro">Leaderboard</Link></li>
              <li><Link to="/about" onClick={this.handleLeave} className="retro">About</Link></li>
              {/* <li><Link to="/start/" className="retro">Game</Link></li> */}
            </ul>
          </nav>
          {/* <Route path="/" exact component={Index} /> */}
          <Route path="/" exact render={(props) => {
            return <Intro onStart={this.gameStarted} {...props} />
          }} />
          <Route path="/game" render={() => {
            return <Game onLeave={this.handleLeave} />
          }} />
          <Route path="/leaderboard" render={() => {
            return <Leaderboard players={this.state.player} />
          }} />
          <Route path="/about" render={() => {
            return <About />
          }} />
        </div>
      </Router>
    )
  }
}
