// ==================== АВТОРИЗАЦИЯ ====================
window.auth = {
    // Показать форму регистрации
    showRegister: function() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    },
    
    // Показать форму входа
    showLogin: function() {
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    },
    
    // Регистрация нового пользователя
    register: async function() {
        const name = document.getElementById('regName').value.trim();
        let username = document.getElementById('regUsername').value.trim().replace('@', '');
        const password = document.getElementById('regPassword').value.trim();
        const bio = document.getElementById('regBio').value.trim() || 'Привет! Я в Security';
        
        if (!name || !username || !password) {
            alert('❌ Заполни имя, юзернейм и пароль');
            return;
        }
        
        await window.loadUsers();
        
        if (window.users.find(u => u.username === username)) {
            alert('❌ @юзернейм уже занят');
            return;
        }

        const isAdmin = (username === 'sergo' || username === 'attackmonov');
        
        const newUser = {
            name: name,
            username: username,
            password: password,
            isAdmin: isAdmin,
            isVerified: isAdmin,
            balance: isAdmin ? 500 : 0,
            avatar: name.charAt(0).toUpperCase(),
            bio: bio,
            online: true,
            favorites: [],
            lastSeen: new Date().toISOString()
        };
        
        const docRef = await window.db.collection('users').add(newUser);
        newUser.id = docRef.id;
        
        window.currentUser = { id: docRef.id, ...newUser };
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
        
        await window.loadUsers();
        await window.loadMessages();
        await window.loadGlobalMessages();
        window.ui.updateUI();
        alert('✅ Аккаунт создан! Добро пожаловать в глобальный чат!');
    },
    
    // Вход в систему
    login: async function() {
        const loginInput = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        await window.loadUsers();
        
        let user;
        
        if (loginInput.startsWith('@')) {
            const username = loginInput.substring(1);
            user = window.users.find(u => u.username === username && u.password === password);
        } else {
            user = window.users.find(u => (u.name === loginInput || u.username === loginInput) && u.password === password);
        }
        
        if (!user) {
            alert('❌ Неверный логин или пароль');
            return;
        }
        
        window.currentUser = user;
        
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
        
        await window.loadMessages();
        await window.loadGlobalMessages();
        window.ui.updateUI();
    },
    
    // Выход из системы
    logout: function() {
        window.currentUser = null;
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('authScreen').style.display = 'flex';
        this.showLogin();
    }
};
