// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Guardamos los datos de los dispositivos
let vehicles = {};

app.post("/update-location", (req, res) => {
  const { deviceId, lat, lng, speed, ignition } = req.body;
  vehicles[deviceId] = { lat, lng, speed, ignition, lastUpdate: new Date() };
  io.emit("vehicle-update", { deviceId, lat, lng, speed, ignition });
  res.sendStatus(200);
});

app.get("/vehicles", (req, res) => {
  res.json(vehicles);
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  socket.emit("init", vehicles);
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
