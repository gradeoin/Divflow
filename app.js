
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const kotBody = document.getElementById('kotBody');
const kotTime = document.getElementById('kotTime');

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.className = `message message-${sender}`;
  msg.innerHTML = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleKeyPress(e) {
  if (e.key === 'Enter') sendMessage();
}

function sendQuickPrompt(promptText) {
  userInput.value = promptText;
  sendMessage();
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  
  appendMessage('user', text);
  userInput.value = '';

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'message message-bot';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<em>Divflow AI is thinking...</em>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
    processAIResponse(text);
  }, 600);
}

function processAIResponse(input) {
  const lower = input.toLowerCase();

  if (lower.includes('starter') || lower.includes('menu')) {
    appendMessage('bot', `🔥 <strong>Our Top Starters:</strong><br>
    • <strong>Paneer Tikka</strong> (₹280) [Veg]<br>
    • <strong>Crispy Corn</strong> (₹220) [Veg]<br>
    • <strong>Chicken Tikka</strong> (₹340) [Non-Veg]<br>
    • <strong>BBQ Chicken Wings</strong> (₹320) [Non-Veg]<br><br>
    What would you like to start with?`);
  } else if (lower.includes('order') || lower.includes('paneer') || lower.includes('naan')) {
    appendMessage('bot', `📝 <strong>Order Summary for Table 4:</strong><br>
    • 1x <strong>Paneer Tikka</strong> — ₹280<br>
    • 2x <strong>Butter Naan</strong> — ₹100<br>
    -------------------------<br>
    <strong>Total Estimate: ₹380</strong><br><br>
    Shall I send this order to the kitchen now?`);
  } else if (lower.includes('spice') || lower.includes('spicy')) {
    appendMessage('bot', `🌶️ Noted! I've marked your <strong>Paneer Tikka as Extra Spicy</strong> with extra mint chutney. Should I confirm the order for Table 4?`);
  } else if (lower.includes('confirm') || lower.includes('place') || lower.includes('yes')) {
    const kotId = '#KOT-' + Math.floor(100 + Math.random() * 900);
    appendMessage('bot', `🎉 <strong>Order ${kotId} Confirmed!</strong><br>
    The kitchen chefs have started preparing your food.<br>
    ⏱️ <strong>Estimated time: 15–20 mins</strong>.<br><br>
    Need anything else? Just message me anytime!`);
    
    // Update Kitchen Display
    kotTime.innerText = new Date().toLocaleTimeString();
    kotBody.innerHTML = `
      <div class="kot-ticket">
        <div class="kot-ticket-title">
          <span>TABLE 4</span>
          <span>${kotId}</span>
        </div>
        <div class="kot-item-row">
          <span>1x Paneer Tikka (Extra Spicy)</span>
          <span>₹280</span>
        </div>
        <div class="kot-item-row">
          <span>2x Butter Naan</span>
          <span>₹100</span>
        </div>
        <div class="kot-total-row">
          <span>TOTAL BILL:</span>
          <span>₹380</span>
        </div>
      </div>
    `;
  } else if (lower.includes('bill') || lower.includes('check')) {
    appendMessage('bot', `🧾 Your total bill for Table 4 is <strong>₹380</strong>. Our floor captain is bringing the payment terminal to your table right now!`);
  } else {
    appendMessage('bot', `Got it! I can help you browse our full menu, customize spice levels, order food, or request the bill for Table 4. What would you like to do?`);
  }
}
