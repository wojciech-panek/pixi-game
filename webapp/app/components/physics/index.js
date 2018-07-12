import { World, Body, Circle, Plane, Box, Material, ContactMaterial } from 'p2';
import { Vector } from 'vector2d';
import { EventEmitter } from '../../utils/eventEmitter';

import {
  FIELD_RELATIVE_WIDTH,
  FIELD_RELATIVE_HEIGHT,
} from '../field/lines';

const FORCE_MULTIPLIER = 2000;
const LEFT_GOAL_ID = 1000;
const RIGHT_GOAL_ID = 1001;
const BALL_ID = 1002;


export default class Physics {
  constructor(field) {
    this.world = new World({ gravity: [0, 0] });
    this.world.on('beginContact', ({ bodyA, bodyB }) => {
      const ids = [bodyA.id, bodyB.id];

      if (ids.includes(BALL_ID)) {
        if (ids.includes(LEFT_GOAL_ID)) {
          EventEmitter.emit('GOAL', { type: 'right' });
        } else if (ids.includes(RIGHT_GOAL_ID)) {
          EventEmitter.emit('GOAL', { type: 'left' });
        }
      }
    });

    this.field = field;

    this.setupBoundaries();

    this.playerMaterial = new Material();
    this.ballMaterial = new Material();
    this.boundaryMaterial = new Material();

    this.world.addContactMaterial(new ContactMaterial(this.playerMaterial, this.ballMaterial, {
      friction: 1,
      restitution: 0,
    }));

    this.world.addContactMaterial(new ContactMaterial(this.boundaryMaterial, this.ballMaterial, {
      friction: 0.95,
      restitution: 1,
    }));

    this.objects = {
      playerOne: this.addPlayer([FIELD_RELATIVE_WIDTH / 2 - 10, FIELD_RELATIVE_HEIGHT / 2]),
      playerTwo: this.addPlayer([FIELD_RELATIVE_WIDTH / 2 + 10, FIELD_RELATIVE_HEIGHT / 2]),
      ball: this.addBall([FIELD_RELATIVE_WIDTH / 2, FIELD_RELATIVE_HEIGHT / 2]),
    };

    ['playerOne', 'playerTwo'].forEach(key => {
      this.objects[key].data = {
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

    player.addShape(new Circle({ radius: 4, material: this.playerMaterial }));
    this.world.addBody(player);

    return player;
  }

  addBall(position) {
    const ball = new Body({ id: BALL_ID, mass: 1, position, damping: 0.3 });

    ball.addShape(new Circle({ radius: 3, material: this.ballMaterial }));
    this.world.addBody(ball);

    return ball;
  }

  setupBoundaries() {
    const planeBoundaries = [
      new Body({ mass: 0, position: [0, 0] }),
      new Body({ mass: 0, position: [FIELD_RELATIVE_WIDTH + 15, 0], angle: Math.PI / 2 }),
      new Body({ mass: 0, position: [0, FIELD_RELATIVE_HEIGHT], angle: Math.PI }),
      new Body({ mass: 0, position: [-15, 0], angle: -Math.PI / 2 }),
    ];

    planeBoundaries.forEach(boundary => {
      boundary.addShape(new Plane({ material: this.boundaryMaterial }));
      this.world.addBody(boundary);
    });

    const boxBoundaries = [
      new Body({ mass: 0, position: [-7.5, 40] }),
      new Body({ mass: 0, position: [-7.5, 175] }),
      new Body({ mass: 0, position: [FIELD_RELATIVE_WIDTH + 7.5, 40] }),
      new Body({ mass: 0, position: [FIELD_RELATIVE_WIDTH + 7.5, 175] }),
    ];

    boxBoundaries.forEach(boundary => {
      boundary.addShape(new Box({ width: 15, height: 80, material: this.boundaryMaterial }));
      this.world.addBody(boundary);
    });

    const boxGoalBoundaries = [
      new Body({
        id: LEFT_GOAL_ID,
        collisionResponse: false,
        position: [-10.5, 157.5],
        type: Body.KINEMATIC,
      }),
      new Body({
        id: RIGHT_GOAL_ID,
        collisionResponse: false,
        position: [FIELD_RELATIVE_WIDTH + 10.5, 157.5],
        type: Body.KINEMATIC,
      }),
    ];

    boxGoalBoundaries.forEach(boundary => {
      boundary.addShape(new Box({ width: 12, height: 155, material: this.boundaryMaterial }));
      this.world.addBody(boundary);
    });
  }

  applyForces() {
    ['playerOne', 'playerTwo'].forEach(key => {
      const player = this.objects[key];

      player.applyForce([player.data.direction.x * FORCE_MULTIPLIER, player.data.direction.y * FORCE_MULTIPLIER]);
    });
  }

  checkShots() {
    ['playerOne', 'playerTwo'].forEach(key => {
      const player = this.objects[key];

      if (player.data.shot) {
        player.data.shot = false;

        const playerPosition = new Vector(...player.position);
        const ballPosition = new Vector(...this.objects.ball.position);

        if (playerPosition.distance(ballPosition) < 10) {
          const direction = ballPosition.subtract(playerPosition).normalise();

          this.objects.ball.applyImpulse(direction.mulS(60).toArray());
        }
      }
    });
  }

  loop = (delta) => {
    this.world.step(1 / 60, delta, 10);
    this.applyForces();
    this.bindPositions();
    this.checkShots();
  };

  bindPositions() {
    ['playerOne', 'playerTwo', 'ball'].forEach((key) => {
      this.field[key].stage.position.x = this.objects[key].position[0];
      this.field[key].stage.position.y = this.objects[key].position[1];
    });
  }
}
