// ==================== АДМИН-ПАНЕЛЬ ====================
window.admin = {
    // Показать админ-панель
    showPanel: function() {
        document.getElementById('statsUsers').innerHTML = window.users.length;
        
        let totalMessages = 0;
        Object.values(window.messages).forEach(msgs => totalMessages += msgs.length);
        document.getElementById('statsMessages').innerHTML = totalMessages;
        
        const selects = ['verifyUserSelect', 'starsUserSelect', 'adminUserSelect'];
        selects.forEach(id => {
            const select = document.getElementById(id);
            select.innerHTML = '<option value="">Выбери пользователя</option>';
            window.users.filter(u => u.id !== window.currentUser.id).forEach(user => {
                select.innerHTML += `<option value="${user.id}">${user.name} (@${user.username})</option>`;
            });
        });
        
        window.ui.showModal('adminPanelModal');
    },
    
    // Выдать галочку верификации
    verifyUser: async function() {
        const userId = document.getElementById('verifyUserSelect').value;
        if (!userId) {
            alert('❌ Выбери пользователя');
            return;
        }
        
        await window.db.collection('users').doc(userId).update({
            isVerified: true
        });
        
        await window.loadUsers();
        alert('✅ Пользователь верифицирован!');
        window.ui.closeModal('adminPanelModal');
    },
    
    // Выдать звёзды
    giveStars: async function() {
        const userId = document.getElementById('starsUserSelect').value;
        const amount = parseInt(document.getElementById('starsAmountAdmin').value);
        
        if (!userId || !amount) {
            alert('❌ Выбери пользователя и укажи количество');
            return;
        }
        
        const user = window.users.find(u => u.id === userId);
        const newBalance = (user.balance || 0) + amount;
        
        await window.db.collection('users').doc(userId).update({
            balance: newBalance
        });
        
        await window.loadUsers();
        alert(`⭐ Выдано ${amount} звёзд!`);
        window.ui.closeModal('adminPanelModal');
    },
    
    // Назначить админа
    makeAdmin: async function() {
        const userId = document.getElementById('adminUserSelect').value;
        if (!userId) {
            alert('❌ Выбери пользователя');
            return;
        }
        
        await window.db.collection('users').doc(userId).update({
            isAdmin: true
        });
        
        await window.loadUsers();
        alert('👑 Пользователь стал админом!');
        window.ui.closeModal('adminPanelModal');
    }
};
