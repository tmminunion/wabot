const serviceAccount = require("../../util/nufat-eltijany.json");

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function waktou(client, MessageMedia) {
  const collectionRef2new = admin
    .firestore()
    .collection("PDFMaker")
    .where("WA", "==", 0);

  collectionRef2new.onSnapshot(
    async (snapshot) => {
      snapshot.docs.forEach(async (doc) => {
        var data = doc.data();
        const phoneNumber = data.Telp;
        const chatId = "62" + phoneNumber.substring(1) + "@c.us";

        try {
          await client.sendMessage(chatId, data.pesan);
          const median = new MessageMedia(
            "application/pdf",
            data.base64PDF,
            "file" + data.pdfId + ".pdf"
          );
          console.log(data.base64PDF);
          await client.sendMessage(chatId, median);
          console.log("PDF sent successfully.");

          await doc.ref.delete();
          console.log(`link ${doc.id} successfully dikirim.`);
        } catch (error) {
          console.error("Error sending message or updating document:", error);
        }
      });
    },
    (error) => {
      console.error(`Encountered error: ${error}`);
    }
  );

  const collectionRef = admin
    .firestore()
    .collection("waBlast")
    .where("WA", "==", 0);

  console.log("Trying to connect to Firestore...");

  collectionRef.onSnapshot(
    async (snapshot) => {
      console.log("Firestore connected successfully.");
      snapshot.docs.forEach(async (doc) => {
        console.log("ada snapshot");
        var data = doc.data();
        const phoneNumber = data.Telp;
        const chatId = "62" + phoneNumber.substring(1) + "@c.us";

        try {
          await client
            .sendMessage(chatId, `${data.text}`)
            .then(async (response) => {
              console.log("Pesan berhasil terkirim ke :", chatId);
              await sendMessageWithDelay(
                process.env.ADMIN_PUK_EA,
                "Notifikasi untuk Admin 1",
                30000,
                client
              );
            })
            .catch((error) => {
              console.error("Gagal mengirim pesan:", error);
            });

          const mediapdf = MessageMedia.fromFilePath(
            "/home/nufateltijany/drive/howto.pdf"
          );
          await client
            .sendMessage(chatId, mediapdf)
            .then(async (response) => {
              console.log("Pesan berhasil terkirim:", response);
              await doc.ref.delete();
              console.log(`Document ${doc.id} successfully deleted.`);
            })
            .catch((error) => {
              console.error("Gagal mengirim pesan:", error);
            });
        } catch (error) {
          console.error(`Error sending message or deleting document:`, error);
        }
      });
    },
    (error) => {
      console.error(`Encountered error: ${error}`);
    }
  );

  const collectionRef2 = admin
    .firestore()
    .collection("PDFBukber")
    .where("WA", "==", 0);

  collectionRef2.onSnapshot(
    async (snapshot) => {
      snapshot.docs.forEach(async (doc) => {
        var data = doc.data();
        const phoneNumber = data.Telp;
        const chatId = "62" + phoneNumber.substring(1) + "@c.us";

        try {
          const mediak =
            "https://drive.google.com/file/d/" +
            data.pdfId +
            "/view?usp=sharing";

          await client.sendMessage(
            chatId,
            `Sertifikat Terima Kasih dapat dilihat di link : ${mediak} jika link belum bisa di klik balas pesan ini dengan "info"`
          );

          const median = new MessageMedia(
            "application/pdf",
            data.base64PDF,
            "file" + data.pdfId + ".pdf"
          );
          console.log(data.base64PDF);
          await client.sendMessage(chatId, median);
          console.log("PDF sent successfully.");

          const docRef = doc.ref;
          await docRef.update({ WA: 1 });
          console.log(`link ${docRef.id} successfully dikirim.`);
        } catch (error) {
          console.error("Error sending message or updating document:", error);
        }
      });
    },
    (error) => {
      console.error(`Encountered error: ${error}`);
    }
  );
}

async function sendMessageWithDelay(chatId, text, delay, client) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await client.sendMessage(chatId, text);
        console.log("Pesan berhasil terkirim ke :", chatId);
        resolve(response);
      } catch (error) {
        console.error("Gagal mengirim pesan:", error);
        reject(error);
      }
    }, delay);
  });
}

module.exports = {
  waktou: waktou,
};
