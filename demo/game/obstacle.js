import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import Matter from "matter-js";

import { AudioPlayer, Body, Sprite } from "../../src";

@observer
export default class Obstacle extends Component {

    static propTypes = {
        keys: PropTypes.object,
        onEnterBuilding: PropTypes.func,
        store: PropTypes.object
    };

    static contextTypes = {
        engine: PropTypes.object,
        scale: PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = {
            characterState: 0,
            loop: false,
            spritePlaying: true
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
        const { characterPosition, stageX } = this.props.store;
        const { scale } = this.context;
        const { x, y } = characterPosition;
        const targetX = x + stageX;

        return {
            position: "absolute",
            transform: `translate(${targetX * scale}px, ${y * scale}px)`,
            transformOrigin: "left top"
        };
    }

    render() {
        const x = 3000;

        return (
            <div style={this.getWrapperStyles()}>
                <Body
                    args={[x, 384, 64, 64]}
                    inertia={Infinity}
                    ref={b => {
                        this.body = b;
                    }}
                >
                    <Sprite
                        repeat={this.state.repeat}
                        onPlayStateChanged={this.handlePlayStateChanged}
                        src="assets/Rock.png"
                        scale={this.context.scale * 5}
                        state={this.state.characterState}
                        // steps={[9, 9, 0, 4, 5]}
                        tileHeight={15}
                        tileWidth={15}
                        steps={[0]}
                    />
                </Body>
            </div>
        );
    }

    handlePlayStateChanged(state) {
        this.setState({
            spritePlaying: state ? true : false
        });
    }

    move(body, x) {
        Matter.Body.setVelocity(body, { x, y: 0 });
    }

    checkKeys(shouldMoveStageLeft, shouldMoveStageRight) {
        const { keys, store } = this.props;
        const { body } = this.body;

        let characterState = 2;

        if (keys.isDown(keys.SPACE)) {
            this.jump(body);
            characterState = 0
        }

        if (keys.isDown(keys.LEFT)) {
            if (shouldMoveStageLeft) {
                store.setStageX(store.stageX + 5);
            }
            this.move(body, -5);
            characterState = 1;
        } else if (keys.isDown(keys.RIGHT) === false) {
            if (shouldMoveStageRight) {
                //store.setStageX(store.stageX - 5);
            }

            this.move(body, -5);
            characterState = 0;
        }

        this.setState({
            characterState,
            repeat: characterState < 2
        });
    }

    update() {
        const { store } = this.props;
        const { body } = this.body;

        const midPoint = Math.abs(store.stageX) + 448;

        const shouldMoveStageLeft = body.position.x < midPoint && store.stageX < 0;
        const shouldMoveStageRight =
            body.position.x > midPoint && store.stageX > -2048;

        const velY = parseFloat(body.velocity.y.toFixed(10));

        if (velY === 0) {
            this.isJumping = false;
            Matter.Body.set(body, "friction", 0.9999);
        }

        if (!this.isJumping && !this.isPunching && !this.isLeaving) {
            this.checkKeys(shouldMoveStageLeft, shouldMoveStageRight);

            store.setCharacterPosition(body.position);
        } else {
            if (this.isPunching && this.state.spritePlaying === false) {
                this.isPunching = false;
            }
            if (this.isJumping) {
                store.setCharacterPosition(body.position);
            }
            const targetX = store.stageX + (this.lastX - body.position.x);
            if (shouldMoveStageLeft || shouldMoveStageRight) {
                store.setStageX(targetX);
            }
        }

        this.lastX = body.position.x;
    }
}
