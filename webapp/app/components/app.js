import { Application } from 'pixi.js';

import { Field } from './field';
import { Background } from './background';
import { EventEmitter } from '../utils/eventEmitter';
import Physics from './physics';


export class App {
  constructor() {
    this.app = null;
    this.field = null;

    this.create();
    this.addListeners();
  }

  create() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
    });

    this.background = new Background({ parentStage: this.app.renderer });
    this.field = new Field({ parentStage: this.app.renderer });

    this.physics = new Physics(this.field);
    this.physics.onGoal = (which) => {
      window.alert(`Shot on ${which} goal. Reset in 3000ms`); // eslint-disable-line
      setTimeout(this.reset, 3000);
    };

    this.app.stage.addChild(this.background.stage, this.field.stage);

    this.app.ticker.add(this.field.loop);
    this.app.ticker.add(this.physics.loop);
  }

  reset = () => {
    this.app.ticker.remove(this.physics.loop);
    this.physics = new Physics(this.field);
    this.app.ticker.add(this.physics.loop);
  }

  addListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyUp = ({ key }) => {
    switch (key) {
      case 'ArrowUp':
        this.physics.objects.playerOne.data.direction.y = 0;
        break;
      case 'ArrowDown':
        this.physics.objects.playerOne.data.direction.y = 0;
        break;
      case 'ArrowLeft':
        this.physics.objects.playerOne.data.direction.x = 0;
        break;
      case 'ArrowRight':
        this.physics.objects.playerOne.data.direction.x = 0;
        break;
      case ' ':
        this.physics.objects.playerOne.data.shot = true;
        break;
    }
  };

  handleKeyDown = ({ key }) => {
    switch (key) {
      case 'ArrowUp':
        this.physics.objects.playerOne.data.direction.y = -1;
        break;
      case 'ArrowDown':
        this.physics.objects.playerOne.data.direction.y = 1;
        break;
      case 'ArrowLeft':
        this.physics.objects.playerOne.data.direction.x = -1;
        break;
      case 'ArrowRight':
        this.physics.objects.playerOne.data.direction.x = 1;
        break;
    }
  };

  handleResize = () => {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    EventEmitter.emit('resize');
  };

  render(elementId) {
    document.querySelector(elementId).appendChild(this.app.view);
  }
}
