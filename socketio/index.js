let gameState = {
  collectible: generateCollectible(),
  players: {},
  destroyed: [],
}; // player details, collectible

function generateCollectible() {
  return {
    id: Date.now(),
    x: 33 + Math.floor(Math.random() * 574),
    y: 68 + Math.floor(Math.random() * 342),
    value: 10,
  };
}

module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("a user connected with id: " + client.id);

    gameState.players[client.id] = {
      id: client.id,
      x: 33 + Math.floor(Math.random() * 574),
      y: 68 + Math.floor(Math.random() * 342),
      score: 0,
      name: client.id,
    };

    io.emit("init", { id: client.id, ...gameState });

    client.on("player-update", ({ x, y, drawing, frame }) => {
      gameState.players[client.id].x = x;
      gameState.players[client.id].y = y;
      gameState.players[client.id].drawing = drawing;
      gameState.players[client.id].frame = frame;

      client.broadcast.emit("update", gameState);
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
      client.broadcast.emit("update", gameState);
    });

    client.on("disconnect", () => {
      delete gameState.players[client.id];
      console.log(client.id + " has disconnected");
    });
  });
};

// end socket.io
