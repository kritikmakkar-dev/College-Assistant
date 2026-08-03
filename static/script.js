/*
==========================================
AI College Assistant
Frontend JavaScript - Version 1
==========================================

Features:
1. Send message to Flask
2. Display user & bot messages
3. Save chat history
4. Load chat history
5. New Chat
6. Typing Indicator
7. Auto Scroll
8. Error Handling
*/


// ==========================================
// Get HTML Elements
// ==========================================

const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");
const sendButton = document.querySelector(".input-area button");
const newChatButton = document.getElementById("new-chat-btn");
const loadingOverlay = document.getElementById("loading-overlay");

// ==========================================
// Show Loading
// ==========================================

function showLoading(){

    loadingOverlay.style.display = "flex";

}


// ==========================================
// Hide Loading
// ==========================================

function hideLoading(){

    loadingOverlay.style.display = "none";

}
// ==========================================
// Add Message
// ==========================================

function addMessage(message, sender){

    const messageDiv = document.createElement("div");

    if(sender === "user"){

        messageDiv.className = "user-message";
        messageDiv.innerHTML = message;

    }else{

        messageDiv.className = "bot-message";

        // Markdown Support (works if marked.js is added)
        if(typeof marked !== "undefined"){

            messageDiv.innerHTML = marked.parse(message);

        }else{

            messageDiv.innerHTML = message;

        }

    }

    // If it's a bot message, add Copy button
if(sender === "bot"){

    const copyButton = document.createElement("button");

    copyButton.className = "copy-btn";

    copyButton.innerHTML = "📋 Copy";

    copyButton.onclick = function(){

        navigator.clipboard.writeText(message);

        copyButton.innerHTML = "✅ Copied!";

        setTimeout(function(){

            copyButton.innerHTML = "📋 Copy";

        },2000);

    };

    messageDiv.appendChild(document.createElement("br"));
    messageDiv.appendChild(copyButton);

}

// Add message
chatBox.appendChild(messageDiv);

// Auto scroll
chatBox.scrollTop = chatBox.scrollHeight;

// Save chat
saveChat();

}


// ==========================================
// Save Chat
// ==========================================

function saveChat(){

    localStorage.setItem(

        "chatHistory",

        chatBox.innerHTML

    );

}


// ==========================================
// Load Chat
// ==========================================

function loadChat(){

    const history = localStorage.getItem("chatHistory");

    if(history){

        chatBox.innerHTML = history;

    }

    chatBox.scrollTop = chatBox.scrollHeight;

}
// ==========================================
// Add Chat To Sidebar
// ==========================================

function addChatToSidebar(chatName){

    const historyList = document.getElementById("history-list");

    const li = document.createElement("li");

    li.innerHTML = "💬 " + chatName;

    historyList.appendChild(li);

}

// ==========================================
// Clear Chat
// ==========================================

function clearChat(){

    localStorage.removeItem("chatHistory");

    chatBox.innerHTML = `

        <div class="bot-message">

            👋 Hello!

            <br><br>

            I'm your AI College Assistant.

            <br><br>

            Ask me anything related to your college.

        </div>

    `;

    saveChat();

}


// ==========================================
// Show Typing Indicator
// ==========================================

function showTyping(){

    const typingDiv = document.createElement("div");

    typingDiv.className = "bot-message";

    typingDiv.id = "typing-indicator";

    typingDiv.innerHTML = `
<div class="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
</div>
`;

    chatBox.appendChild(typingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

}


// ==========================================
// Remove Typing Indicator
// ==========================================

function removeTyping(){

    const typingDiv = document.getElementById("typing-indicator");

    if(typingDiv){

        typingDiv.remove();

    }

}


// ==========================================
// Send Message
// ==========================================

async function sendMessage(){

    const message = userInput.value.trim();

    if(message === ""){

        return;

    }

    addMessage(message, "user");
    showLoading();

    showTyping();

    userInput.value = "";

    userInput.focus();

    try{

        const response = await fetch("/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                message:message

            })

        });

        const data = await response.json();

        removeTyping();
        hideLoading();

        addMessage(data.response,"bot");

    }

    catch(error){

        removeTyping();
        hideLoading();
        

        addMessage(

            "⚠️ Server Error. Please try again.",

            "bot"

        );

        console.error(error);

    }

}


// ==========================================
// Button Events
// ==========================================

sendButton.addEventListener(

    "click",

    sendMessage

);


// ==========================================
// New Chat Button
// ==========================================

newChatButton.addEventListener(

    "click",

    function(){

        const confirmClear = confirm(

            "Start a new chat?\n\nCurrent conversation will be cleared."

        );

        if(confirmClear){

            clearChat();
            currentChat = "Chat " + chatCount;
            addChatToSidebar(currentChat);
            clearChat();

        }

    }

);


// ==========================================
// Enter Key
// ==========================================

userInput.addEventListener(

    "keypress",

    function(event){

        if(event.key === "Enter"){

            sendMessage();

        }

    }

);


// ==========================================
// Load Chat On Startup
// ==========================================

window.onload = function(){

    loadChat();
    addChatToSidebar(currentChat);
};