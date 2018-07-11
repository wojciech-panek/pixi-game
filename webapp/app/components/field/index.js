import { Container } from 'pixi.js';

import { Lines } from './lines';
import { Goals } from './goals';
import { Player } from '../player';
import { Ball } from './ball';
import { Loader } from '../../utils/loader';


export class Field {
  constructor({ parentStage }) {
    this.parentStage = parentStage;

    this.stage = new Container();
    this.lines = null;
    this.goals = null;

    this.playerOne = null;
    this.playerTwo = null;

    this.createLines();
    this.createGoals();
    this.createPlayers();
    this.createBall();
  }

  createBall() {
    this.ball = new Ball({ parentStage: this.parentStage });

    this.lines.stage.addChild(this.ball.stage);
  }

  createLines() {
    this.lines = new Lines({ parentStage: this.parentStage });
    this.stage.addChild(this.lines.stage);
  }

  createGoals() {
    this.goals = new Goals({ parentStage: this.lines.stage });
    this.stage.addChild(this.goals.stage);
  }

  createPlayers() {
    this.playerOne = new Player({ parentStage: this.lines.stage, texture: Loader.resources.flagPl.texture });
    this.playerTwo = new Player({ parentStage: this.lines.stage, texture: Loader.resources.flagSn.texture });

    this.lines.stage.addChild(this.playerOne.stage, this.playerTwo.stage);
  }

  loop = (delta) => {
    this.playerOne.loop(delta);
    this.playerTwo.loop(delta);
  };
}
