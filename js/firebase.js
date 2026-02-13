// ==================== FIREBASE КОНФИГУРАЦИЯ ====================
// Это твоя личная база данных в облаке
const firebaseConfig = {
    apiKey: "AIzaSyBpT1rLJqZxGxGxGxGxGxGxGxGxGxGxGxGx",
    authDomain: "security-message.firebaseapp.com",
    projectId: "security-message",
    storageBucket: "security-message.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
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
