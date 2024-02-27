const express = require("express");
const router = express.Router();
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

// Middleware untuk parsing body dari permintaan POST
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Router untuk rute dengan parameter :id
router.post("/:id", (req, res) => {
  const clientId = req.params.id;
  const phoneNumber = req.body.nomer;
  const text = req.body.pesan;

  // Periksa apakah nomor telepon memiliki panjang yang cukup untuk diproses
  if (phoneNumber && phoneNumber.length > 1) {
    const chatId = "62" + phoneNumber.substring(1) + "@c.us";
    console.log(chatId, text);
    console.log("Halaman post client_" + clientId);
    const client = new Client({
      authStrategy: new LocalAuth({ clientId: clientId }),
    });
    client.on("loading_screen", (percent, message) => {
      console.log("LOADING SCREEN", percent, message);
    });
    client.on("ready", () => {
      console.log(`client_${clientId} is ready!`);

      // kirim pesan
      client.sendMessage(chatId, text);
      res.render("index", { data: [] });
    });

    client.on("auth_failure", (msg) => {
      console.error("AUTHENTICATION FAILURE", msg);
    });

    client.initialize();
  } else {
    console.error("Invalid phone number:", phoneNumber);
  }
});

// Router untuk rute /
router.get("/", (req, res) => {
  // Periksa apakah ID klien ada dalam sesi
  res.render("index", { data: [] });
});

module.exports = router;
