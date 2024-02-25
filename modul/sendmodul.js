const { MessageMedia, client } = require("../api/whatapp");
const { fetchAPI, getPdfAsBase64 } = require("../api/axios");
const { gemini } = require("../api/gemini");

async function sendPdfMessage(from, base64Data) {
  try {
    const media = new MessageMedia("application/pdf", base64Data, "file.pdf");
    await client.sendMessage(from, media);
    console.log("PDF sent successfully.");
  } catch (error) {
    console.error("Error sending PDF message:", error);
    throw error;
  }
}

async function getData(url, chatId) {
  response = await fetchAPI(url);
  client.sendMessage(chatId, `${response.msg}`);
}
client.on("message", async (msg) => {
  const str = msg.body;
  if (str.toLowerCase() === "!info") {
    msg.react("🕵️‍♂️");
    const url = "https://bungtemin.net/nlog/progressmandat";
    getData(url, msg.from);
  } else if (str.toLowerCase() === "!update") {
    msg.react("🕵️‍♂️");
    const url = "https://bungtemin.net/wanotif/progressmandat";
    getData(url, msg.from);
  } else if (
    msg.body === "#1" ||
    str.toLowerCase() === "!vote" ||
    str.toLowerCase() === "!mandat" ||
    str.toLowerCase() === "!pemandatan" ||
    str.toLowerCase() === "!progress" ||
    str.toLowerCase() === "!persen" ||
    str.toLowerCase() === "!persentasi" ||
    str.toLowerCase() === "!%"
  ) {
    msg.react("🕵️‍♂️");
    const url = "https://bungtemin.net/nlog/progressmandat";
    getData(url, msg.from);
  } else if (
    msg.body === "!KP" ||
    str.toLowerCase() === "!mandatkp" ||
    str.toLowerCase() === "!kp"
  ) {
    msg.react("🕵️‍♂️");
    const url = "https://bungtemin.net/nlog/progressmandatkp";
    getData(url, msg.from);
  } else if (msg.body.startsWith("!mandatno ")) {
    msg.react("🕵️‍♂️");
    const stry = msg.body.split(" ")[1];
    const url = "https://bungtemin.net/nlog/mandatmano/" + stry;
    getData(url, msg.from);
  } else if (msg.body.startsWith("!votekp ")) {
    msg.react("🕵️‍♂️");
    const stry = msg.body.split(" ")[1];
    const url = "https://bungtemin.net/nlog/mandatkp/" + stry;
    getData(url, msg.from);
  } else if (msg.body.startsWith("!cari ")) {
    msg.react("🕵️‍♂️");
    const stry = msg.body.split(" ")[1];
    const url = "https://bungtemin.net/nlog/mandatcari/" + stry;
    getData(url, msg.from);
  }
});

module.exports = {
  getData: getData,
  sendPdfMessage: sendPdfMessage,
};
