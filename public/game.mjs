import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');


let backgroundImg = new Image();
backgroundImg.src = '../assets/lobby.png';

let collectibleImg = new Image();
    collectibleImg.src = '../assets/collectible1.png';

let playerImg = new Image();
    playerImg.src = '../assets/sans.png';

let playerTwo = new Image();
    playerTwo.src ='../assets/sans-2.png';

let collect, playersList, messages, mainPlayer;

socket.on('init', ({id, collectible, players}) => {
    if(id === socket.id) {
        console.log('Welcome, ' + id + ' !');
        mainPlayer = new Player(players[id]);
        initiate(collectible, players);

        document.onkeydown = e => {
            const { keyCode } = e;
            if(keyCode == 65 || keyCode == 37) mainPlayer.movement['left'] = true;
            if(keyCode == 68 || keyCode == 39) mainPlayer.movement['right'] = true;
            if(keyCode == 87 || keyCode == 38) mainPlayer.movement['up'] = true;
            if(keyCode == 83 || keyCode == 40) mainPlayer.movement['down'] = true;
        }

        document.onkeyup = e => {
            const { keyCode } = e;
            if(keyCode == 65 || keyCode == 37) mainPlayer.movement['left'] = false;
            if(keyCode == 68 || keyCode == 39) mainPlayer.movement['right'] = false;
            if(keyCode == 87 || keyCode == 38) mainPlayer.movement['up'] = false;
            if(keyCode == 83 || keyCode == 40) mainPlayer.movement['down'] = false;
        }
        let refresh = setInterval(() => {
            mainPlayer.collision(collect, socket);
            draw(collect, playersList);
        }, 10);
    }
    else console.log(id + ' has joined the game.');

    

});

socket.on('update', ({collectible, players, chat}) => initiate(collectible, players, chat));

function initiate(collectible, players, chat = []) {
    collect = new Collectible(collectible);
    playersList = Object.values(players).map(player => {
        if(player.id === socket.id) {
            mainPlayer = new Player(player);
            return mainPlayer;
        }
        else return new Player(player)
    });
    messages = chat; 
}

function draw(collectible, players) {
    context.drawImage(backgroundImg, 0, 0);
    collectible.draw(context, collectibleImg);

    for(let player of players) player.draw(player.id === socket.id ? playerImg : playerTwo, context, player.id === socket.id ? socket : false);

    for(let i = 0; i < messages.length; i++) {
        context.font = '12px Arial';
        context.fillStyle = '#ffffff';
        context.fillText(messages[i], 40, 410 - i * 20);
    }
}

// Adding chat system to the game

let container = document.createElement('div');
let inputbox = document.createElement('input');
inputbox.placeholder = 'Send message here';
inputbox.setAttribute('id', 'message');

let sendbutton = document.createElement('button');
sendbutton.onclick = sendMessage;
sendbutton.innerText = 'Send';

container.appendChild(document.createElement('br'));
container.appendChild(inputbox);
container.appendChild(sendbutton);

document.body.appendChild(container);

// Added interface

// Adding chat functions

function sendMessage() {
    let message = inputbox.value;
    inputbox.value = '';
    socket.emit('chat', {message});
}
/* 
ctx.font = "30px Arial";
ctx.fillText("Hello World", 10, 50);
*/