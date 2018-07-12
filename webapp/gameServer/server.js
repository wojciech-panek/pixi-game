
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const Game = require('./game');

const app = express();
const server = new http.Server(app);
const io = socketIO(this.server);
const port = process.env.PORT ? process.env.PORT : 8181;
// const dist = path.join(__dirname, '../dist');

// app.use(express.static(dist));
// app.get('*', (req, res) => res.sendfile(path.join(__dirname, '../dist/index.html')));

server.listen(this.port, () => {
  console.log(`Server is listening on port ${port}`);
  return new Game(io);
});
