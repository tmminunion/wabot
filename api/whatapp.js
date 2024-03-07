const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { getPublicIp } = require("./ipna");
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "MAIN" }),
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});
client.on("ready", () => {
  console.log("Client is ready!");
  const data = getPublicIp();
  client.sendMessage("6285882620035@c.us", `ip baru GCP --> ${data}`);
});

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  console.error("AUTHENTICATION FAILURE", msg);
});

client.initialize();

module.exports = {
  client: client,
  MessageMedia: MessageMedia,
};
