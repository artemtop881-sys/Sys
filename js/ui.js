// ==================== UI УТИЛИТЫ ====================
window.ui = {
    // Показать модалку
    showModal: function(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
    },
    
    // Закрыть модалку
    closeModal: function(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    },
    
    // Обновить весь интерфейс
    updateUI: function() {
        window.profile.updateUI();
        window.chats.renderChatsList();
        window.chats.renderAllUsers();
    }
};
