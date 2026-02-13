// ==================== ИЗБРАННОЕ ====================
window.favorites = {
    // Открыть экран избранного
    open: function() {
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('favoritesScreen').style.display = 'flex';
        this.render();
    },
    
    // Закрыть экран избранного
    close: function() {
        document.getElementById('favoritesScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
    },
    
    // Показать модалку добавления
    showAddModal: function() {
        window.ui.showModal('addFavoriteModal');
    },
    
    // Добавить заметку
    add: async function() {
        const text = document.getElementById('favoriteText').value.trim();
        
        if (!text) {
            alert('❌ Введи текст заметки');
            return;
        }
        
        const favorite = {
            userId: window.currentUser.id,
            text: text,
            time: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        await window.db.collection('favorites').add(favorite);
        
        document.getElementById('favoriteText').value = '';
        window.ui.closeModal('addFavoriteModal');
        this.render();
    },
    
    // Добавить из чата
    addFromChat: function() {
        alert('⭐ Чтобы добавить заметку, перейди в раздел "Избранное"');
    },
    
    // Рендер списка заметок
    render: async function() {
        const container = document.getElementById('favoritesList');
        if (!container) return;
        
        container.innerHTML = '';
        
        const snapshot = await window.db.collection('favorites')
            .where('userId', '==', window.currentUser.id)
            .orderBy('timestamp', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">📝 У тебя пока нет заметок</div>';
            return;
        }
        
        snapshot.docs.forEach(doc => {
            const fav = doc.data();
            const date = new Date(fav.time);
            const timeStr = date.toLocaleString();
            
            container.innerHTML += `
                <div class="favorite-item">
                    <div class="favorite-text">${fav.text}</div>
                    <div class="favorite-time">
                        <span>${timeStr}</span>
                        <i class="fas fa-trash delete-favorite" onclick="window.favorites.delete('${doc.id}')"></i>
                    </div>
                </div>
            `;
        });
    },
    
    // Удалить заметку
    delete: async function(id) {
        if (confirm('Удалить заметку?')) {
            await window.db.collection('favorites').doc(id).delete();
            this.render();
        }
    }
};
