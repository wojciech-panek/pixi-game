import { Container, Graphics } from 'pixi.js';
import machina from 'machina';
import { value, tween } from 'popmotion';
import { EventEmitter } from '../../utils/eventEmitter';
import { WaitingIndicator } from './waitingIndicator';
import { StartButton } from './startButton';
import { Goal } from './goal';
import { Points } from './points';

export const WAITING_STATE = 'waiting';
export const READY_STATE = 'ready';
export const IN_PROGRESS_STATE = 'in_progress';

export const LEFT_PLAYER = 'left';
export const RIGHT_PLAYER = 'right';

const BLEND_ACTIVE_OPACITY = 1;
const BLEND_INACTIVE_OPACITY = 0;

const GOAL_EVENT = 'GOAL';
const PLAYER_CONNECTED_EVENT = 'PLAYER_CONNECTED';
const PLAYER_DISCONNECTED_EVENT = 'PLAYER_DISCONNECTED';
const GAME_STARTED_EVENT = 'GAME_STARTED';
const GAME_STOPPED_EVENT = 'GAME_STOPPED';

export class GameState {
  constructor({ parentStage, reset }) {
    this.reset = reset;
    this.parentStage = parentStage;
    this._players = {
      [LEFT_PLAYER]: {
        connected: false,
        points: 0,
      },
      [RIGHT_PLAYER]: {
        connected: false,
        points: 0,
      },
    };

    this.points = new Points({ parentStage: this.parentStage });
    this.goal = new Goal({ parentStage: this.parentStage, reset: this.reset });
    this.stage = new Container();
    this.blend = new Graphics();
    this.startButton = new StartButton({ parentStage: this.parentStage, onClick: this.handleStartClick });
    this.waitingIndicator = new WaitingIndicator({ parentStage: this.parentStage });

    this.stage.addChild(this.blend, this.points.stage, this.waitingIndicator.stage, this.startButton.stage, this.goal.stage);

    this.drawBlend();
    this.blendAlpha = value(0, this.handleBlendAlpha);

    this._state = new machina.Fsm({
      initialState: WAITING_STATE,
      states: {
        [WAITING_STATE]: {
          _onEnter: this.handleWaitingStateEnter,
        },
        [READY_STATE]: {
          _onEnter: this.handleReadyStateEnter,
        },
        [IN_PROGRESS_STATE]: {
          _onEnter: this.handleInProgressStateEnter,
        },
      },
    });

    EventEmitter.on(PLAYER_CONNECTED_EVENT, this.handlePlayerConnected);
    EventEmitter.on(PLAYER_DISCONNECTED_EVENT, this.handlePlayerDisconnected);
    EventEmitter.on(GOAL_EVENT, this.handleGoal);
    EventEmitter.on(GAME_STOPPED_EVENT, this.handleGameStopped);
  }

  handleGoal = ({ type }) => {
    this.goal.show();
    this.incrementPoints(type);
    this.points.updatePoint({ type, points: this._players[type].points });
  }

  handleGameStopped = () => this.changeGameState(READY_STATE);

  handleStartClick = () => this.changeGameState(IN_PROGRESS_STATE);

  handleInProgressStateEnter = () => {
    this.startButton.animateOut();

    setTimeout(() => {
      this.fadeOutBlend();
      this.waitingIndicator.fadeOut();
    }, 1800);

    setTimeout(() => {
      EventEmitter.emit(GAME_STARTED_EVENT);
    }, 2500);
  }

  handlePlayerDisconnected = (data) => {
    this._players[data.type].connected = false;
    this.waitingIndicator.playerDisconnected(data);
    this.changeGameState(WAITING_STATE);
  }

  handlePlayerConnected = (data) => {
    this.waitingIndicator.playerConnected(data);
    this._players[data.type].connected = true;

    if (this.checkIsGameReady()) {
      this.changeGameState(READY_STATE);
    }
  }

  handleBlendAlpha = alpha => (this.blend.alpha = alpha);

  fadeInBlend = () => tween({ from: this.blendAlpha.get(), to: BLEND_ACTIVE_OPACITY })
    .start(this.blendAlpha);

  fadeOutBlend = () => tween({ from: this.blendAlpha.get(), to: BLEND_INACTIVE_OPACITY })
    .start(this.blendAlpha);

  drawBlend = () => this.blend
    .beginFill(0xFFFFFF)
    .drawRect(0, 0, window.innerWidth, window.innerHeight)
    .endFill();

  handleWaitingStateEnter = () => {
    this.fadeInBlend();
    this.waitingIndicator.fadeIn();
    this.startButton.animateOut();
  }

  handleReadyStateEnter = () => {
    this.points.reset();
    this.fadeInBlend();
    this.waitingIndicator.fadeIn(false);
    this.startButton.animateIn();

    this._players[LEFT_PLAYER].points = 0;
    this._players[RIGHT_PLAYER].points = 0;
  }

  incrementPoints = player => (this._players[player].points++);

  changeGameState = state => this.state.transition(state);

  checkIsGameReady = () => this._players[LEFT_PLAYER].connected && this._players[RIGHT_PLAYER].connected;

  get state() {
    return this._state;
  }

  get currentState() {
    return this.state.state;
  }
}
