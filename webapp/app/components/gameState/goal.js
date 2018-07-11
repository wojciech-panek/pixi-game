import { Text, Container, Graphics } from 'pixi.js';
import { Colors } from '../../utils/theme';
import { spring, value, tween } from 'popmotion';

const RADIUS = 150;

export class Goal {
  constructor({ parentStage, reset }) {
    this.reset = reset;
    this.stage = new Container();
    this.parentStage = parentStage;
    this.circle = new Graphics();
    this.stroke = new Graphics();

    this.text = new Text('GOAL!!!', {
      fill: Colors.white,
      fontSize: 48,
      fontWeight: 900,
      fontStyle: 'italic',
    });

    this.circle
      .beginFill(Colors.primary)
      .drawCircle(0, 0, RADIUS);

    this.stroke
      .lineStyle(2, Colors.secondary)
      .drawCircle(0, 0, RADIUS);

    Object.assign(this.circle.transform.position, {
      x: this.parentStage.screen.width / 2,
      y: this.parentStage.screen.height / 2,
    });

    this.circle.addChild(this.text, this.stroke);
    this.stage.addChild(this.circle);

    this.textScale = value(0, this.handleTextScale);
    this.circleScale = value(0, this.handleCircleScale);
  }

  handleTextScale = scale => {
    this.stroke.transform.scale.x = scale;
    this.stroke.transform.scale.y = scale;
    this.text.transform.scale.x = scale;
    this.text.transform.scale.y = scale;

    Object.assign(this.text.transform.position, {
      x: -this.text.width / 2,
      y: -this.text.height / 2,
    });
  }

  handleCircleScale = scale => {
    this.circle.transform.scale.x = scale;
    this.circle.transform.scale.y = scale;
  }

  show = () => {
    spring({
      stiffness: 200,
      to: 1,
      from: this.textScale.get(),
      velocity: this.textScale.getVelocity(),
    }).start(this.textScale);

    spring({
      stiffness: 400,
      to: 1,
      from: this.circleScale.get(),
      velocity: this.circleScale.getVelocity(),
    }).start(this.circleScale);

    setTimeout(() => {
      tween({
        duration: 500,
        to: 0,
        from: this.textScale.get(),
      }).start(this.textScale);

      tween({
        duration: 500,
        to: 0,
        from: this.circleScale.get(),
      }).start(this.circleScale);

      setTimeout(() => this.reset(), 300);
    }, 3000);
  }
}
