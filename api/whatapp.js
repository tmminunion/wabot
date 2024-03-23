const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { getPublicIp } = require("./ipna");
const { waktou } = require("../service/fire");

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "MAIee4" }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  },
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("Client is ready!");
  waktou(client, MessageMedia);
  try {
    const data = await getPublicIp();
    console.log(data);
    client.sendMessage("6285882620035@c.us", `ip baru GCP --> ${data}`);
  } catch (error) {
    console.error("Error:", error);
  }
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
