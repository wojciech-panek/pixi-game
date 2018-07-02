import { Container } from 'pixi.js';
import { Lines } from './lines';
import { Goals } from './goals';
import { Player } from '../player';
import { Loader } from '../loader';


export class Field {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;

    this.stage = new Container();
    this.lines = null;
    this.goals = null;

    this.playerOne = null;
    this.playerTwo = null;

    this.createLines();
    this.createGoals();
    this.createPlayers();
  }

  createLines() {
    this.lines = new Lines({ width: this.width, height: this.height });
    this.stage.addChild(this.lines.stage);
  }

  createGoals() {
    this.goals = new Goals({
      width: this.lines.stage.width,
      height: this.lines.stage.height,
      offsetX: this.lines.stage.position.x,
      offsetY: this.lines.stage.position.y,
    });
    this.stage.addChild(this.goals.stage);
  }

  createPlayers() {
    this.playerOne = new Player({
      width: this.lines.stage.width,
      height: this.lines.stage.height,
      scaleX: this.lines.stage.scale.x,
      scaleY: this.lines.stage.scale.y,
      texture: Loader.resources.flagPl.texture,
    });
    this.playerTwo = new Player({
      width: this.lines.stage.width,
      height: this.lines.stage.height,
      scaleX: this.lines.stage.scale.x,
      scaleY: this.lines.stage.scale.y,
      texture: Loader.resources.flagSn.texture,
    });

    this.lines.stage.addChild(this.playerOne.stage);
    this.lines.stage.addChild(this.playerTwo.stage);
  }

  resize({ width, height }) {
    this.lines.resize({ width, height });
    this.goals.resize({
      width: this.lines.stage.width,
      height: this.lines.stage.height,
      offsetX: this.lines.stage.position.x,
      offsetY: this.lines.stage.position.y,
    });
    this.playerOne.resize({
      width: this.lines.stage.width,
      height: this.lines.stage.height,
      scaleX: this.lines.stage.scale.x,
      scaleY: this.lines.stage.scale.y,
    });
    this.playerTwo.resize({
      width: this.lines.stage.width,
      height: this.lines.stage.height,
      scaleX: this.lines.stage.scale.x,
      scaleY: this.lines.stage.scale.y,
    });
  }

  loop(delta) {
    this.playerOne.loop(delta);
    this.playerTwo.loop(delta);
  }
}
