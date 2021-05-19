import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const BG_COLOUR = '#231f20';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

socket.on('welcome', data => {
    if(data.id === socket.id) console.log('Welcome, ' + data.id + ' !');
    else console.log(data.id + ' has joined the game.');
});

let player;
socket.on('gameloop', state => {    
    context.fillStyle = BG_COLOUR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    player = new Player(state[socket.id]);

    // requestAnimationFrame(init);
    for(let val of Object.values(state)) {
        context.fillStyle = '#c2c2c2';
        context.fillRect(val.x, val.y, 5, 5);
    }
});

// socket.on('new-player', state => {
//     if(state.id === socket.id) {
//         console.log('Welcome!');

//         init(state.id);
//     }
//     else {
//         console.log(state.id + ' has joined the game.');
//     }
// });

init();

function init(id) {

    document.addEventListener('keydown', movement);
}

function movement(e) {
    const {keyCode} = e;
    if(keyCode == 65 || keyCode == 37) {
        player.x -= 5;
    } //left
    if(keyCode == 68 || keyCode == 39) {
        player.x += 5;
    } //right
    if(keyCode == 87 || keyCode == 38) {
        player.y -= 5;
    } //up
    if(keyCode == 83 || keyCode == 40) {
        player.y += 5;
    } //down

    socket.emit('move', player);
}