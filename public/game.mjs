import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const BG_COLOUR = '#231f20';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let mainPlayer;
socket.on('welcome', data => {
    if(data.id === socket.id) {
        console.log('Welcome, ' + data.id + ' !');
        mainPlayer = new Player(data);
        socket.emit('newplayer', data);
    }    
    else console.log(data.id + ' has joined the game.');
});

let players = [],
    collectible;

socket.on('gameloop', state => {
    collectible = new Collectible(state.collectible);
    players = Object.values(state.players).map(player => new Player(player));

    init();

    collectible.draw(context);

    for(let player of players) player.draw(context, player.id === socket.id ? true: false);

});

init();

function init() {
    context.fillStyle = BG_COLOUR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    document.addEventListener('keydown', mainPlayer.keydown);
    // document.addEventListener('keyup', mainPlayer.keyup);
}