import React, { Component } from "react";

export default class Leaderboard extends Component {
    render() {
        let sorted = this.props.players
        if (this.props.players.length > 1) {
            sorted = this.props.players.sort((a, b) => {
                return b.count - a.count
            })
        }
        return (
            <div className="retro">
                <h1>Leaderboard</h1>
                {sorted.map(function (player, i) {
                    return <h2>{i + 1}.  {player.name} - {player.count} Bacon</h2>
                })}
            </div>
        )
    }
}