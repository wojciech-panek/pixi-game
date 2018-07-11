import { Container, Sprite } from 'pixi.js';

import { Loader } from '../../utils/loader';
import { EventEmitter } from '../../utils/eventEmitter';


export class Goals {
  constructor({ parentStage }) {
    this.parentStage = parentStage;

    this.stage = new Container();
    this.spriteLeft = null;
    this.spriteRight = null;

    this.createStage();

    this.handleResize();
    EventEmitter.on('resize', this.handleResize);
  }

  createStage() {
    this.spriteLeft = new Sprite(Loader.resources.goal.texture);
    this.spriteRight = new Sprite(Loader.resources.goal.texture);

    this.spriteLeft.anchor.set(0.5, 0.5);
    this.spriteRight.anchor.set(0.5, 0.5);

    this.stage.addChild(this.spriteLeft, this.spriteRight);
  }

  handleResize = () => {
    const { width: parentWidth, height: parentHeight, position: { x: offsetX, y: offsetY } } = this.parentStage;

    const scale = (parentHeight / 3) / this.spriteLeft.width * this.spriteLeft.scale.x;
    const borderWidth = 2;

    this.spriteLeft.scale.set(scale, scale);
    this.spriteRight.scale.set(scale, scale);

    this.spriteLeft.position.x = offsetX - borderWidth - this.spriteLeft.height / 2;
    this.spriteLeft.position.y = offsetY + parentHeight / 2;
    this.spriteLeft.rotation = -Math.PI / 2;

    this.spriteRight.position.x = offsetX + parentWidth - borderWidth + this.spriteRight.height / 2;
    this.spriteRight.position.y = offsetY + parentHeight / 2;
    this.spriteRight.rotation = Math.PI / 2;
  };
}
