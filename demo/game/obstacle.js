import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Matter from "matter-js";

import { AudioPlayer, Body, Sprite } from "../../src";

@observer
export default class Obstacle extends Component {

    static propTypes = {
        store: PropTypes.object
    };

    static contextTypes = {
        engine: PropTypes.object,
        scale: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = {
            deletable: false
        };

        this.update = this.update.bind(this);
    }

    componentDidMount() {
        Matter.Events.on(this.context.engine, "afterUpdate", this.update);
    }

    componentWillUnmount() {
        Matter.Events.off(this.context.engine, "afterUpdate", this.update);
    }

    getWrapperStyles() {
        const { characterPosition, baconPosition, stageX } = this.props.store;
        const { scale } = this.context;
        const { x, y } = baconPosition;
        const targetX = x + stageX;

        return {
            position: "absolute",
            transform: `translate(${targetX * scale}px, ${y}px)`,
            transformOrigin: "left top"
        };
    }

    render() {
        const x = this.props.store.baconPosition.x;
        const y = this.props.store.baconPosition.y;
        {
            if (this.state.deletable === false) {
                return (
                    <div style={this.getWrapperStyles()}>
                        <Body
                            args={[x, y, 64, 64]}
                            inertia={Infinity}
                            ref={b => {
                                this.body = b;
                            }}
                        >
                            <Sprite
                                repeat={this.state.repeat}
                                onPlayStateChanged={this.handlePlayStateChanged}
                                src="../assets/Bacon.png"
                                scale={this.context.scale * 10}
                                tileHeight={16}
                                tileWidth={16}
                                steps={[0]}
                            />
                        </Body>
                    </div>
                )
            }
        }
    }

    move(body, x) {
        Matter.Body.setVelocity(body, { x, y: 0 });
    }

    moveOff(body) {
        Matter.Body.setVelocity(body, { x: -2, y: 0 })
    }

    // checkKeys = (shouldMoveStageLeft, shouldMoveStageRight) => {
    //     const { keys, store } = this.props;
    //     const { body } = this.body;

    //     this.move(body, -5);

    //     if (shouldMoveStageLeft) {
    //         store.setStageX(store.stageX + 5);
    //     }
    //     if (keys.isDown(keys.SPACE)) {
    //         this.setState({
    //             deletable: !this.state.deletable
    //         });
    //     }

    // }

    update() {
        const { store } = this.props;
        const { body } = this.body;

        const endPoint = Math.abs(store.stageX);

        if (endPoint - body.position.x > 0) {
            this.moveOff(body);
        }

        // const shouldMoveStageLeft = body.position.x < midPoint && store.stageX < 0;
        // const shouldMoveStageRight =
        //     body.position.x > midPoint && store.stageX > -2048;

        // const velY = parseFloat(body.velocity.y.toFixed(10));

    }
}
