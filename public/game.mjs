import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import { chatHandler, Chat } from "./chatbox.mjs";
import Keypress from "./keypress.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

let backgroundImg = new Image();
backgroundImg.src = "../assets/lobby.png";

let collectibleImg = new Image();
collectibleImg.src = "../assets/collectible1.png";

let playerImg = new Image();
playerImg.src = "../assets/sans.png";

let playerTwo = new Image();
playerTwo.src = "../assets/sans-2.png";

// const dialogBoxes = [
//   "../assets/chatbox/chat-s-tl.png",
//   "../assets/chatbox/chat-s-tr.png",
//   "../assets/chatbox/chat-s-bl.png",
//   "../assets/chatbox/chat-s-br.png",
//   "../assets/chatbox/chat-l-tl.png",
//   "../assets/chatbox/chat-l-tr.png",
//   "../assets/chatbox/chat-l-bl.png",
//   "../assets/chatbox/chat-l-br.png",
// ].map((loc) => {
//   let dialog = new Image();
//   dialog.src = loc;
//   return dialog;
// });

let collect, playersList, mainPlayer;

socket.on("init", ({ id, collectible, players }) => {
  initiate(collectible, players);

  if (id === socket.id) {
    console.log(players);
    chatHandler(socket, mainPlayer);
    Keypress(mainPlayer);

    console.log("Welcome, " + id + " !");

    setInterval(() => {
      draw();
    }, 10);

    // let refresh = setInterval(() => {
    //     draw();
    //     // if(mainPlayer.collision()) request a new collection
    //     socket.emit('player-update',  mainPlayer);
    // }, 15);
  } else console.log(id + " has joined the game.");
});

socket.on("update", ({ collectible, players }) =>
  initiate(collectible, players)
);

socket.on("new-item", (state) => {
  collect = new Collectible(state.collectible);
  for (let player of playersList) {
    player.score = state.players[player.id].score;
  }
  // mainPlayer.score = state.players[socket.id].score;
  console.log(mainPlayer.calculateRank(playersList));
});

function initiate(collectible, players) {
  collect = new Collectible(collectible);
  playersList = Object.values(players).map((player) => {
    if (player.id === socket.id) {
      mainPlayer = new Player(player);
      return mainPlayer;
    } else return new Player(player);
  });
}

function draw() {
  context.drawImage(backgroundImg, 0, 0);
  collect.draw(context, collectibleImg);
  // if(dialog) dialog.draw(context, mainPlayer.x, mainPlayer.y);

  for (let player of playersList) {
    // player.draw(player.id === socket.id ? playerImg : playerTwo, context);
    player.draw(
      player.id === socket.id ? playerImg : playerTwo,
      context,
      collect,
      player.id === socket.id ? socket : false
    );
    // console.log(player);
    if (player.chat != "" && player.showDialog) {
      let chat = new Chat(player.chat);
      chat.draw(context, player.x, player.y, dialogBoxes);
    }
  }
}
