// ==================== ПРОФИЛЬ ====================
window.profile = {
    // Открыть профиль
    open: function() {
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('profileScreen').style.display = 'flex';
        this.updateUI();
    },
    
    // Закрыть профиль
    close: function() {
        document.getElementById('profileScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
    },
    
    // Обновить интерфейс профиля
    updateUI: function() {
        if (!window.currentUser) return;
        
        document.getElementById('profileNameLarge').innerHTML = window.currentUser.name;
        document.getElementById('profileUsernameLarge').innerHTML = `@${window.currentUser.username}`;
        document.getElementById('profileId').innerHTML = `ID: ${window.currentUser.id}`;
        document.getElementById('profileBioText').innerHTML = window.currentUser.bio || 'Привет! Я в Security';
        document.getElementById('balanceAmount').innerHTML = window.currentUser.balance || 0;
        
        if (window.currentUser.isVerified) {
            document.getElementById('profileVerifiedBadge').style.display = 'inline';
        } else {
            document.getElementById('profileVerifiedBadge').style.display = 'none';
        }
        
        document.getElementById('settingsName').innerHTML = window.currentUser.name;
        document.getElementById('settingsUsername').innerHTML = `@${window.currentUser.username}`;
        document.getElementById('settingsBio').innerHTML = window.currentUser.bio || 'Привет!';
        
        const avatarLarge = document.getElementById('profileAvatarLarge');
        if (window.currentUser.avatar && window.currentUser.avatar.startsWith('data:image')) {
            avatarLarge.innerHTML = `<img src="${window.currentUser.avatar}"><i class="fas fa-camera"></i>`;
        } else {
            avatarLarge.innerHTML = `
                <span id="profileAvatarText">${window.currentUser.avatar || window.currentUser.name.charAt(0).toUpperCase()}</span>
                <i class="fas fa-camera"></i>
            `;
        }
    },
    
    // Сменить имя
    changeName: async function() {
        const newName = prompt('Введите новое имя:', window.currentUser.name);
        if (newName && newName.trim()) {
            await window.db.collection('users').doc(window.currentUser.id).update({
                name: newName.trim(),
                avatar: newName.charAt(0).toUpperCase()
            });
            
            window.currentUser.name = newName.trim();
            window.currentUser.avatar = newName.charAt(0).toUpperCase();
            await window.loadUsers();
            this.updateUI();
            window.chats.renderChatsList();
        }
    },
    
    // Сменить юзернейм
    changeUsername: async function() {
        const newUsername = prompt('Введите новый @юзернейм (без @):', window.currentUser.username);
        if (newUsername && newUsername.trim()) {
            const username = newUsername.trim().replace('@', '');
            if (window.users.find(u => u.username === username && u.id !== window.currentUser.id)) {
                alert('❌ Этот юзернейм уже занят');
                return;
            }
            
            await window.db.collection('users').doc(window.currentUser.id).update({
                username: username
            });
            
            window.currentUser.username = username;
            await window.loadUsers();
            this.updateUI();
        }
    },
    
    // Сменить био
    changeBio: async function() {
        const newBio = prompt('О себе:', window.currentUser.bio || '');
        if (newBio !== null) {
            await window.db.collection('users').doc(window.currentUser.id).update({
                bio: newBio
            });
            
            window.currentUser.bio = newBio;
            this.updateUI();
        }
    },
    
    // Сменить аватар
    changeAvatar: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function(e) {
                    await window.db.collection('users').doc(window.currentUser.id).update({
                        avatar: e.target.result
                    });
                    
                    window.currentUser.avatar = e.target.result;
                    window.profile.updateUI();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
};
