import 'babel-polyfill';
import 'normalize.css/normalize.css';

import { App } from './components/app';
import { Loader } from './utils/loader';

Loader.load().then(() => new App({ elementId: '#app' }));
