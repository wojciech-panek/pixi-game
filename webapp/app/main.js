import 'babel-polyfill';
import 'normalize.css/normalize.css';

import { App } from './components/app';
import { ControllerApp } from './controller/app';
import { Loader } from './utils/loader';

Loader.load().then(() => new App({ elementId: '#app' }));
const { pathname } = window.location;

if (pathname.includes('controller')) {
  const app = new ControllerApp();
  app.render('#app');
} else {
  Loader.load().then(() => {
    const app = new App();
    app.render('#app');
  });
}
