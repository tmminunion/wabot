const axios = require("axios");
const { MessageMedia, client } = require("./whatapp");
const headers = {
  apikey: process.env.API_KEY_BT,
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

setInterval(async () => {
  try {
    const data = await fetchData();
    // Kirim data ke semua klien yang terhubung
    console.log("data", data);
    if (data != null) {
      const phoneNumber = data.target_audience;
      const chatId = "62" + phoneNumber.substring(1) + "@c.us";
      client.sendMessage(chatId, `${data.isi_news}`);
      fetchDelete(data.id);
    } else {
      console.log("data notif kosong");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}, 120000); // Dalam milidetik (2 menit)

// Ekspor fetchDelete dan fetchData sebagai properti dari objek default
module.exports = {
  fetchAPI: fetchAPI,
  getPdfAsBase64: getPdfAsBase64,
  postData: postData,
};
