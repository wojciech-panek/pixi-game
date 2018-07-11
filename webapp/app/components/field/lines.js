import { Container, Graphics } from 'pixi.js';

import { EventEmitter } from '../../utils/eventEmitter';


export const FIELD_RELATIVE_WIDTH = 315;
export const FIELD_RELATIVE_HEIGHT = 210;
export const BOX_RELATIVE_WIDTH = 49.5;
export const BOX_RELATIVE_HEIGHT = 120;

const FIELD_MARGIN_X = 200;
const FIELD_MARGIN_Y = 50;

export class Lines {
  constructor({ parentStage }) {
    this.parentStage = parentStage;

    this.stage = new Container();
    this.graph = null;

    this.createStage();

    this.handleResize();
    EventEmitter.on('resize', this.handleResize)
  }

  createStage() {
    this.graph = new Graphics();

    this.stage.addChild(this.graph);

    this.graph.lineStyle(1, 0xffffff);

    this.graph
      .moveTo(0, 0)
      .lineTo(FIELD_RELATIVE_WIDTH, 0)
      .lineTo(FIELD_RELATIVE_WIDTH, FIELD_RELATIVE_HEIGHT)
      .lineTo(0, FIELD_RELATIVE_HEIGHT)
      .lineTo(0, 0);

    this.graph
      .moveTo(FIELD_RELATIVE_WIDTH / 2, 0)
      .lineTo(FIELD_RELATIVE_WIDTH / 2, FIELD_RELATIVE_HEIGHT);

    this.graph
      .drawCircle(FIELD_RELATIVE_WIDTH / 2, FIELD_RELATIVE_HEIGHT / 2, 27);

    this.graph
      .moveTo(0, (FIELD_RELATIVE_HEIGHT - BOX_RELATIVE_HEIGHT) / 2)
      .lineTo(BOX_RELATIVE_WIDTH, (FIELD_RELATIVE_HEIGHT - BOX_RELATIVE_HEIGHT) / 2)
      .lineTo(BOX_RELATIVE_WIDTH, (FIELD_RELATIVE_HEIGHT + BOX_RELATIVE_HEIGHT) / 2)
      .lineTo(0, (FIELD_RELATIVE_HEIGHT + BOX_RELATIVE_HEIGHT) / 2);

    this.graph
      .moveTo(FIELD_RELATIVE_WIDTH, (FIELD_RELATIVE_HEIGHT - BOX_RELATIVE_HEIGHT) / 2)
      .lineTo(FIELD_RELATIVE_WIDTH - BOX_RELATIVE_WIDTH, (FIELD_RELATIVE_HEIGHT - BOX_RELATIVE_HEIGHT) / 2)
      .lineTo(FIELD_RELATIVE_WIDTH - BOX_RELATIVE_WIDTH, (FIELD_RELATIVE_HEIGHT + BOX_RELATIVE_HEIGHT) / 2)
      .lineTo(FIELD_RELATIVE_WIDTH, (FIELD_RELATIVE_HEIGHT + BOX_RELATIVE_HEIGHT) / 2);

    this.graph.beginFill(0xffffff);
    this.graph.drawCircle(FIELD_RELATIVE_WIDTH / 2, FIELD_RELATIVE_HEIGHT / 2, 1);
    this.graph.drawCircle(33, FIELD_RELATIVE_HEIGHT / 2, 1);
    this.graph.drawCircle(282, FIELD_RELATIVE_HEIGHT / 2, 1);
    this.graph.endFill();
  }

  handleResize = () => {
    const { width: parentWidth, height: parentHeight } = this.parentStage;
    const widthScale = (parentWidth - FIELD_MARGIN_X) / this.stage.width * this.stage.scale.x;
    const heightScale = (parentHeight - FIELD_MARGIN_Y) / this.stage.height * this.stage.scale.y;

    this.stage.scale.set(Math.min(widthScale, heightScale), Math.min(widthScale, heightScale));

    this.stage.position.set(parentWidth / 2 - this.stage.width / 2, parentHeight / 2 - this.stage.height / 2);
  };
}
