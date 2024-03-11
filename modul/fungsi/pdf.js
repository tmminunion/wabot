const fetchDelete = require("./delete");
const { MessageMedia, client } = require("../../api/whatapp");

async function handler(data) {
  const phoneNumber = data.target_audience;
  const chatId = "62" + phoneNumber.substring(1) + "@c.us";
  // const media = await MessageMedia.fromUrl("https://bt-api.bungtemin.net/pdfacara/BTtvR2rljMIa7DVuvvBMTvGa2Djysoii1710085089.pdf");

  const media = new MessageMedia("application/pdf", data.lampiran);
  // Mengirim pesan media ke nomor yang dituju
  await client.sendMessage(chatId, media, { caption: `${data.isi_news}` });

  // Hapus data setelah berhasil dikirim
  fetchDelete(data.id);
}

module.exports = handler;
