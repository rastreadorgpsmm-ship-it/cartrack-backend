const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Socket.IO para enviar actualizaciones en tiempo real a la app Android
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"]
});

// Guardamos los datos de los vehículos
let vehicles = {};

// Endpoint REST: recibe ubicaciones del simulador o módulo GPS
app.post("/update-location", (req, res) => {
    const { deviceId, lat, lng, speed = 0, ignition = true } = req.body;

    if (!deviceId || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: "Faltan datos esenciales" });
    }

    vehicles[deviceId] = {
        lat,
        lng,
        speed,
        ignition,
        lastUpdate: new Date()
    };

    // Emitimos evento a todos los clientes conectados
    io.emit("vehicle-update", vehicles[deviceId]);
    console.log(`📍 ${deviceId} -> Lat:${lat}, Lng:${lng}, Speed:${speed}`);

    res.sendStatus(200);
});

// Endpoint para obtener todos los vehículos actuales
app.get("/vehicles", (req, res) => {
    res.json(vehicles);
});

// Manejo de conexiones Socket.IO
io.on("connection", (socket) => {
    console.log("✅ Cliente conectado:", socket.id);
    socket.emit("init", vehicles);

    socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
