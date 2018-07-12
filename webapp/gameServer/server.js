import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import path from 'path';

import Game from './game';


class Server {
  constructor({ elementId }) {
    this.elementId = elementId;
    this.app = express();
    // eslint-disable-next-line
    this.server = http.Server(this.app);
    this.io = socketIO(this.server);
    this.port = process.env.PORT ? process.env.PORT : 8181;
    this.dist = path.join(__dirname, '../dist');

    this.run();
  }

  run = () => {
    this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${port}`);
      return new Game(this.io);
    });
    app.use(express.static(dist));
    app.get('*', (req, res) => res.sendfile(path.join(__dirname, '../dist/index.html')));
  }
}

// eslint-disable-next-line no-new
new Server();
