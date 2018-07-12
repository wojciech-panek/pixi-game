import { Container, Graphics, Text } from 'pixi.js';
import { Colors } from '../../utils/theme';

const pointsText = {
  fontFamily: 'Open Sans',
  fontSize: 48,
  fill: Colors.white,
  fontWeight: 900,
};

export class Points {
  constructor({ parentStage }) {
    this.parentStage = parentStage;
    this.stage = new Container();
    this.leftPointsText = new Text('0', pointsText);
    this.rightPointsText = new Text('0', pointsText);

    Object.assign(this.leftPointsText.transform.position, {
      x: 50,
      y: this.parentStage.screen.height / 2 - this.leftPointsText.height / 2,
    });

    Object.assign(this.rightPointsText.transform.position, {
      x: this.parentStage.screen.width - 50 - this.rightPointsText.width,
      y: this.parentStage.screen.height / 2 - this.rightPointsText.height / 2,
    });

    this.stage.addChild(this.leftPointsText, this.rightPointsText);
  }

  reset = () => {
    this.leftPointsText.text = '0';
    this.rightPointsText.text = '0';
  }

  updatePoint = ({ type, points }) => {
    if (type === 'left') {
      this.leftPointsText.text = points.toString();
      return;
    }

    this.rightPointsText.text = points.toString();
  }
}
