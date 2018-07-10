import { World, Body, Circle } from 'p2';


export default class Physics {
  constructor(field) {
    this.world = new World({ gravity: [0, 0] });
    this.field = field;

    this.resize();

    this.playerOne = this.addPlayer([this.width / 2 - 10, this.height / 2]);
    this.playerTwo = this.addPlayer([this.width / 2 + 10, this.height / 2]);
  }

  addPlayer(position) {
    const player = new Body({ mass: 10, position });

    player.addShape(new Circle({ radius: 1 }));
    this.world.addBody(player);

    return player;
  }

  loop = (delta) => {
    this.world.step(1 / 60, delta, 10);
    this.bindPositions(['playerOne', 'playerTwo']);
  };

  resize = () => {
    const { width, height } = this.field.stage;

    this.width = width;
    this.height = height;
  };

  bindPositions(objectKeys) {
    objectKeys.forEach((objectKey) => {
      this.field[objectKey].stage.position.x = this[objectKey].position[0];
      this.field[objectKey].stage.position.y = this[objectKey].position[1];
    });
  }
}
