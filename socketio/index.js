let gameState = {
  collectible: generateCollectible(),
  players: {},
  destroyed: [],
}; // player details, collectible

function generateCollectible() {
  return {
    id: Date.now(),
    x: 33 + Math.floor(Math.random() * 574), // todo: edit with collision
    y: 68 + Math.floor(Math.random() * 342), // todo: edit with collision
    value: 10,
  };
}

function generatePlayer(id) {
  const x = 33 + Math.floor(Math.random() * 574); // todo: edit with collision
  const y = 68 + Math.floor(Math.random() * 342); // todo: edit with collision
  gameState.players[id] = {
    id,
    x,
    y,
    speed: 5,
    score: 0,
    name: id,
    orientation: [x, y, 35, 45],
  };
}

module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("a user connected with id: " + client.id);

    generatePlayer(client.id);

    io.emit("announce", {
      message: [
        "Notice:",
        `${gameState.players[client.id].name} has entered the game.`,
      ],
    });

    io.emit("new-player", gameState);

    // io.emit("init", { id: client.id, ...gameState });

    // client.on("player-update", ({ x, y, drawing, frame }) => {
    //   gameState.players[client.id].x = x;
    //   gameState.players[client.id].y = y;
    //   gameState.players[client.id].drawing = drawing;
    //   gameState.players[client.id].frame = frame;

    //   client.broadcast.emit("update", gameState);
    // });
    // {x, y, speed, score, orientation}
    client.on("player-update", ({ x, y, speed, score, orientation }) => {
      gameState.players[client.id].x = x;
      gameState.players[client.id].y = y;
      gameState.players[client.id].speed = speed;
      gameState.players[client.id].score = score;
      gameState.players[client.id].orientation = orientation;
      // gameState.players[client.id].drawing = drawing;
      // gameState.players[client.id].frame = frame;

      client.broadcast.emit("update-players", { players: gameState.players });
    });

    client.on("item-collected", (item) => {
      if (!gameState.destroyed.includes(item.id)) {
        gameState.collectible = generateCollectible();
        gameState.players[client.id].score += item.value;
        gameState.destroyed.push(item.id);
        console.log(gameState.collectible);

        io.emit("new-item", gameState);
      }
      // io.emit('update', gameState);
    });

    client.on("chat", ({ message }) => {
      console.log(`${client.id}: ${message}`);
      // gameState.players[client.id].chat = message;
      // gameState.players[client.id].showDialog = true;
      // console.log()
      client.broadcast.emit("receive-chat", {
        message: [gameState.players[client.id].name, message],
        id: client.id,
      });

      // client.broadcast.emit("update", gameState);
      // setTimeout(() => {
      //   gameState.players[client.id].showDialog = false;
      //   io.emit("update", gameState);
      // }, 7000);
    });

    client.on("change-name", ({ name }) => {
      const previousName = gameState.players[client.id].name;

      gameState.players[client.id].name = name;
      io.emit("announce", {
        message: [
          "Notice:",
          `${previousName} has changed his/her name to ${name}.`,
        ],
      });
      client.broadcast.emit("update-name", { id: client.id, name });
    });

    client.on("disconnect", () => {
      io.emit("player-logout", { id: client.id });
      io.emit("announce", {
        message: [
          "Notice:",
          `${gameState.players[client.id].name} has exited the game.`,
        ],
      });
      delete gameState.players[client.id];
      console.log(client.id + " has disconnected");
    });
  });
};

// end socket.io
