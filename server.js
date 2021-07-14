require("dotenv").config();
// const express = require('express');
const socket = require("socket.io");

// const app = express();
const httpServer = require("./lib/config");
const io = socket(httpServer);

const ioHandler = require("./socketio/index")(io);
// io.on("connection", require("./socketio/index"));

// Setting the server up
const portNum = process.env.PORT || 3000;
httpServer.listen(portNum);
