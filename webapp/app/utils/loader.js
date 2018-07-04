import { loader } from 'pixi.js';


import groundImage from '../images/ground.png';
import goalImage from '../images/goal.png';
import flagPlImage from '../images/flags/pl.png';
import flagSnImage from '../images/flags/sn.png';

class LoaderClass {
  resources = {};

  assets = [
    { name: 'ground', path: groundImage },
    { name: 'goal', path: goalImage },
    { name: 'flagPl', path: flagPlImage },
    { name: 'flagSn', path: flagSnImage },
  ];

  load() {
    return new Promise((resolve) => {
      this.assets.forEach((asset) => loader.add(asset.name, asset.path));

      loader.load((loader, resources) => {
        Object.assign(this.resources, resources);

        resolve(resources);
      });
    });
  }
}

export const Loader = new LoaderClass();
