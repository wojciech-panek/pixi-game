import { Container, Graphics } from 'pixi.js';


const FIELD_MARGIN_X = 200;
const FIELD_MARGIN_Y = 50;

export class Lines {
  constructor({ width, height }) {
    this.width = width;
    this.height = height;

    this.stage = new Container();
    this.graph = null;

    this.createStage();
    this.handleResize();
  }

  createStage() {
    this.graph = new Graphics();

    this.stage.addChild(this.graph);

    this.graph.lineStyle(1, 0xffffff);

    this.graph
      .moveTo(0, 0)
      .lineTo(315, 0)
      .lineTo(315, 210)
      .lineTo(0, 210)
      .lineTo(0, 0);

    this.graph
      .moveTo(157.5, 0)
      .lineTo(157.5, 210);

    this.graph.drawCircle(157.5, 105, 27);

    this.graph
      .moveTo(0, 45)
      .lineTo(49.5, 45)
      .lineTo(49.5, 165)
      .lineTo(0, 165);

    this.graph
      .moveTo(315, 45)
      .lineTo(265.5, 45)
      .lineTo(265.5, 165)
      .lineTo(315, 165);

    this.graph.beginFill(0xffffff);
    this.graph.drawCircle(157.5, 105, 1);
    this.graph.drawCircle(33, 105, 1);
    this.graph.drawCircle(282, 105, 1);
    this.graph.endFill();
  }

  handleResize() {
    const widthScale = (this.width - FIELD_MARGIN_X) / this.stage.width * this.stage.scale.x;
    const heightScale = (this.height - FIELD_MARGIN_Y) / this.stage.height * this.stage.scale.y;

    const scale = Math.min(widthScale, heightScale);

    this.stage.scale.x = scale;
    this.stage.scale.y = scale;

    this.stage.x = this.width / 2 - this.stage.width / 2;
    this.stage.y = this.height / 2 - this.stage.height / 2;
  }

  resize({ width, height }) {
    this.width = width;
    this.height = height;
    this.handleResize();
  }
}
