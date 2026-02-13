// ==================== НАСТРОЙКИ ====================
window.settings = {
    // Открыть настройки
    open: function() {
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('settingsScreen').style.display = 'flex';
        
        // Показываем админ-панель только для @sergo и @attackmonov
        if (window.currentUser && (window.currentUser.username === 'sergo' || window.currentUser.username === 'attackmonov')) {
            document.getElementById('adminPanelContainer').style.display = 'block';
        } else {
            document.getElementById('adminPanelContainer').style.display = 'none';
        }
    },
    
    // Закрыть настройки
    close: function() {
        document.getElementById('settingsScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
    },
    
    // Установить тему
    setTheme: function(theme) {
        document.body.className = '';
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('sm_theme', theme);
    }
};
