// ==================== ИНИЦИАЛИЗАЦИЯ ====================
(async function() {
    // Загружаем сохранённую тему
    const savedTheme = localStorage.getItem('sm_theme') || 'neon-blue';
    window.settings.setTheme(savedTheme);
    
    // Загружаем данные из Firebase
    await window.loadUsers();
    await window.loadMessages();
    await window.loadGlobalMessages();
    
    // Создаём админов, если их нет
    const sergo = window.users.find(u => u.username === 'sergo');
    if (!sergo) {
        await window.db.collection('users').add({
            name: 'Sergo',
            username: 'sergo',
            password: '2022',
            isAdmin: true,
            isVerified: true,
            balance: 500,
            avatar: 'S',
            bio: 'Главный администратор',
            online: false,
            favorites: [],
            lastSeen: new Date().toISOString()
        });
    }
    
    const attack = window.users.find(u => u.username === 'attackmonov');
    if (!attack) {
        await window.db.collection('users').add({
            name: 'Attackmonov',
            username: 'attackmonov',
            password: '2022',
            isAdmin: true,
            isVerified: true,
            balance: 500,
            avatar: 'A',
            bio: 'Администратор',
            online: false,
            favorites: [],
            lastSeen: new Date().toISOString()
        });
    }
    
    await window.loadUsers();
    
    // Подписка на новые сообщения в реальном времени
    window.db.collection('global').orderBy('timestamp').onSnapshot(() => {
        if (window.currentUser) {
            window.loadGlobalMessages().then(() => {
                if (document.getElementById('globalContent').style.display === 'block') {
                    window.chats.renderGlobalChat();
                }
            });
        }
    });
})();
