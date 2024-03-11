const { takessw } = require("../../api/screentiket");
const { MessageMedia, client } = require("../../api/whatapp");
const fetchDelete = require("./delete");
async function handler(data) {
  const phoneNumber = data.target_audience;
  const chatId = "62" + phoneNumber.substring(1) + "@c.us";
  takessw(data.lampiran).then((bas64) => {
    const medi = new MessageMedia("image/png", bas64);
    client.sendMessage(chatId, medi, { caption: `${data.isi_news}` });
    fetchDelete(data.id);
  });
}

module.exports = handler;
