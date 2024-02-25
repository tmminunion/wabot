const io = require("socket.io-client");

const socket = io("https://bt-api.bungtemin.net/");

socket.on("connect", () => {
  console.log("Terhubung ke server socket.io-->", socket.id);
});

socket.on("message", (data) => {
  console.log("Pesan dari server:", data);
});
// Tangani koneksi
socket.on("connect", () => {
  console.log("Terhubung ke server socket.io-->", socket.id);
});

// Tangani pesan dari server (opsional)
socket.on("message", (data) => {
  console.log("Pesan dari server:", data);
});
const originalConsoleLog = console.log;
console.log = function () {
  originalConsoleLog.apply(console, arguments);
  socket.emit("log", arguments);
};
module.exports = socket;
