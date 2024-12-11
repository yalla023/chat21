// Chat initialization and management
class ChatManager {
    constructor() {
        this.chatHistory = [];
        this.currentUserId = '';
        this.initializeChat();
        this.setupEventListeners();
    }

    initializeChat() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.userName = urlParams.get('user');
        this.userImage = urlParams.get('image');

        // Update UI with user details
        if (this.userName) {
            document.getElementById('chat-user-name').textContent = this.userName;
        }
        if (this.userImage) {
            document.getElementById('chat-user-image').src = this.userImage;
        }

        // Initialize chat history
        this.currentUserId = this.userName;
        this.chatHistory = this.getChatHistory(this.currentUserId);
        this.displayChatHistory();

        // Start online status updates
        this.updateOnlineStatus();
        setInterval(() => this.updateOnlineStatus(), 30000);
    }

    getChatHistory(userId) {
        const storedHistory = localStorage.getItem(`chat_${userId}`);
        return storedHistory ? JSON.parse(storedHistory) : [];
    }

    saveChatHistory(userId, history) {
        localStorage.setItem(`chat_${userId}`, JSON.stringify(history));
    }

    displayChatHistory() {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = '';
        
        this.chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.type}`;
            messageDiv.innerHTML = `
                <p>${msg.message}</p>
                <span class="time">${msg.time}</span>
            `;
            messagesContainer.appendChild(messageDiv);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (message) {
            const now = new Date();
            const time = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
            
            const newMessage = {
                type: 'sent',
                message: message,
                time: time
            };
            
            this.chatHistory.push(newMessage);
            this.saveChatHistory(this.currentUserId, this.chatHistory);
            this.displayChatHistory();
            input.value = '';
        }
    }

    updateOnlineStatus() {
        const statusElement = document.getElementById('status-text');
        const statusIndicator = document.getElementById('user-online-status');
        
        const isOnline = Math.random() > 0.5;
        statusElement.textContent = isOnline ? 'Online' : 'Offline';
        statusElement.style.color = isOnline ? '#2ecc71' : '#95a5a6';
        statusIndicator.style.backgroundColor = isOnline ? '#2ecc71' : '#95a5a6';
    }

    viewProfile() {
        const modal = document.getElementById('profile-modal');
        const modalUserImage = document.getElementById('modal-user-image');
        const modalUserName = document.getElementById('modal-user-name');
        const modalUserStatus = document.getElementById('modal-user-status');
        
        modalUserImage.src = this.userImage;
        modalUserName.textContent = this.userName;
        modalUserStatus.textContent = document.getElementById('status-text').textContent;
        
        modal.style.display = 'block';
    }

    setupEventListeners() {
        // Send message button click
        document.querySelector('.message-input button:last-child')
            .addEventListener('click', () => this.sendMessage());

        // Enter key press in input
        document.getElementById('message-input')
            .addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

        // View profile button click
        document.querySelector('.chat-actions button:first-child')
            .addEventListener('click', () => this.viewProfile());

        // Modal close button
        document.querySelector('.close')
            .addEventListener('click', () => {
                document.getElementById('profile-modal').style.display = 'none';
            });

        // Click outside modal to close
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('profile-modal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize chat when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
}); 