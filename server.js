require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();
const http = require('http').createServer(app);

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

const io = socket(http);
let gameState = {
  collectible: {},
  player: {}
}; // player details, collectible

io.on('connection', client => {
  console.log('a user connected with id: ' + client.id);

  if(Object.values(gameState.collectible).length == 0) {
    gameState.collectible = {
      id: client.id,
      x: Math.floor(Math.random() * 640),
      y: Math.floor(Math.random() * 480),
      value: 10
    };
  }

  let playerDetail = {
    id: client.id,
    x: Math.floor(Math.random() * 640),
    y: Math.floor(Math.random() * 480),
    score: 0
  };

  gameState.player[client.id] = playerDetail;

  io.emit('welcome', {id: client.id});

  let interval = setInterval(() => {
    io.emit('gameloop', gameState);


  }, 100);

  client.on('move', data => {
    gameState.player[client.id] = data;
  })

  client.on('disconnect', () => {
    delete gameState.player[client.id];
    console.log(client.id + ' has disconnected');
  });
});

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
