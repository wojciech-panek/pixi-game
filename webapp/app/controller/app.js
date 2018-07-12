import { Application, Text, Graphics, RoundedRectangle } from 'pixi.js';
import { styler, spring, listen, pointer, value } from 'popmotion';

import { EventEmitter } from '../utils/eventEmitter';
import Joystick from './joystick';
import Button from './button';

const MAIN_COLOR = '0xe3e9f5';
const SECONDARY_COLOR = '0x505161';
export const BUTTONS_COLOR = '0xff6265';
export const ACTIVE_BUTTONS_COLOR = '0xd73638';


export class ControllerApp {
  constructor() {
    this.app = null;
    this.text = null;
    this.deviceOrientation = window.orientation;
    this.deviceWidth = window.innerWidth;
    this.deviceHeight = window.innerHeight;

    this.crate();
    this.addListeners();
  }

  crate() {
    this.app = new Application({
      width: this.deviceWidth,
      height: this.deviceHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
      backgroundColor: MAIN_COLOR,
    });
    this.controllerPadding = this.deviceWidth / 20;
    this.renderStaticControllerView();

    this.renderChangeOrientationMessage();
    this.renderLeftJoystick();
    this.renderRightButton();
  }

  renderStaticControllerView = () => {
    const controllerContainerWidth = this.deviceWidth - 2 * this.controllerPadding;
    const controllerContainerHeight = this.deviceHeight - 2 * this.controllerPadding;

    this.controllerContainer = new Graphics();
    this.controllerContainer.beginFill(SECONDARY_COLOR, 1);
    this.controllerContainer.drawRoundedRect(0, 0, controllerContainerWidth, controllerContainerHeight, 20);
    this.controllerContainer.endFill();
    this.controllerContainer.position.set(this.controllerPadding, this.controllerPadding);
    this.app.stage.addChild(this.controllerContainer);

    this.joystickBorder = new Graphics();
    this.joystickBorder.lineStyle(this.deviceHeight / 40, MAIN_COLOR);  //(thickness, color)
    this.joystickBorder.drawCircle(0, 0, this.deviceHeight / 3.5);   //(x,y,radius)
    this.joystickBorder.endFill();
    this.joystickBorder.position.set(this.deviceWidth / 4, this.deviceHeight / 2);
    this.app.stage.addChild(this.joystickBorder);

    const buttonSize = this.deviceHeight / 4;
    this.buttonBorder = new Graphics();
    this.buttonBorder.lineStyle(this.deviceHeight / 20, MAIN_COLOR);
    this.buttonBorder.drawRoundedRect(0, 0, buttonSize, buttonSize, 20);
    this.buttonBorder.endFill();
    this.buttonBorder.position.set(this.deviceWidth * 3 / 4, this.deviceHeight / 2);
    this.buttonBorder.pivot.set(buttonSize / 2, buttonSize / 2);
    this.buttonBorder.rotation = Math.PI * 2 * 0.125;
    this.app.stage.addChild(this.buttonBorder);
  }

  renderLeftJoystick = () => {
    const joystick = new Joystick({
      deviceHeight: this.deviceHeight,
      accessibleArea: this.deviceHeight / 3.5,
      position: {
        x: this.deviceWidth / 4,
        y: this.deviceHeight / 2,
      } });

    this.app.stage.addChild(joystick);
  }

  renderRightButton = () => {
    const button = new Button({
      buttonSize: this.deviceHeight / 4,
      position: {
        x: this.deviceWidth * 3 / 4,
        y: this.deviceHeight / 2,
      } });
    // this.button = new Graphics();
    // this.button.beginFill(BUTTONS_COLOR);
    // this.button.drawRoundedRect(0, 0, buttonSize, buttonSize, 20);
    // this.button.endFill();
    // this.button.position.set(this.deviceWidth * 3 / 4, this.deviceHeight / 2);
    // this.button.pivot.set(buttonSize / 2, buttonSize / 2);
    // this.button.rotation = Math.PI * 2 * 0.125;
    this.app.stage.addChild(button);
  }

  renderChangeOrientationMessage = () => {
    if (this.deviceOrientation !== 90) {
      this.text = new Text('Please use Landscape Orientation', {
        fill: 'white',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: 300,
      });
      this.text.anchor.set(0.5, 0.5);
      this.text.position.set(this.deviceWidth / 2, this.deviceHeight / 2);

      // this.app.stage.addChild(this.text);
    } else {
      this.app.stage.removeChild(this.text);
    }
  }

  addListeners() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleOrientationChange);
    window.addEventListener('changedTouches', this.handleChangedTouches);
  }

  handleResize = () => {
    this.deviceWidth = window.innerWidth;
    this.deviceHeight = window.innerHeight;

    this.app.renderer.resize(this.deviceWidth, this.deviceHeight);
    EventEmitter.emit('resize');
  };

  handleOrientationChange = () => {
    this.deviceOrientation = window.orientation;

    this.renderChangeOrientationMessage();
  }

  handleChangedTouches = (e) => {
    console.log(e)
  };

  render(elementId) {
    document.querySelector(elementId).appendChild(this.app.view);
  }
}
