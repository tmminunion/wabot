const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

// Konfigurasi Firebase untuk menggunakan emulator
const firebaseConfig = {
  apiKey: "AIzaSyA7kHlC_5RxBy7g5JbFuYWjGOZ393S0-hk",
  authDomain: "nufat-eltijany.firebaseapp.com",
  // databaseURL:"https://nufat-eltijany-default-rtdb.asia-southeast1.firebasedatabase.app",
  databaseURL: "http://127.0.0.1:9001/?ns=nufat-eltijany-default-rtdb",
  projectId: "nufat-eltijany",
  storageBucket: "nufat-eltijany.appspot.com",
  messagingSenderId: "816575333917",
  appId: "1:816575333917:web:58d7f5f399c27b503b28f4",
  measurementId: "G-BNJ6JMT2JE",
};

// Inisialisasi aplikasi Firebase
const firebaseApp = initializeApp(firebaseConfig);

const dbta = getDatabase(firebaseApp);

module.exports = {
  dbta: dbta,
};
