import 'babel-polyfill';
import 'normalize.css/normalize.css';

import { Application } from 'pixi.js';


const app = new Application({
  width: 1280,
  height: 640,
  antialias: true,
  transparent: false,
  resolution: 1,
  backgroundColor: 0x83ff00,
});

document
  .querySelector('#app')
  .appendChild(app.view);

const basicText = new PIXI.Text('Hello World');
basicText.x = 30;
basicText.y = 90;

app.stage.addChild(basicText);
