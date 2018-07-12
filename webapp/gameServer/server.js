
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const Game = require('./game');

const app = express();
const server = new http.Server(app);
const io = socketIO(server);
const port = process.env.PORT ? process.env.PORT : 8181;

app.use(cors({ origin: 'http://10.100.1.105:4000', credentials: true }));

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  return new Game(io);
});
