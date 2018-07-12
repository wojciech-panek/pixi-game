import { Graphics, Rectangle } from 'pixi.js';
import { transform, spring, interpolate, pointer, value } from 'popmotion';
import { throttle } from 'lodash';

import { updateGraphicProps } from './helpers';

const BUTTONS_COLOR = '0xff6265';
const ACTIVE_BUTTONS_COLOR = '0xd73638';

class Joystick extends Graphics {
  constructor({ onMove, deviceHeight, accessibleArea, position }) {
    super();
    this.onMove = onMove.bind(this);
    this.joystickSize = deviceHeight / 10;
    this.joystickPosition = position;
    this.joystickAccessibleArea = accessibleArea;
    this.buttonMode = true;
    this.interactive = true;
    this.hitArea = new Rectangle(- this.joystickSize, - this.joystickSize, this.joystickSize * 2, this.joystickSize * 2);
    this.addListeners();

    this.beginFill(BUTTONS_COLOR);
    this.drawCircle(0, 0, this.joystickSize);
    this.endFill();
    this.moveXY = value({ x: position.x, y: position.y }, this.handleMoveChange);
  }

  handleMoveChange = (coords) => {
    const { x, y } = coords;
    const clampXY = transform.transformMap({
      x: transform.clamp(
        this.joystickPosition.x - this.joystickAccessibleArea / 2,
        this.joystickPosition.x + this.joystickAccessibleArea / 2
      ),
      y: transform.clamp(
        this.joystickPosition.y - this.joystickAccessibleArea / 2,
        this.joystickPosition.y + this.joystickAccessibleArea / 2),
    });

    const to = clampXY({ x, y });
    Object.assign(this.transform.position, {
      x: to.x,
      y: to.y,
    });

    const moveInterpolate = transform
      .interpolate([- this.joystickAccessibleArea / 2, this.joystickAccessibleArea / 2], [-1, 1]);

    this.emitPosition({
      x: moveInterpolate(to.x - this.joystickPosition.x),
      y: moveInterpolate(to.y - this.joystickPosition.y),
    });
  }

  emitPosition = throttle((position) => {
    this.onMove(position);
  }, 30);

  handleTouchStart = () => {
    pointer(this.moveXY.get()).start(this.moveXY);
    updateGraphicProps(this, {
      'fillColor': ACTIVE_BUTTONS_COLOR,
    });
  }

  handleTouchEnd = ({ targetTouches }) => {
    if (targetTouches && targetTouches.length > 0) {
      return;
    }

    updateGraphicProps(this, {
      'fillColor': BUTTONS_COLOR,
    });

    spring({
      from: this.moveXY.get(),
      velocity: this.moveXY.getVelocity(),
      to: { x: this.joystickPosition.x, y: this.joystickPosition.y },
      stiffness: 150,
      mass: 1,
      damping: 20,
    }).start(this.moveXY);
  }

  addListeners = () => {
    this.on('mousedown', this.handleTouchStart);
    this.on('touchstart', this.handleTouchStart);
    window.addEventListener('mouseup', this.handleTouchEnd);
    window.addEventListener('touchend', this.handleTouchEnd);
    // window.on('mouseup', this.handleTouchEnd);
    // window.on('touchend', this.handleTouchEnd);
  }
}

export default Joystick;
