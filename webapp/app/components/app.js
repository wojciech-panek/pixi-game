import { Application } from 'pixi.js';

import { Field } from './field';
import { Background } from './background';


export class App {
  constructor() {
    this.app = null;
    this.field = null;

    this.crateApp();
    this.addListeners();
  }

  crateApp() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    this.background = new Background({ width: this.app.renderer.width, height: this.app.renderer.height });
    this.field = new Field({ width: this.app.renderer.width, height: this.app.renderer.height });

    this.app.stage.addChild(this.background.stage);
    this.app.stage.addChild(this.field.stage);

    this.app.ticker.add((delta) => this.field.loop(delta));
  }

  addListeners() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.field.resize({ width: this.app.renderer.width, height: this.app.renderer.height });
    this.background.resize({ width: this.app.renderer.width, height: this.app.renderer.height });
  };

  render(elementId) {
    document.querySelector(elementId).appendChild(this.app.view);
  }
}
