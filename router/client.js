const express = require("express");
const router = express.Router();
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const session = require("express-session");
const { exec } = require("child_process");
router.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Router untuk rute dengan parameter :id
router.get("/:id", (req, res) => {
  const clientId = req.params.id;
  console.log("Halaman data client_" + clientId);
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: clientId }),
  });

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log(`client_${clientId} is ready!`);

    // Simpan ID klien yang sudah siap dalam sesi
    req.session.clientId = clientId;
    if (req.session.clientId) {
      // Memerintahkan pm2 untuk restart
      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }
        console.log(`pm2 restart all output: ${stdout}`);
        console.error(`pm2 restart all errors: ${stderr}`);
      });
      res.send("Restarting server...");
    } else {
      res.status(403).send("Forbidden");
    }
  });

  client.on("auth_failure", (msg) => {
    console.error("AUTHENTICATION FAILURE", msg);
  });

  client.initialize();

  res.render("index", { data: [] });
});

// Router untuk rute /
router.get("/", (req, res) => {
  // Periksa apakah ID klien ada dalam sesi
  if (req.session.clientId) {
    // Memerintahkan Node.js atau pm2 untuk restart
    console.log("Restarting server...");
    process.exit(0);
  } else {
    res.status(403).send("Forbidden");
  }
});

module.exports = router;
