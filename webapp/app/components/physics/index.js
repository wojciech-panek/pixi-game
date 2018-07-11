import { World, Body, Circle, Plane, Box } from 'p2';

import {
  FIELD_RELATIVE_WIDTH,
  FIELD_RELATIVE_HEIGHT,
} from '../field/lines';

const FORCE_MULTIPLIER = 3000;

export default class Physics {
  constructor(field) {
    this.world = new World({ gravity: [0, 0] });
    this.field = field;

    this.setupBoundaries();
    this.setupBall();

    this.players = {
      playerOne: this.addPlayer([FIELD_RELATIVE_WIDTH / 2 - 10, FIELD_RELATIVE_HEIGHT / 2]),
      playerTwo: this.addPlayer([FIELD_RELATIVE_WIDTH / 2 + 10, FIELD_RELATIVE_HEIGHT / 2]),
    };

    ['playerOne', 'playerTwo'].forEach(key => {
      this.players[key].data = {
        direction: { x: 0, y: 0 },
      };
    });
  }

  addPlayer(position) {
    const player = new Body({
      mass: 10,
      position,
      damping: 0.9,
    });

    player.addShape(new Circle({ radius: 4 }));
    this.world.addBody(player);

    return player;
  }

  setupBall() {
    this.ball = new Body({ mass: 5, position: [0, 0] });
    this.ball.addShape(new Circle({ radius: 3 }));
    this.world.addBody(this.ball);
  }

  setupBoundaries() {
    const planeBoundaries = [
      new Body({ mass: 0, position: [0, 0] }),
      new Body({ mass: 0, position: [FIELD_RELATIVE_WIDTH + 15, 0], angle: Math.PI / 2 }),
      new Body({ mass: 0, position: [0, FIELD_RELATIVE_HEIGHT], angle: Math.PI }),
      new Body({ mass: 0, position: [-15, 0], angle: -Math.PI / 2 }),
    ];

    planeBoundaries.forEach(boundary => {
      boundary.addShape(new Plane());
      this.world.addBody(boundary);
    });

    const boxBoundaries = [
      new Body({ mass: 0, position: [-7.5, 40] }),
      new Body({ mass: 0, position: [-7.5, 175] }),
      new Body({ mass: 0, position: [FIELD_RELATIVE_WIDTH + 7.5, 40] }),
      new Body({ mass: 0, position: [FIELD_RELATIVE_WIDTH + 7.5, 175] }),
    ];

    boxBoundaries.forEach(boundary => {
      boundary.addShape(new Box({ width: 15, height: 80 }));
      this.world.addBody(boundary);
    });
  }

  applyForces() {
    ['playerOne', 'playerTwo'].forEach(key => {
      const player = this.players[key];

      player.applyForce([player.data.direction.x * FORCE_MULTIPLIER, player.data.direction.y * FORCE_MULTIPLIER]);
    });
  }

  movePlayer(index, direction) {
    this[index].applyForce(direction);
  }

  loop = (delta) => {
    this.world.step(1 / 60, delta, 10);
    this.applyForces();
    this.bindPositions();
  };

  bindPositions() {
    ['playerOne', 'playerTwo'].forEach((key) => {
      this.field[key].stage.position.x = this.players[key].position[0];
      this.field[key].stage.position.y = this.players[key].position[1];
    });
  }
}
