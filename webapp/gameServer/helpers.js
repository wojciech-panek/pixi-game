const { contains, __, propEq, always, cond } = require('ramda');

const GAME = 'game';
const RED_PLAYER = 'right';
const BLUE_PLAYER = 'left';
const playersTypes = [BLUE_PLAYER, RED_PLAYER];

const isPlayerType = contains(__, playersTypes);
const getTypeById = (id, object) => cond([
  [propEq(BLUE_PLAYER, id), always(BLUE_PLAYER)],
  [propEq(RED_PLAYER, id), always(RED_PLAYER)],
  [propEq(GAME, id), always(GAME)],
])(object);

module.exports = {
  GAME,
  RED_PLAYER,
  BLUE_PLAYER,
  playersTypes,
  isPlayerType,
  getTypeById
};
