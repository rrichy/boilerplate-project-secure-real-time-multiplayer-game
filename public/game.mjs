import Player from "./Player.mjs";
import Collectible from "./Collectible.mjs";
import Chat from "./chatbox.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");

Chat(socket);

let backgroundImg = new Image();
backgroundImg.src = "../assets/lobby.png";

let collectibleImg = new Image();
collectibleImg.src = "../assets/collectible1.png";

let playerImg = new Image();
playerImg.src = "../assets/sans.png";

let playerTwo = new Image();
playerTwo.src = "../assets/sans-2.png";

const dialogBoxes = [
  "../assets/chatbox/chat-s-tl.png",
  "../assets/chatbox/chat-s-tr.png",
  "../assets/chatbox/chat-s-bl.png",
  "../assets/chatbox/chat-s-br.png",
  "../assets/chatbox/chat-l-tl.png",
  "../assets/chatbox/chat-l-tr.png",
  "../assets/chatbox/chat-l-bl.png",
  "../assets/chatbox/chat-l-br.png",
].map((loc) => {
  let dialog = new Image();
  dialog.src = loc;
  return dialog;
});

let collect, playersList, mainPlayer;

socket.on("init", ({ id, collectible, players }) => {
  if (id === socket.id) {
    console.log("Welcome, " + id + " !");

    document.onkeydown = (e) => {
      const { keyCode } = e;
      if (keyCode == 65 || keyCode == 37) mainPlayer.movement["left"] = true;
      if (keyCode == 68 || keyCode == 39) mainPlayer.movement["right"] = true;
      if (keyCode == 87 || keyCode == 38) mainPlayer.movement["up"] = true;
      if (keyCode == 83 || keyCode == 40) mainPlayer.movement["down"] = true;
    };

    document.onkeyup = (e) => {
      const { keyCode } = e;
      if (keyCode == 65 || keyCode == 37) mainPlayer.movement["left"] = false;
      if (keyCode == 68 || keyCode == 39) mainPlayer.movement["right"] = false;
      if (keyCode == 87 || keyCode == 38) mainPlayer.movement["up"] = false;
      if (keyCode == 83 || keyCode == 40) mainPlayer.movement["down"] = false;
    };
    setInterval(() => {
      draw();
    }, 10);

    // let refresh = setInterval(() => {
    //     draw();
    //     // if(mainPlayer.collision()) request a new collection
    //     socket.emit('player-update',  mainPlayer);
    // }, 15);
  } else console.log(id + " has joined the game.");

  initiate(collectible, players);
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
