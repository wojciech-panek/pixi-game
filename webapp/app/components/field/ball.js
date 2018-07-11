import { Container, Sprite } from 'pixi.js';

import { Loader } from '../../utils/loader';
import { EventEmitter } from '../../utils/eventEmitter';


export const BALL_RADIUS = 3;

export class Ball {
  constructor({ parentStage }) {
    this.parentStage = parentStage;

    this.stage = new Container();
    this.sprite = null;

    this.createStage();

    this.handleResize();
    EventEmitter.on('resize', this.handleResize);
  }

  createStage() {
    this.sprite = new Sprite(Loader.resources.ball.texture);
    this.sprite.anchor.set(0.5, 0.5);

    this.stage.addChild(this.sprite);
  }

  handleResize = () => {
    this.sprite.width = BALL_RADIUS * 2;
    this.sprite.height = BALL_RADIUS * 2;
  };
}
