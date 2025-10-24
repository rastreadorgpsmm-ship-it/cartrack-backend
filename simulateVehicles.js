const axios = require("axios");

// Cambia por la IP de tu servidor
const BACKEND_URL = "https://cartrack-backend-rthf.onrender.com/update-location";


// Definimos vehículos de prueba
let vehicles = [
  { deviceId: "car001", lat: 19.4326, lng: -99.1332 },
  { deviceId: "car002", lat: 19.4330, lng: -99.1340 },
  { deviceId: "car003", lat: 19.4310, lng: -99.1320 }
];

// Función para mover vehículos aleatoriamente
function moveVehicle(vehicle) {
  vehicle.lat += (Math.random() - 0.5) * 0.001;
  vehicle.lng += (Math.random() - 0.5) * 0.001;
  return vehicle;
}

// Enviar actualización cada 2 segundos
setInterval(() => {
  vehicles = vehicles.map(moveVehicle);

  vehicles.forEach(v => {
    axios.post(BACKEND_URL, {
      deviceId: v.deviceId,
      lat: v.lat,
      lng: v.lng,
      speed: Math.floor(Math.random() * 60),
      ignition: true
    }).catch(err => console.log(err.message));
  });

  console.log("Vehículos actualizados:", vehicles.map(v => v.deviceId).join(", "));
}, 2000);
