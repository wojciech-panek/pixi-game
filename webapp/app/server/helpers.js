const { contains, __, propEq, always, cond } = require('ramda');

export const GAME = 'game';
export const RED_PLAYER = 'right';
export const BLUE_PLAYER = 'left';
export const playersTypes = [BLUE_PLAYER, RED_PLAYER];

export const isPlayerType = contains(__, playersTypes);
export const getTypeById = (id, object) => cond([
  [propEq(BLUE_PLAYER, id), always(BLUE_PLAYER)],
  [propEq(RED_PLAYER, id), always(RED_PLAYER)],
  [propEq(GAME, id), always(GAME)],
])(object);
