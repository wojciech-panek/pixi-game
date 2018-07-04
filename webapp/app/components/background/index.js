import { Container, extras } from 'pixi.js';

import { Loader } from '../../utils/loader';
import { EventEmitter } from '../../utils/eventEmitter';


export class Background {
  constructor({ parentStage }) {
    this.parentStage = parentStage;

    this.stage = new Container();
    this.sprite = null;

    this.createStage();

    this.handleResize();
    EventEmitter.on('resize', this.handleResize)
  }

  createStage() {
    this.sprite = new extras.TilingSprite(Loader.resources.ground.texture);

    this.stage.addChild(this.sprite);
  }

  handleResize = () => {
    this.sprite.width = this.parentStage.width;
    this.sprite.height = this.parentStage.height;
  };
}
