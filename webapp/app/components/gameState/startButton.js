import { Container, Graphics, Circle, Text } from 'pixi.js';
import { value, tween, spring} from 'popmotion';
import { Colors } from '../../utils/theme';

const RADIUS = 100 / 1.5;

export class StartButton {
  constructor({ onClick, parentStage }) {
    this.onClick = onClick;
    this.stage = new Container();
    this.parentStage = parentStage;

    this.stage.position = {
      x: this.parentStage.screen.width / 2,
      y: this.parentStage.screen.height / 2,
    };

    this.text = new Text('START', {
      fontSize: 14,
      fill: Colors.white,
      fontWeight: 900,
    });
    this.text.transform.position.x = -this.text.width / 2;
    this.text.transform.position.y = -this.text.height / 2;
    this.touchableArea = new Graphics();
    this.circle = new Graphics();
    this.stroke = new Graphics();

    this.touchableArea.drawCircle(0, 0, RADIUS * 5);
    this.circle
      .beginFill(Colors.primary)
      .drawCircle(0, 0, RADIUS);

    this.circle.addChild(this.text);
    this.stage.addChild(this.touchableArea, this.circle, this.stroke);

    this.strokeLength = value(0, this.handleStrokeLength);
    this.circleScale = value(0, this.handleCircleScale);
    this.touchableArea.buttonMode = true;
    this.touchableArea.hitArea = new Circle(0, 0, RADIUS * 5);

    this.moveXY = value({ x: 0, y: 0 }, this.handleMoveXY);
    this.moveXYDelayed = value({ x: 0, y: 0 }, this.handleMoveXYDelayed);
  }

  handleMoveXY = coords => Object.assign(this.circle.transform.position, coords);
  handleMoveXYDelayed = coords => Object.assign(this.stroke.transform.position, coords);

  handlePointerOver = () => {
    this.touchableArea.on('pointermove', this.handlePointerMove);
    this.touchableArea.on('pointerout', this.handlePointerOut);
  }

  handlePointerOut = () => {
    this.touchableArea.off('pointermove', this.handlePointerMove);
    const config = {
      stiffness: 20,
      to: { x: 0, y: 0 },
    };

    spring({
      ...config,
      from: this.moveXY.get(),
      velocity: this.moveXY.getVelocity(),
    }).start(this.moveXY);

    spring({
      ...config,
      from: this.moveXYDelayed.get(),
      velocity: this.moveXYDelayed.getVelocity(),
      mass: 2,
    }).start(this.moveXYDelayed);
  }

  handlePointerMove = (e) => {
    const config = {
      stiffness: 20,
      to: this.touchableArea.toLocal(e.data.global),
    };

    spring({
      ...config,
      from: this.moveXY.get(),
      velocity: this.moveXY.getVelocity(),
    }).start(this.moveXY);

    spring({
      ...config,
      from: this.moveXYDelayed.get(),
      velocity: this.moveXYDelayed.getVelocity(),
      mass: 2,
    }).start(this.moveXYDelayed);
  }

  animateIn = () => {
    tween({
      from: this.strokeLength.get(),
      to: 2,
      duration: 1500,
    }).start(this.strokeLength);

    tween({
      from: this.circleScale.get(),
      to: 1,
      duration: 1500,
    }).start(this.circleScale);

    this.touchableArea.interactive = true;
    this.touchableArea.on('pointerover', this.handlePointerOver);
    this.touchableArea.on('click', this.onClick);
  }

  animateOut = () => {
    tween({
      from: this.strokeLength.get(),
      to: 0,
      duration: 1500,
    }).start(this.strokeLength);

    tween({
      from: this.circleScale.get(),
      to: 0,
      duration: 1500,
    }).start(this.circleScale);

    this.touchableArea.interactive = false;
    this.touchableArea.off('pointerover', this.handlePointerOver);
    this.touchableArea.off('click', this.onClick);
  }

  handleCircleScale = scale => {
    this.circle.transform.scale.x = scale;
    this.circle.transform.scale.y = scale;
  }

  handleStrokeLength = length => this.stroke
    .clear()
    .lineStyle(2, Colors.secondary)
    .arc(0, 0, RADIUS, 0, Math.PI * length);
}
