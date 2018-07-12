const helpers = require('../helpers');
const { BLUE_PLAYER, RED_PLAYER, GAME, isPlayerType, getTypeById } = helpers;

class Game {
  constructor(socket) {
    console.log('Game created.');
    this.socket = socket;
    this.socket.on('connection', this.handleClientConnection);
    this.clients = {
      [GAME]: null,
      [BLUE_PLAYER]: null,
      [RED_PLAYER]: null,
    }
  }

  handleClientConnection = (socket) => {
    const { id } = socket;
    console.log(`Client with id: ${id} connected.`);

    socket.on('disconnect', this.handleClientDisconnection(id));
    socket.on('gameConnected', this.handleGameClientConnection(socket));
    socket.on('playerConnected', this.handlePlayerConnection(socket));
    socket.on('MOVE', this.handleMove(id));
    socket.on('KICK', this.handleKick(id));
  }

  handleKick = (id) => () => {
    const type = getTypeById(id, this.clients);
    this.socket.emit('KICK', { type });
  }

  handleMove = (id) => ({ x, y }) => {
    const type = getTypeById(id, this.clients);
    console.log('MOVE', x, y, type)
    this.socket.emit('MOVE', { x, y, type });
  }

  handleClientDisconnection = (id) => () => {
    console.log(`Client with id: ${id} disconnected.`);

    const type = getTypeById(id, this.clients);

    if (isPlayerType(type)) {
      this.handlePlayerDisconnection(type);
      return;
    }

    if (type === GAME) {
      this.clients[GAME] = null;
    }
  }

  handleGameClientConnection = (socket) => () => {
    const { id } = socket;
    console.log(`Game with id: '${id}' connected.`);

    socket.join(GAME);
    this.clients[GAME] = id;
  };

  handlePlayerConnection = (socket) => ({ type }) => {
    const { id } = socket;
    console.log(`Player '${type}' with id: ${id} connected.`);

    socket.join(type);
    this.clients[type] = id;
    this.socket.emit('playerConnected', { type });
  }

  handlePlayerDisconnection = (type) => {
    console.log(`Player '${type}' disconnected.`);

    this.clients[type] = null;
    this.socket.emit('playerDisconnected', { type });
  }
}

module.exports = Game;
