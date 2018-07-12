import { Graphics, Rectangle } from 'pixi.js';

import { BUTTONS_COLOR, ACTIVE_BUTTONS_COLOR } from './app';
import { updateGraphicProps } from './helpers';

class Button extends Graphics {
  constructor({ onKick, buttonSize, position }) {
    super();
    this.onKick = onKick;
    this.buttonMode = true;
    this.interactive = true;
    this.hitArea = new Rectangle(0, 0, buttonSize, buttonSize);
    this.addListeners();

    this.beginFill(BUTTONS_COLOR);
    this.drawRoundedRect(0, 0, buttonSize, buttonSize, 20);
    this.endFill();
    this.position.set(position.x, position.y);
    this.pivot.set(buttonSize / 2, buttonSize / 2);
    this.rotation = Math.PI * 2 * 0.125;
  }

  addListeners = () => {
    this.on('tap', this.handleClick);
    this.on('click', this.handleClick);
    this.on('mousedown', this.handleTouchStart);
    this.on('touchstart', this.handleTouchStart);
    this.on('mouseup', this.handleTouchEnd);
    this.on('touchend', this.handleTouchEnd);
  }

  handleClick = (e) => {
    e.stopPropagation();
    this.onKick();
  }

  handleTouchStart = () => {
    updateGraphicProps(this, {
      'fillColor': ACTIVE_BUTTONS_COLOR,
    });
  }

  handleTouchEnd = (e) => {
    e.stopPropagation();
    updateGraphicProps(this, {
      'fillColor': BUTTONS_COLOR,
    });
  }
}

export default Button;
