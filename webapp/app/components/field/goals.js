import { Container, Sprite } from 'pixi.js';
import { Loader } from '../loader';


export class Goals {
  constructor({ width, height, offsetX, offsetY }) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;

    this.stage = new Container();
    this.spriteLeft = null;
    this.spriteRight = null;

    this.createStage();
    this.handleResize();
  }

  createStage() {
    this.spriteLeft = new Sprite(Loader.resources.goal.texture);
    this.spriteRight = new Sprite(Loader.resources.goal.texture);

    this.spriteLeft.anchor.x = 0.5;
    this.spriteLeft.anchor.y = 0.5;
    this.spriteRight.anchor.x = 0.5;
    this.spriteRight.anchor.y = 0.5;

    this.stage.addChild(this.spriteLeft);
    this.stage.addChild(this.spriteRight);
  }

  handleResize() {
    const scale = (this.height / 3) / this.spriteLeft.width * this.spriteLeft.scale.x;
    const borderWidth = 2;
    this.spriteLeft.scale.x = scale;
    this.spriteLeft.scale.y = scale;
    this.spriteRight.scale.x = scale;
    this.spriteRight.scale.y = scale;

    this.spriteLeft.position.x = this.offsetX - borderWidth - this.spriteLeft.height / 2;
    this.spriteLeft.position.y = this.offsetY + this.height / 2;
    this.spriteLeft.rotation = -90 * Math.PI / 180;

    this.spriteRight.position.x = this.offsetX + this.width - borderWidth + this.spriteRight.height / 2;
    this.spriteRight.position.y = this.offsetY + this.height / 2;
    this.spriteRight.rotation = 90 * Math.PI / 180;
  }

  resize({ width, height, offsetX, offsetY }) {
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.handleResize();
  }
}
