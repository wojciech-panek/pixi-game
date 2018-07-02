import { Container, extras } from 'pixi.js';
import { Loader } from '../loader';


export class Background {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;

    this.stage = new Container();
    this.sprite = null;

    this.createStage();
    this.handleResize();
  }

  createStage() {
    this.sprite = new extras.TilingSprite(Loader.resources.ground.texture);

    this.stage.addChild(this.sprite);
  }

  handleResize() {
    this.sprite.width = this.width;
    this.sprite.height = this.height;
  }

  resize({ width, height }) {
    this.width = width;
    this.height = height;
    this.handleResize();
  }
}
