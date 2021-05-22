import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import Chat from './chatbox.mjs';

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

let collect, playersList, messages = [], mainPlayer;

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
            draw();
        }, 10);
    }
    else console.log(id + ' has joined the game.');


});

socket.on('update', ({collectible, players}) => initiate(collectible, players));

socket.on('new-item', ({item}) => collect = new Collectible(item));

socket.on('receive-chat', ({message}) => {
    messages = [message].concat(messages.slice(0,4))
    // initiate();
});

function initiate(collectible, players) {
    collect = new Collectible(collectible);
    playersList = Object.values(players).map(player => {
        if(player.id === socket.id) {
            mainPlayer = new Player(player);
            return mainPlayer;
        }
        else return new Player(player)
    });
}

function draw() {
    context.drawImage(backgroundImg, 0, 0);
    collect.draw(context, collectibleImg);
    // if(dialog) dialog.draw(context, mainPlayer.x, mainPlayer.y);

    for(let player of playersList) {
        player.draw(player.id === socket.id ? playerImg : playerTwo, context, player.id === socket.id ? socket : false);
        // console.log(player);
        if(player.chat != '' && player.showDialog) {
            let chat = new Chat(player.chat);
            chat.draw(context, player.x, player.y);
        }
    }

    for(let i = 0; i < messages.length; i++) {
        context.font = '12px Arial';
        context.fillStyle = '#ffffff';
        let text = messages[i][0] +': ' + messages[i][1]
        context.fillText(text, 40, 410 - i * 20);
    }

    // for(let i = 0; i < messages.length; i++) { // should only be showing latest chat of each player.... should fade after few seconds
    //     let chat = new Chat(messages[i][1]);
    //     let selected = playersList.find(player => player.id == messages[i][0]);
    //     if(selected) chat.draw(context, selected.x, selected.y);
    // }

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
    messages = [[socket.id, message]].concat(messages.slice(0,4)); // 0-------->5  latest -----> 5th latest
    mainPlayer.chat = message;
    mainPlayer.showDialog = true;
    // dialog.draw(context, mainPlayer.x, mainPlayer.y);
    socket.emit('chat', {message});
}