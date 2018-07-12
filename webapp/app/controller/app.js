import { Application, Text, Graphics } from 'pixi.js';
import socketio from 'socket.io-client';

import { EventEmitter } from '../utils/eventEmitter';
import Joystick from './joystick';
import Button from './button';
import { PLAYER_CONNECTED } from '../components/app';

const MAIN_COLOR = '0xe3e9f5';
const SECONDARY_COLOR = '0x505161';
export const BUTTONS_COLOR = '0xff6265';
export const ACTIVE_BUTTONS_COLOR = '0xd73638';
export const CONNECTED = 'CONNECTED';
export const DISCONNECTED = 'DISCONNECTED';


export class ControllerApp {
  constructor() {
    this.app = null;
    this.text = null;
    this.deviceOrientation = window.orientation;
    this.deviceWidth = window.innerWidth;
    this.deviceHeight = window.innerHeight;
    this.status = null;

    this.crate();
    this.addListeners();
    this.addSocket();
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
      onMove: this.onMove,
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
      onKick: this.onKick,
      buttonSize: this.deviceHeight / 4,
      position: {
        x: this.deviceWidth * 3 / 4,
        y: this.deviceHeight / 2,
      } });
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

  addSocket = () => {
    this.socket = socketio(`${window.location.hostname}:8181`);
    this.socket.on('connect', this.handleConnect);
    this.socket.on('disconnect', this.handleDisconnect);
  }

  handleDisconnect = () => { this.status = DISCONNECTED; }

  handleConnect = () => {
    this.status = CONNECTED;
    this.socket.emit(PLAYER_CONNECTED, { type: 'left' });
  }

  onMove = ({ x, y }) => {
    this.socket.emit('move', { x, y });
  }

  onKick = () => {
    this.socket.emit('kick');
  }

  render(elementId) {
    document.querySelector(elementId).appendChild(this.app.view);
  }
}
