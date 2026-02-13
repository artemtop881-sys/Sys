// ==================== ЧАТЫ ====================
window.chats = {
    currentChat: null,
    
    // Переключение вкладок (Чаты, Глобальный, Люди)
    switchTab: function(tab, element) {
        document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        
        document.getElementById('chatsContent').style.display = tab === 'chats' ? 'block' : 'none';
        document.getElementById('globalContent').style.display = tab === 'global' ? 'block' : 'none';
        document.getElementById('usersContent').style.display = tab === 'users' ? 'block' : 'none';
        
        if (tab === 'chats') {
            this.renderChatsList();
        } else if (tab === 'global') {
            this.renderGlobalChat();
        } else if (tab === 'users') {
            this.renderAllUsers();
        }
    },
    
    // Переключение нижней навигации
    switchMainTab: function(tab, element) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
        
        if (tab === 'chats') {
            document.getElementById('mainScreen').style.display = 'flex';
            document.getElementById('profileScreen').style.display = 'none';
            document.getElementById('favoritesScreen').style.display = 'none';
            document.getElementById('settingsScreen').style.display = 'none';
            this.renderChatsList();
        } else if (tab === 'profile') {
            window.profile.open();
        } else if (tab === 'favorites') {
            window.favorites.open();
        }
    },
    
    // Рендер списка личных чатов
    renderChatsList: function() {
        const container = document.getElementById('chatsList');
        if (!container || !window.currentUser) return;
        
        container.innerHTML = '';

        const chatPartners = new Set();
        
        Object.values(window.messages).forEach(chatMessages => {
            chatMessages.forEach(msg => {
                if (msg.from === window.currentUser.username) {
                    chatPartners.add(msg.to);
                } else if (msg.to === window.currentUser.username) {
                    chatPartners.add(msg.from);
                }
            });
        });

        const chatUsers = window.users.filter(u => chatPartners.has(u.username) && u.username !== window.currentUser.username);
        
        if (chatUsers.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">💬 Напиши кому-нибудь в глобальном чате</div>';
        } else {
            chatUsers.forEach(user => {
                const lastMsg = this.getLastMessage(user.username);
                
                container.innerHTML += `
                    <div class="chat-item" onclick="window.chats.openPrivateChat('${user.username}')">
                        <div class="chat-avatar">
                            ${user.avatar || user.name.charAt(0).toUpperCase()}
                            ${user.isVerified ? '<i class="fas fa-check-circle verified-icon"></i>' : ''}
                            ${user.online ? '<span class="online-dot"></span>' : ''}
                        </div>
                        <div class="chat-info">
                            <div class="chat-row">
                                <span class="chat-name">
                                    ${user.name}
                                    ${user.isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                                </span>
                                <span class="chat-time">${lastMsg ? lastMsg.time : ''}</span>
                            </div>
                            <div class="chat-last">
                                ${lastMsg ? lastMsg.text : `@${user.username}`}
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    },
    
    // Рендер глобального чата
    renderGlobalChat: function() {
        const container = document.getElementById('globalMessages');
        if (!container) return;
        
        container.innerHTML = '';
        
        window.globalMessages.forEach(msg => {
            const isMe = msg.from === window.currentUser.username;
            
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${isMe ? 'outgoing' : 'incoming'}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            
            const user = window.users.find(u => u.username === msg.from);
            const nameHtml = isMe ? '' : `<strong style="color: ${user?.isVerified ? 'var(--verified)' : 'var(--accent)'};">@${msg.from}</strong><br>`;
            
            bubble.innerHTML = nameHtml + msg.text;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.innerHTML = msg.time;
            
            bubble.appendChild(timeDiv);
            msgDiv.appendChild(bubble);
            container.appendChild(msgDiv);
        });
    },
    
    // Рендер всех пользователей
    renderAllUsers: function() {
        const container = document.getElementById('usersList');
        if (!container || !window.currentUser) return;
        
        container.innerHTML = '';
        
        const otherUsers = window.users.filter(u => u.username !== window.currentUser.username);
        
        if (otherUsers.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">👥 Пока нет других пользователей</div>';
            return;
        }
        
        otherUsers.forEach(user => {
            container.innerHTML += `
                <div class="chat-item" onclick="window.chats.openPrivateChat('${user.username}')">
                    <div class="chat-avatar">
                        ${user.avatar || user.name.charAt(0).toUpperCase()}
                        ${user.isVerified ? '<i class="fas fa-check-circle verified-icon"></i>' : ''}
                        ${user.online ? '<span class="online-dot"></span>' : ''}
                    </div>
                    <div class="chat-info">
                        <div class="chat-row">
                            <span class="chat-name">
                                ${user.name}
                                ${user.isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                            </span>
                        </div>
                        <div class="chat-last">
                            @${user.username}
                        </div>
                    </div>
                </div>
            `;
        });
    },
    
    // Поиск пользователей
    searchUsers: function() {
        const query = document.getElementById('globalSearch').value.toLowerCase();
        
        if (!query) {
            this.renderAllUsers();
            return;
        }
        
        const results = window.users.filter(u => 
            u.id !== window.currentUser?.id && (
                u.name.toLowerCase().includes(query) || 
                u.username.toLowerCase().includes(query) ||
                `@${u.username}`.toLowerCase().includes(query)
            )
        );
        
        const container = document.getElementById('usersList');
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">👀 Ничего не найдено</div>';
            return;
        }
        
        results.forEach(user => {
            container.innerHTML += `
                <div class="chat-item" onclick="window.chats.openPrivateChat('${user.username}')">
                    <div class="chat-avatar">
                        ${user.avatar || user.name.charAt(0).toUpperCase()}
                        ${user.isVerified ? '<i class="fas fa-check-circle verified-icon"></i>' : ''}
                        ${user.online ? '<span class="online-dot"></span>' : ''}
                    </div>
                    <div class="chat-info">
                        <div class="chat-row">
                            <span class="chat-name">
                                ${user.name}
                                ${user.isAdmin ? '<span class="admin-badge">ADMIN</span>' : ''}
                            </span>
                        </div>
                        <div class="chat-last">
                            @${user.username}
                        </div>
                    </div>
                </div>
            `;
        });
    },
    
    // Открыть личный чат
    openPrivateChat: function(username) {
        const user = window.users.find(u => u.username === username);
        if (!user) return;
        
        this.currentChat = user.username;
        
        document.getElementById('mainScreen').style.display = 'none';
        document.getElementById('chatScreen').style.display = 'flex';
        
        document.getElementById('chatHeaderTitle').innerHTML = user.name + (user.isAdmin ? ' 👑' : '');
        document.getElementById('chatHeaderStatus').innerHTML = user.online ? 'онлайн' : 'был(а) недавно';
        document.getElementById('chatAvatarText').innerHTML = user.avatar || user.name.charAt(0).toUpperCase();
        
        this.renderMessages();
    },
    
    // Отправить сообщение
    sendMessage: async function() {
        const input = document.getElementById('messageInput');
        const text = input.value.trim();
        
        if (!text || !this.currentChat || !window.currentUser) return;
        
        // Проверяем, в глобальном ли мы чате
        if (document.getElementById('globalContent').style.display === 'block') {
            await this.sendGlobalMessage(text);
            input.value = '';
            return;
        }
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newMsg = {
            chat: [window.currentUser.username, this.currentChat].sort().join('_'),
            from: window.currentUser.username,
            to: this.currentChat,
            text: text,
            time: time,
            timestamp: Date.now()
        };
        
        await window.db.collection('messages').add(newMsg);
        await window.loadMessages();
        
        input.value = '';
        this.renderMessages();
    },
    
    // Отправить сообщение в глобальный чат
    sendGlobalMessage: async function(text) {
        if (!text || !window.currentUser) return;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newMsg = {
            from: window.currentUser.username,
            text: text,
            time: time,
            timestamp: Date.now()
        };
        
        await window.db.collection('global').add(newMsg);
        await window.loadGlobalMessages();
        this.renderGlobalChat();
    },
    
    // Рендер сообщений в личном чате
    renderMessages: function() {
        const container = document.getElementById('messagesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const chatId = [window.currentUser.username, this.currentChat].sort().join('_');
        const chatMessages = window.messages[chatId] || [];
        
        chatMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        chatMessages.forEach(msg => {
            const isMe = msg.from === window.currentUser.username;
            
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${isMe ? 'outgoing' : 'incoming'}`;
            
            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.innerHTML = msg.text;
            
            const timeDiv = document.createElement('div');
            timeDiv.className = 'message-time';
            timeDiv.innerHTML = msg.time;
            
            bubble.appendChild(timeDiv);
            msgDiv.appendChild(bubble);
            container.appendChild(msgDiv);
        });
        
        container.scrollTop = container.scrollHeight;
    },
    
    // Получить последнее сообщение
    getLastMessage: function(username) {
        const chatId = [window.currentUser.username, username].sort().join('_');
        const chatMessages = window.messages[chatId] || [];
        return chatMessages[chatMessages.length - 1];
    },
    
    // Закрыть чат
    closeChat: function() {
        document.getElementById('chatScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'flex';
        this.renderChatsList();
    },
    
    // Показать/скрыть стикеры
    toggleStickers: function() {
        document.getElementById('stickerPicker').classList.toggle('hidden');
    },
    
    // Отправить стикер
    sendSticker: function(sticker) {
        const input = document.getElementById('messageInput');
        input.value = sticker;
        
        if (document.getElementById('globalContent').style.display === 'block') {
            this.sendGlobalMessage(sticker);
        } else {
            this.sendMessage();
        }
        
        document.getElementById('stickerPicker').classList.add('hidden');
    }
};
