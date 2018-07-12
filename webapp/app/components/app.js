import { Application } from 'pixi.js';

import { Field } from './field';
import { Background } from './background';
import { GameState } from './gameState';
import { EventEmitter } from '../utils/eventEmitter';
import Physics from './physics';

export class App {
  constructor({ elementId }) {
    this.element = document.querySelector(elementId);
    this.app = null;
    this.field = null;

    this.create();
    this.addListeners();
    this.render();
  }

  create() {
    this.app = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio,
      autoResize: true,
    });

    this.gameState = new GameState({ parentStage: this.app.renderer, reset: this.reset });
    this.background = new Background({ parentStage: this.app.renderer });
    this.field = new Field({ parentStage: this.app.renderer });
    this.physics = new Physics(this.field);

    this.app.stage.addChild(this.background.stage, this.field.stage, this.gameState.stage);

    this.app.ticker.add(this.field.loop);
    this.app.ticker.add(this.physics.loop);

    //TODO Players connection
    EventEmitter.emit('PLAYER_CONNECTED', { type: 'left' });
    EventEmitter.emit('PLAYER_CONNECTED', { type: 'right' });
    EventEmitter.on('GAME_STARTED', this.reset);
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
      case 'r':
        EventEmitter.emit('GAME_STOPPED');
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

  render = () => this.element.appendChild(this.app.view);
}
