const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var ledStatus = 'OFF'

// == Johnny-Five ========
const { Board, Led } = require("johnny-five");
const board = new Board();

board.on("ready", () => {
  board.pinMode(13, board.MODES.OUTPUT);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('fromArduinoMsg', ledStatus);

  socket.on('toArduinoMsg', (msg) => {
    if (msg.toUpperCase() === 'ON') {
      board.digitalWrite(13, 1);
    } else {
      board.digitalWrite(13, 0);
    }
    ledStatus = msg.toUpperCase();
    io.emit('fromArduinoMsg', msg.toUpperCase());
  });


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

