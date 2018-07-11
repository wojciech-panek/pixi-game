import { Container, Graphics, Sprite } from 'pixi.js';

import { EventEmitter } from '../../utils/eventEmitter';


export const PLAYER_RADIUS = 4;

export class Player {
  constructor({ parentStage, texture }) {
    this.parentStage = parentStage;
    this.texture = texture;

    this.stage = new Container();
    this.sprite = null;
    this.mask = null;
    this.border = null;

    this.createStage();

    this.handleResize();
    EventEmitter.on('resize', this.handleResize);
  }

  createStage() {
    this.sprite = new Sprite(this.texture);
    this.mask = new Graphics();
    this.border = new Graphics();

    this.stage.addChild(this.sprite, this.mask, this.border);
  }

  handleResize = () => {
    this.sprite.width = PLAYER_RADIUS * 2;
    this.sprite.height = PLAYER_RADIUS * 2;

    this.mask.clear();
    this.mask.beginFill(0x000000);
    this.mask.lineStyle(0);
    this.mask.drawCircle(0, 0, PLAYER_RADIUS);
    this.mask.endFill();

    this.sprite.mask = this.mask;
    this.sprite.anchor.set(0.5, 0.5);

    this.border.clear();
    this.border.lineStyle(1, 0x000000);
    this.border.drawCircle(0, 0, PLAYER_RADIUS);
  };

  loop = () => {};
}
