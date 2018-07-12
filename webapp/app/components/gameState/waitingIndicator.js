import { Container, Graphics, Text } from 'pixi.js';
import { value, tween, easing } from 'popmotion';
import { times } from 'ramda';
import { Colors } from '../../utils/theme';

const INVISIBLE_SCALE = 1.5;
const INVISIBLE_RADIUS = 100;
const VISIBLE_RADIUS = 10;

export class WaitingIndicator {
  constructor({ parentStage }) {
    this.parentStage = parentStage;
    this.stage = new Container();
    this.lines = [];
    this.leftPlayerLine = new Graphics();
    this.rightPlayerLine = new Graphics();

    this.text = new Text('WAITING FOR PLAYERS', {
      fontFamily: 'Open Sans',
      fontSize: 12,
      fontWeight: 600,
      fill: Colors.primary,
    });

    this.generateLines();

    this.rotationValue = value(0, this.handleRotation);
    this.visibilityValues = value({
      alpha: 0,
      textAlpha: 0,
      radius: INVISIBLE_RADIUS,
      scale: INVISIBLE_SCALE,
      linesAlpha: 1,
    }, this.handleVisibilityValues);

    this.rightPlayerLineWidth = value(this.parentStage.screen.width, this.handleRightPlayerLineWidth);
    this.leftPlayerLineWidth = value(0, this.handleLeftPlayerLineWidth);

    this.stage.addChild(this.text, this.leftPlayerLine, this.rightPlayerLine);

    tween({ from: this.rotationValue.get(), to: 2 * Math.PI, duration: 4000, loop: Infinity, ease: easing.linear })
      .start(this.rotationValue);
  }

  handleLeftPlayerLineWidth = endPosition => this.leftPlayerLine
    .clear()
    .lineStyle(2, Colors.secondary)
    .moveTo(0, this.parentStage.screen.height / 2)
    .lineTo(endPosition, this.parentStage.screen.height / 2);

  handleRightPlayerLineWidth = endPosition => this.rightPlayerLine
    .clear()
    .lineStyle(2, Colors.primary)
    .moveTo(this.parentStage.screen.width, this.parentStage.screen.height / 2)
    .lineTo(endPosition, this.parentStage.screen.height / 2);

  playerConnected = ({ type }) => {
    if (type === 'left') {
      this.handleLeftPlayerConnected();
      return;
    }

    this.handleRightPlayerConnected();
  };

  playerDisconnected = ({ type }) => {
    if (type === 'left') {
      this.handleLeftPlayerDisconnected();
      return;
    }

    this.handleRightPlayerDisconnected();
  };

  handleRightPlayerConnected = () => tween({
    from: this.rightPlayerLineWidth.get(),
    to: 2 * this.parentStage.screen.width / 3,
    duration: 1000,
  }).start(this.rightPlayerLineWidth);

  handleRightPlayerDisconnected = () => tween({
    from: this.rightPlayerLineWidth.get(),
    to: this.parentStage.screen.width,
    duration: 1000,
  }).start(this.rightPlayerLineWidth);

  handleLeftPlayerConnected = () => tween({
    from: this.leftPlayerLineWidth.get(),
    to: this.parentStage.screen.width / 3,
    duration: 1000,
  }).start(this.leftPlayerLineWidth);

  handleLeftPlayerDisconnected = () => tween({
    from: this.leftPlayerLineWidth.get(),
    to: 0,
    duration: 1000,
  }).start(this.leftPlayerLineWidth);

  fadeOut = () => tween({
    from: this.visibilityValues.get(),
    to: { alpha: 0, radius: INVISIBLE_RADIUS, scale: INVISIBLE_SCALE, textAlpha: 0, linesAlpha: 0 },
    duration: 2000,
    ease: easing.easeOut,
  })
    .start(this.visibilityValues);

  fadeIn = (isWaitingForPlayers = true) => tween({
    from: this.visibilityValues.get(),
    to: {
      alpha: isWaitingForPlayers ? 1 : 0.1,
      radius: isWaitingForPlayers ? VISIBLE_RADIUS : INVISIBLE_RADIUS / 1.5,
      scale: 1,
      textAlpha: isWaitingForPlayers ? 1 : 0,
      linesAlpha: isWaitingForPlayers ? 1 : 0,
    },
    duration: 2000,
    ease: easing.easeIn,
  })
    .start(this.visibilityValues);

  handleRotation = rotation => this.lines.forEach(line => (line.transform.rotation = rotation));

  handleVisibilityValues = ({ textAlpha, radius, scale, alpha, linesAlpha }) => {
    this.text.transform.scale.x = scale;
    this.text.transform.scale.y = scale;
    this.text.alpha = textAlpha;
    this.text.position = {
      x: this.parentStage.screen.width / 2 - this.text.width / 2,
      y: this.parentStage.screen.height / INVISIBLE_SCALE - this.text.height / 2,
    };

    this.leftPlayerLine.alpha = linesAlpha;
    this.rightPlayerLine.alpha = linesAlpha;

    this.lines.forEach((line, index) => line
      .clear()
      .lineStyle(2, index % 2 === 0 ? Colors.primary : Colors.secondary, alpha)
      .arc(0, 0, radius * (index + 1), 0, Math.PI / 3));
  }

  generateLines = () => times(this.generateLine, 8);

  generateLine = index => {
    const line = new Graphics();

    this.lines.push(line);

    if (index > 0) {
      const prevLine = this.lines[index - 1];
      prevLine.addChild(line);
      return;
    }

    line.position = { x: this.parentStage.screen.width / 2, y: this.parentStage.screen.height / 2 };
    this.stage.addChild(line);
  }
}
