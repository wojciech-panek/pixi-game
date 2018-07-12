import 'babel-polyfill';
import 'normalize.css/normalize.css';

import { App } from './components/app';
import { Server } from './server/server';
import { ControllerApp } from './controller/app';
import { Loader } from './utils/loader';

const { pathname } = window.location;

if (pathname.includes('controller')) {
  new ControllerApp().render('#app');
} else {
  Loader.load().then(() => {
    // eslint-disable-next-line no-new
    new App({ elementId: '#app' });
    // eslint-disable-next-line no-new
    new Server();
  });
}
