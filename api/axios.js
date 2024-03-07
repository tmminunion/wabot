const axios = require("axios");
const { MessageMedia, client } = require("./whatapp");
require("dotenv").config();
const io = require("socket.io-client");
const { takessw } = require("./screentiket");
const dodollsd = process.env.API_KEY_BT;
const headers = {
  apikey: dodollsd,
};

async function fetchData() {
  try {
    const response = await axios.get("https://bungtemin.net/wanotif", {
      headers: headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}
const postData = async (t, p, te, gam) => {
  try {
    const response = await axios.post(
      "http://api.bungtemin.net/voicemember/post",
      {
        nomer: te,
        text: t,
        proses: p,
        gambar: gam,
      },
      {
        headers: {
          // Tambahkan header jika diperlukan, misalnya content type
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Terjadi kesalahan:", error.response);
  }
};
async function fetchAPI(url) {
  try {
    const response = await axios.get(url, {
      headers: headers,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

async function fetchDelete(id) {
  try {
    const response = await axios.get(
      "https://bungtemin.net/wanotif/del/" + id,
      {
        headers: headers,
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}
async function getPdfAsBase64(url) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const pdfData = Buffer.from(response.data, "binary").toString("base64");
    console.log("pdaf data: ", pdfData);
    return pdfData;
  } catch (error) {
    console.error("Error fetching PDF:", error);
    throw error;
  }
}

let intervalId;

function sendText(data) {
  const phoneNumber = data.target_audience;
  const chatId = "62" + phoneNumber.substring(1) + "@c.us";
  client.sendMessage(chatId, `${data.isi_news}`);
  fetchDelete(data.id);
}

function startInterval() {
  console.log("set interval ON");
  intervalId = setInterval(async () => {
    try {
      const data = await fetchData();
      // Kirim data ke semua klien yang terhubung
      console.log("data", data);
      if (data != null) {
        if (data.type == "TIKET") {
          const phoneNumber = data.target_audience;
          const chatId = "62" + phoneNumber.substring(1) + "@c.us";

          takessw(data.lampiran).then((bas64) => {
            const medi = new MessageMedia("image/png", bas64);
            client.sendMessage(chatId, medi, { caption: `${data.isi_news}` });
          });
          fetchDelete(data.id);
        } else {
          sendText(data);
        }
      } else {
        console.log("data notif kosong");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, 30000);
}

async function kirimImage() {}
function stopInterval() {
  console.log("pengecekan dihentikan");
  clearInterval(intervalId);
}

// Inisialisasi variabel socket di luar fungsi sehingga dapat diakses secara global
let socket;

function connectSocketWithToken(token) {
  socket = io("https://bt-api.bungtemin.net", {
    auth: {
      token: token, // Menggunakan token dari response Axios
    },
  });

  socket.on("connect", () => {
    console.log("Connected to server with socket id:", socket.id);
  });

  socket.on("lampuStatus", (status) => {
    console.log("Status lampu:", status);
    if (status == "On") {
      stopInterval();
      console.log("ada perintah ON");
      startInterval();
    } else {
      console.log("ada perintah OFF");
      stopInterval();
    }
  });

  socket.on("connect_error", (err) => {
    console.log(err instanceof Error); // true
    console.log(err.message); // not authorized
    console.log(err.data); // { content: "Please retry later" }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
}

// Data untuk permintaan POST
const postDatasok = {
  datauser: "cekWAsok", // Sesuaikan nilai ini
  pwd: process.env.API_KEY_WEBSOCKET, // Sesuaikan nilai ini
};

axios
  .post("https://api.bungtemin.net/websocket", postDatasok)
  .then(function (response) {
    const token = response.data.token; // Asumsi response mengandung 'token'
    connectSocketWithToken(token);
  })
  .catch(function (error) {
    console.log("Error saat mendapatkan token:", error);
  });

// Ekspor fetchDelete dan fetchData sebagai properti dari objek default
module.exports = {
  fetchAPI: fetchAPI,
  getPdfAsBase64: getPdfAsBase64,
  postData: postData,
};
