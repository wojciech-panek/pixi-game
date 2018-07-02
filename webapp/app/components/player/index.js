import { Container, Graphics, Sprite } from 'pixi.js';


export class Player {
  constructor({ width, height, texture, scaleX, scaleY }) {
    this.width = width;
    this.height = height;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.texture = texture;

    this.stage = new Container();
    this.sprite = null;
    this.mask = null;
    this.border = null;

    this.createStage();
    this.handleResize();
  }

  createStage() {
    this.sprite = new Sprite(this.texture);
    this.mask = new Graphics();
    this.border = new Graphics();

    this.stage.addChild(this.sprite);
    this.stage.addChild(this.mask);
    this.stage.addChild(this.border);
  }

  handleResize() {
    this.sprite.width = this.height / 60;
    this.sprite.height = this.height / 60;

    this.mask.clear();
    this.mask.beginFill(0x000000);
    this.mask.lineStyle(0);
    this.mask.drawCircle(this.sprite.width / 2, this.sprite.height / 2, this.sprite.width / 2);
    this.mask.endFill();
    this.sprite.mask = this.mask;

    this.border.clear();
    this.border.lineStyle(1, 0x000000);
    this.border.drawCircle(this.sprite.width / 2, this.sprite.height / 2, this.sprite.width / 2);

    this.stage.position.x = (this.width / 2 / this.scaleX) - this.stage.width / 2;
    this.stage.position.y = (this.height / 2 / this.scaleY) - this.stage.height / 2;
  }

  resize({ width, height, scaleX, scaleY }) {
    this.width = width;
    this.height = height;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.handleResize();
  }

  loop() {
    this.stage.position.x += (Math.random() > 0.5 ? 1 : -1) * Math.random();
    this.stage.position.y += (Math.random() > 0.5 ? 1 : -1) * Math.random();
  }
}
