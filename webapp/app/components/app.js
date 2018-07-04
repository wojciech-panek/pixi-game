import { Application } from 'pixi.js';

import { Field } from './field';
import { Background } from './background';
import { EventEmitter } from '../utils/eventEmitter';


export class App {
  constructor() {
    this.app = null;
    this.field = null;

    this.crate();
    this.addListeners();
  }

  crate() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    this.background = new Background({ parentStage: this.app.renderer });
    this.field = new Field({ parentStage: this.app.renderer });

    this.app.stage.addChild(this.background.stage, this.field.stage);

    this.app.ticker.add(this.field.loop);
  }

  addListeners() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    EventEmitter.emit('resize');
  };

  render(elementId) {
    document.querySelector(elementId).appendChild(this.app.view);
  }
}
