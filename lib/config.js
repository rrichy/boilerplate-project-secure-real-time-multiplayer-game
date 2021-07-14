const express = require("express");
const http = require("http");
const helmet = require("helmet");

const app = express();
const httpServer = http.createServer(app);

app.use(
  helmet({
    hidePoweredBy: { setTo: "PHP 7.4.3" },
  })
);
app.use(helmet.noCache());
app.use("/public", express.static(process.cwd() + "/public"));
app.use("/assets", express.static(process.cwd() + "/assets"));
app.use(express.json());

// Index page (static HTML)
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// 404 Not Found Middlewarei
app.use((req, res, next) => {
  res.status(404).type("text").send("Not Found");
});

module.exports = httpServer;
