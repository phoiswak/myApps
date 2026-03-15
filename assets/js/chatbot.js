/* ===== CHATBOT ===== */
(function () {
  const html = `
    <div class="chatbot-fab" onclick="toggleChat()" title="Chat with us"><i class="fa-solid fa-comment-dots"></i></div>
    <div class="chatbot-window" id="chatWindow">
      <div class="chat-header">
        <div class="chat-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="chat-header-info">
          <div class="chat-name">Liv Assistant</div>
          <div class="chat-status">● Online, ready to help</div>
        </div>
        <div class="chat-close" onclick="toggleChat()">×</div>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-msg">Welcome to <strong>Liv Investment (Pty) Ltd</strong>! 👋 How can we assist you today?</div>
        <div class="chat-options">
          <div class="chat-option" onclick="chatSelect('ict')"><i class="fa-solid fa-laptop-code"></i> ICT Solutions <span class="co-arrow">›</span></div>
          <div class="chat-option" onclick="chatSelect('cleaning')"><i class="fa-solid fa-broom"></i> Cleaning Services <span class="co-arrow">›</span></div>
          <div class="chat-option" onclick="chatSelect('security')"><i class="fa-solid fa-shield-halved"></i> Security Solutions <span class="co-arrow">›</span></div>
          <div class="chat-option" onclick="chatSelect('quote')"><i class="fa-solid fa-clipboard-list"></i> Request a Quote <span class="co-arrow">›</span></div>
          <div class="chat-option" onclick="chatSelect('consultant')"><i class="fa-solid fa-phone"></i> Speak to a Consultant <span class="co-arrow">›</span></div>
        </div>
      </div>
      <div class="chat-footer">
        <input class="chat-input" placeholder="Type a message..." id="chatInput" onkeydown="if(event.key==='Enter')sendChatMsg()">
        <button class="chat-send" onclick="sendChatMsg()"><i class="fa-solid fa-paper-plane"></i></button>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
})();

function toggleChat() {
  document.getElementById("chatWindow").classList.toggle("open");
}

function chatSelect(type) {
  const body = document.getElementById("chatBody");
  const responses = {
    ict: "Great! Our ICT Solutions include Web Development, Network Infrastructure, Cyber Security, Cloud Services, and IT Consulting. Would you like to request a consultation?",
    cleaning: "Our Cleaning Services cover Residential, Commercial, Industrial, Post-Construction, and Contract Cleaning. What type of cleaning do you need?",
    security: "We offer CCTV Installation, Access Control, Alarm Systems, Electric Fencing, and Gate Automation. Would you like a site inspection?",
    quote: "I'll connect you to our quote form right away! You can also call us at 012 612 0937.",
    consultant: "A consultant will contact you shortly. Please share your name and number and we'll call you back within 1 business hour.",
  };
  const div = document.createElement("div");
  div.className = "chat-msg";
  div.style.marginTop = "8px";
  div.innerHTML = responses[type];
  body.appendChild(div);
  if (type === "quote") {
    setTimeout(() => {
      window.location.href = "contact.html";
    }, 800);
    toggleChat();
  }
  body.scrollTop = body.scrollHeight;
}

function sendChatMsg() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;
  const body = document.getElementById("chatBody");
  const userMsg = document.createElement("div");
  userMsg.style.cssText = "text-align:right;margin-bottom:12px;";
  userMsg.innerHTML = `<span style="background:var(--navy);color:white;padding:10px 14px;border-radius:12px 12px 2px 12px;font-size:14px;display:inline-block;max-width:80%;">${text}</span>`;
  body.appendChild(userMsg);
  input.value = "";
  setTimeout(() => {
    const botMsg = document.createElement("div");
    botMsg.className = "chat-msg";
    botMsg.textContent = "Thank you for your message! Our team will respond shortly. For urgent queries, please call 012 612 0937.";
    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;
  }, 800);
  body.scrollTop = body.scrollHeight;
}
