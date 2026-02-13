// ==================== FIREBASE КОНФИГУРАЦИЯ ====================
// Это твоя личная база данных в облаке
const firebaseConfig = {
    apiKey: // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAywPbtEKtCASciyVxL-mpEolL4YJlJ7YU",
  authDomain: "security-message-df5c4.firebaseapp.com",
  projectId: "security-message-df5c4",
  storageBucket: "security-message-df5c4.firebasestorage.app",
  messagingSenderId: "936862359256",
  appId: "1:936862359256:web:cccb8f8d3c0bb899c881ad",
  measurementId: "G-SYB98C8REE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
бро,это?
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Создаём глобальный объект для базы данных
window.db = firebase.firestore();

// Глобальные переменные для данных
window.users = [];
window.messages = {};
window.globalMessages = [];

// Функции для загрузки данных
window.loadUsers = async function() {
    const snapshot = await window.db.collection('users').get();
    window.users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

window.loadMessages = async function() {
    const snapshot = await window.db.collection('messages').get();
    window.messages = {};
    snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!window.messages[data.chat]) window.messages[data.chat] = [];
        window.messages[data.chat].push(data);
    });
};

window.loadGlobalMessages = async function() {
    const snapshot = await window.db.collection('global').orderBy('timestamp', 'desc').limit(50).get();
    window.globalMessages = snapshot.docs.map(doc => doc.data()).reverse();
};
