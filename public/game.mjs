import Player from "./classes/Player.mjs";
import Collectible from "./Collectible.mjs";
import imageLoader from "./imageLoader.mjs";
import { chatHandler, Chat } from "./chatbox.mjs";
import Keypress from "./keypress.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");
const fps = 20;

const backgroundImg = imageLoader("../assets/lobby.png");
const collectibleImg = imageLoader("../assets/collectible1.png");

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

socket.on("new-player", ({ collectible, players }) => {
  // data received: {collectible, players}
  console.log("Welcome, " + players[socket.id].name + " !");

  if (!mainPlayer) {
    playersList = Object.keys(players); // key players ID
    playersList = playersList.map((player) => {
      // map each player IDs into a player Object
      if (player === socket.id) {
        mainPlayer = new Player(
          Object.assign({}, players[player], { face: 1 })
        ); // Create mainplayer object.
        return mainPlayer;
      }
      return new Player(Object.assign({}, players[player], { face: 2 }));
    });
    // collect = new Collectible(collectible); // Create collectible object.
    Keypress(mainPlayer); // Adding controls to the mainplayer object.
    chatHandler(socket, mainPlayer); // Adding chat function to the mainplayer object.

    setInterval(() => {
      drawCanvas();
    }, fps / 1000);
  } else {
    const oldPlayersId = playersList.map((player) => player.id);
    const newPlayerId = Object.keys(players).filter(
      (id) => !oldPlayersId.includes(id)
    );

    playersList.push(
      new Player(Object.assign({}, players[newPlayerId], { face: 2 }))
    );
  }
});

socket.on("update-players", ({ players }) => {
  // {x, y, speed, score, orientation}
  playersList.forEach((player) => {
    const { id } = player;
    player.x = players[id].x;
    player.y = players[id].y;
    player.speed = players[id].speed;
    player.score = players[id].score;
    player.orientation = players[id].orientation;
  });
});

socket.on("update-name", ({ id, name }) => {
  const newNamedPlayer = playersList.find((player) => player.id === id);
  newNamedPlayer.name = name;
});

socket.on("player-logout", ({ id }) => {
  playersList = playersList.filter((player) => player.id !== id);
});

function drawCanvas() {
  context.drawImage(backgroundImg, 0, 0);

  playersList.forEach((player) => {
    player.draw(context, socket);
  });
  // collect.draw(context, collectibleImg);
  // if(dialog) dialog.draw(context, mainPlayer.x, mainPlayer.y);

  // for (let player of playersList) {
  //   // player.draw(player.id === socket.id ? playerImg : playerTwo, context);
  //   player.draw(
  //     player.id === socket.id ? playerImg : playerTwo,
  //     context,
  //     collect,
  //     player.id === socket.id ? socket : false
  //   );
  //   // console.log(player);
  //   if (player.chat != "" && player.showDialog) {
  //     let chat = new Chat(player.chat);
  //     chat.draw(context, player.x, player.y, dialogBoxes);
  //   }
  // }
}

// socket.on("init", ({ id, collectible, players }) => {
//   // initiate(collectible, players);

//   if (id === socket.id) {
//     chatHandler(socket, mainPlayer);
//     Keypress(mainPlayer);

//     console.log("Welcome, " + id + " !");

//     // setInterval(() => {
//     //   draw();
//     // }, 10);

//     // let refresh = setInterval(() => {
//     //     draw();
//     //     // if(mainPlayer.collision()) request a new collection
//     //     socket.emit('player-update',  mainPlayer);
//     // }, 15);
//   } else console.log(id + " has joined the game.");
// });

// socket.on("update", ({ collectible, players }) =>
//   initiate(collectible, players)
// );

// socket.on("new-item", (state) => {
//   collect = new Collectible(state.collectible);
//   for (let player of playersList) {
//     player.score = state.players[player.id].score;
//   }
//   // mainPlayer.score = state.players[socket.id].score;
//   console.log(mainPlayer.calculateRank(playersList));
// });

// function initiate(collectible, players) {
//   collect = new Collectible(collectible);
//   playersList = Object.values(players).map((player) => {
//     if (player.id === socket.id) {
//       mainPlayer = new Player(player);
//       return mainPlayer;
//     } else return new Player(player);
//   });
// }

// function draw() {
//   context.drawImage(backgroundImg, 0, 0);
//   collect.draw(context, collectibleImg);
//   // if(dialog) dialog.draw(context, mainPlayer.x, mainPlayer.y);

//   for (let player of playersList) {
//     // player.draw(player.id === socket.id ? playerImg : playerTwo, context);
//     player.draw(
//       player.id === socket.id ? playerImg : playerTwo,
//       context,
//       collect,
//       player.id === socket.id ? socket : false
//     );
//     // console.log(player);
//     if (player.chat != "" && player.showDialog) {
//       let chat = new Chat(player.chat);
//       chat.draw(context, player.x, player.y, dialogBoxes);
//     }
//   }
// }
