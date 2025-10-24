// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// ✅ Configura CORS y versión de transporte compatible con Android (Socket.IO v2)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});

// Guardamos los datos de los vehículos
let vehicles = {};

// Endpoint REST: recibe ubicaciones del simulador
app.post("/update-location", (req, res) => {
  const { deviceId, lat, lng, speed, ignition } = req.body;
  if (!deviceId || !lat || !lng) return res.sendStatus(400);

  vehicles[deviceId] = { lat, lng, speed, ignition, lastUpdate: new Date() };

  // ✅ Emitimos evento en tiempo real a todos los clientes conectados
  io.emit("vehicle-update", { deviceId, lat, lng, speed, ignition });
  console.log(`📡 Update ${deviceId}: ${lat}, ${lng}`);

  res.sendStatus(200);
});

// Endpoint para obtener todos los vehículos actuales
app.get("/vehicles", (req, res) => {
  res.json(vehicles);
});

// Manejo de conexiones Socket.IO
io.on("connection", (socket) => {
  console.log("✅ Cliente conectado:", socket.id);

  // Enviamos datos iniciales
  socket.emit("init", vehicles);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
