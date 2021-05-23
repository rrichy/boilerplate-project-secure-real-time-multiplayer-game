require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const helmet = require('helmet');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();
const http = require('http').createServer(app);

app.use(helmet({
  hidePoweredBy: { setTo: 'PHP 7.4.3'}
}));
app.use(helmet.noCache());

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});


// socket.io initiate
const io = socket(http);
let gameState = {
  collectible: generateCollectible(),
  players: {},
  destroyed: []
}; // player details, collectible

function generateCollectible() {
  return {
    id: Date.now(),
    x: 33 + Math.floor(Math.random() * 574),
    y: 68 + Math.floor(Math.random() * 342),
    value: 10
  }
}

io.on('connection', client => {
  console.log('a user connected with id: ' + client.id);

  gameState.players[client.id] = {
    id: client.id,
    x: 33 + Math.floor(Math.random() * 574),
    y: 68 + Math.floor(Math.random() * 342),
    score: 0
  };

  io.emit('init', {id: client.id, ...gameState});
  
  client.on('player-update', ({x, y, drawing, frame}) => {
    gameState.players[client.id].x = x;
    gameState.players[client.id].y = y;
    gameState.players[client.id].drawing = drawing;
    gameState.players[client.id].frame = frame;

    client.broadcast.emit('update', gameState);
  });

  client.on('item-collected', item => {
    if(!gameState.destroyed.includes(item.id)) {
      gameState.collectible = generateCollectible();
      gameState.players[client.id].score += item.value;
      gameState.destroyed.push(item.id);
      console.log(gameState.collectible);
      
      
      io.emit('new-item', gameState);
      
    }
    // io.emit('update', gameState);
  });

  client.on('chat', ({message}) => {
    gameState.players[client.id].chat = message;
    gameState.players[client.id].showDialog = true;
    client.broadcast.emit('receive-chat', {message: [client.id, message]});
    client.broadcast.emit('update', gameState);
    setTimeout(() => {
      gameState.players[client.id].showDialog = false;
      io.emit('update', gameState);
    }, 7000);
  });

  client.on('disconnect', () => {
    delete gameState.players[client.id];
    console.log(client.id + ' has disconnected');
  });
});

// end socket.io

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = http.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
