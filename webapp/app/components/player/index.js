import { Container, Graphics, Sprite } from 'pixi.js';

import { EventEmitter } from '../../utils/eventEmitter';


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
    const { height: parentHeight, width: parentWidth, scale: { x: parentScaleX, y: parentScaleY } } = this.parentStage;
    this.sprite.width = parentHeight / 60;
    this.sprite.height = parentHeight / 60;

    this.mask.clear();
    this.mask.beginFill(0x000000);
    this.mask.lineStyle(0);
    this.mask.drawCircle(this.sprite.width / 2, this.sprite.height / 2, this.sprite.width / 2);
    this.mask.endFill();
    this.sprite.mask = this.mask;

    this.border.clear();
    this.border.lineStyle(1, 0x000000);
    this.border.drawCircle(this.sprite.width / 2, this.sprite.height / 2, this.sprite.width / 2);

    this.stage.position.x = (parentWidth / 2 / parentScaleX) - this.stage.width / 2;
    this.stage.position.y = (parentHeight / 2 / parentScaleY) - this.stage.height / 2;
  };

  loop = () => {
    this.stage.position.x += (Math.random() > 0.5 ? 1 : -1) * Math.random();
    this.stage.position.y += (Math.random() > 0.5 ? 1 : -1) * Math.random();
  };
}
