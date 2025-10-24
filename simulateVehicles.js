const axios = require("axios");

// Endpoint correcto de tu servidor
const BACKEND_URL = "https://cartrack-backend-rthf.onrender.com/update-location";

// Vehículos de prueba
let vehicles = [
  { deviceId: "car001", lat: 19.4326, lng: -99.1332 },
  { deviceId: "car002", lat: 19.4330, lng: -99.1340 },
  { deviceId: "car003", lat: 19.4310, lng: -99.1320 }
];

// Función para mover vehículos aleatoriamente
function moveVehicle(vehicle) {
  vehicle.lat += (Math.random() - 0.5) * 0.001;
  vehicle.lng += (Math.random() - 0.5) * 0.001;
  vehicle.speed = Math.floor(Math.random() * 60); // velocidad aleatoria
  vehicle.ignition = true; // encendido siempre true para la prueba
  return vehicle;
}

// Función para enviar datos al servidor
function sendUpdate(vehicle) {
  axios.post(BACKEND_URL, vehicle)
    .then(() => console.log(`Actualizado: ${vehicle.deviceId}`))
    .catch(err => console.error(`Error en ${vehicle.deviceId}: ${err.message}`));
}

// Actualizar y enviar cada 2 segundos
setInterval(() => {
  vehicles = vehicles.map(moveVehicle);
  vehicles.forEach(sendUpdate);

  console.log("Vehículos enviados:", vehicles.map(v => v.deviceId).join(", "));
}, 2000);
