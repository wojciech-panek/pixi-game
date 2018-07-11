import { loader } from 'pixi.js';
import FontFaceObserver from 'fontfaceobserver';

import groundImage from '../images/ground.png';
import goalImage from '../images/goal.png';
import flagPlImage from '../images/flags/pl.png';
import flagSnImage from '../images/flags/sn.png';
import ballImage from '../images/favicon.png';

class LoaderClass {
  resources = {};

  assets = [
    { name: 'ground', path: groundImage },
    { name: 'goal', path: goalImage },
    { name: 'flagPl', path: flagPlImage },
    { name: 'flagSn', path: flagSnImage },
    { name: 'ball', path: ballImage },
  ];

  constructor() {
    this.fontObserver = new FontFaceObserver('Open Sans');
  }

  load = async () => {
    await this.fontObserver.load();

    return new Promise((resolve, reject) => {
      this.assets.forEach((asset) => loader.add(asset.name, asset.path));

      loader.load((loader, resources) => {
        Object.assign(this.resources, resources);

        this.fontObserver.load().then(() => resolve(resources), reject);
      });
    });
  }
}

export const Loader = new LoaderClass();
