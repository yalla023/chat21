// Profile data management
let profileData = {
    name: '',
    username: '',
    email: 'user@example.com',
    phone: '+1 234 567 890',
    bio: "Hey there! I'm using this chat app.",
    profilePicture: 'pic2.png.jpg',
    chats: [
        { name: 'Prashanth', lastMessage: 'Hello, how are you?', time: '12:30', image: 'pic2.png.jpg' },
        { name: 'Bhavani', lastMessage: 'See you tomorrow!', time: '11:45', image: 'pic1.png.jpg' },
        { name: 'Chandu', lastMessage: 'Thanks!', time: '10:15', image: 'pic3.png.jpg' }
    ]
};

// Initialize profile data
function initializeProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('user');

    if (userName) {
        profileData.name = userName;
        profileData.username = userName;
        updateProfileUI();
    }
}

// Update UI with profile data
function updateProfileUI() {
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('username-text').textContent = profileData.username;
    document.getElementById('email-text').textContent = profileData.email;
    document.getElementById('phone-text').textContent = profileData.phone;
    document.getElementById('bio-text').textContent = profileData.bio;
    document.getElementById('profile-picture').src = profileData.profilePicture;
}

// Navigation functions
function goBack() {
    window.history.back();
}

// Profile picture handling
function editProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = handleProfilePictureChange;
    input.click();
}

function handleProfilePictureChange(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profileData.profilePicture = e.target.result;
            document.getElementById('profile-picture').src = "pic1.png.jpg";
            saveProfilePicture(file);
        };
        reader.readAsDataURL(file);
    }
}

// Field editing functions
function editField(fieldName) {
    const element = document.getElementById(`${fieldName}-text`);
    const currentValue = element.textContent;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;
    input.className = 'edit-input';
    
    element.parentNode.replaceChild(input, element);
    input.focus();

    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveEdit(fieldName, input);
        }
    });

    input.addEventListener('blur', function() {
        saveEdit(fieldName, input);
    });
}

function saveEdit(fieldName, input) {
    const newValue = input.value.trim();
    profileData[fieldName] = newValue;

    const span = document.createElement('span');
    span.id = `${fieldName}-text`;
    span.textContent = newValue;
    input.parentNode.replaceChild(span, input);

    saveProfileData();
}

// Data persistence functions
function saveProfileData() {
    localStorage.setItem('profileData', JSON.stringify(profileData));
}

function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        profileData = { ...profileData, ...JSON.parse(savedData) };
        updateProfileUI();
    }
}

// Add this new function to display chats
function displayChats() {
    const chatsContainer = document.createElement('div');
    chatsContainer.className = 'chats-section';
    
    const chatsTitle = document.createElement('h3');
    chatsTitle.textContent = 'Recent Chats';
    chatsContainer.appendChild(chatsTitle);

    profileData.chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.onclick = () => openChat(chat.name, chat.image);
        
        chatItem.innerHTML = `
            <img src="${chat.image}" alt="${chat.name}">
            <div class="chat-info">
                <h4>${chat.name}</h4>
                <p>${chat.lastMessage}</p>
            </div>
            <span class="time">${chat.time}</span>
        `;
        
        chatsContainer.appendChild(chatItem);
    });

    // Insert the chats section before profile-actions
    const profileActions = document.querySelector('.profile-actions');
    profileActions.parentNode.insertBefore(chatsContainer, profileActions);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    initializeProfile();
    displayChats();
});

// Add this function to handle chat opening
function openChat(userName, userImage) {
    window.location.href = `Chat.html?user=${encodeURIComponent(userName)}&image=${encodeURIComponent(userImage)}`;
} 