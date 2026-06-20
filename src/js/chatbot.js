// ── AI Chatbot Widget for MeroGhar Logistics ──

(function () {
  var chatHistory = [];
  var isOpen = false;
  var isSending = false;

  function getBaseUrl() {
    if (typeof window.API_BASE_URL !== 'undefined' && window.API_BASE_URL) return window.API_BASE_URL;
    if (typeof API_BASE_URL !== 'undefined' && API_BASE_URL) return API_BASE_URL;
    return 'http://localhost:5000';
  }

  var WIDGET_HTML =
    '<div id="mg-chat-btn" style="position:fixed;bottom:20px;right:20px;z-index:9997;width:56px;height:56px;border-radius:50%;background:#f8c06a;border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;transition:transform 0.2s ease">' +
      '<svg id="mg-chat-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0b1510" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      '</svg>' +
    '</div>' +
    '<div id="mg-chat-panel" style="position:fixed;bottom:88px;right:20px;z-index:9997;width:360px;max-width:calc(100vw - 40px);height:480px;max-height:calc(100vh - 120px);background:#111d16;border:1px solid rgba(248,192,106,0.18);border-radius:16px;display:none;flex-direction:column;box-shadow:0 12px 48px rgba(0,0,0,0.5);overflow:hidden;animation:mg-chat-in 0.25s ease">' +
      '<div style="padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;gap:10px;flex-shrink:0">' +
        '<div style="width:34px;height:34px;border-radius:50%;background:rgba(248,192,106,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f8c06a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 2a10 10 0 0 1 10 10c0 2.5-1 4.8-2.6 6.5L21 22l-4.2-1.8A10 10 0 1 1 12 2z"/>' +
          '</svg>' +
        '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:14px;font-weight:600;color:#eef2ee">MeroBot</div>' +
          '<div style="font-size:11px;color:rgba(238,242,238,0.4)">AI Assistant</div>' +
        '</div>' +
        '<button id="mg-chat-close" style="width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.07);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(238,242,238,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M18 6L6 18M6 6l12 12"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div id="mg-chat-msgs" style="flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:8px">' +
        '<div class="mg-msg mg-bot" style="align-self:flex-start;max-width:85%;background:rgba(255,255,255,0.06);border-radius:12px 12px 12px 4px;padding:10px 14px;font-size:13px;line-height:1.5;color:rgba(238,242,238,0.9)">' +
          'Namaste! 🙏 I\'m MeroBot, your AI assistant for MeroGhar Logistics. Ask me about booking, tracking, pricing, or anything else!' +
        '</div>' +
      '</div>' +
      '<div style="padding:12px 14px 14px;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:8px;flex-shrink:0">' +
        '<input id="mg-chat-input" type="text" placeholder="Type a message..." style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:10px 14px;font-size:14px;color:#eef2ee;outline:none;font-family:inherit;min-width:0">' +
        '<button id="mg-chat-send" style="width:42px;height:42px;border-radius:10px;background:#f8c06a;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.15s">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b1510" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
    '</div>';

  var TYPING_HTML =
    '<div class="mg-typing" style="align-self:flex-start;display:flex;gap:4px;padding:12px 16px;background:rgba(255,255,255,0.06);border-radius:12px 12px 12px 4px">' +
      '<span style="width:6px;height:6px;border-radius:50%;background:rgba(238,242,238,0.35);animation:mg-bounce 1.2s ease-in-out infinite"></span>' +
      '<span style="width:6px;height:6px;border-radius:50%;background:rgba(238,242,238,0.35);animation:mg-bounce 1.2s ease-in-out 0.2s infinite"></span>' +
      '<span style="width:6px;height:6px;border-radius:50%;background:rgba(238,242,238,0.35);animation:mg-bounce 1.2s ease-in-out 0.4s infinite"></span>' +
    '</div>';

  function injectStyles() {
    if (document.getElementById('mg-chat-styles')) return;
    var style = document.createElement('style');
    style.id = 'mg-chat-styles';
    style.textContent =
      '@keyframes mg-chat-in { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }' +
      '@keyframes mg-bounce { 0%,60%,100% { transform:translateY(0) } 30% { transform:translateY(-6px) } }' +
      '#mg-chat-msgs::-webkit-scrollbar { width:4px }' +
      '#mg-chat-msgs::-webkit-scrollbar-track { background:transparent }' +
      '#mg-chat-msgs::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1);border-radius:2px }' +
      '#mg-chat-input::placeholder { color:rgba(238,242,238,0.3) }' +
      '#mg-chat-btn:hover { transform:scale(1.08) }' +
      '#mg-chat-btn:active { transform:scale(0.95) }' +
      '#mg-chat-send:hover { opacity:0.85 }' +
      '#mg-chat-send:disabled { opacity:0.4;cursor:default }';
    document.head.appendChild(style);
  }

  function createWidget() {
    if (document.getElementById('mg-chat-btn')) return;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = WIDGET_HTML;
    while (wrapper.firstChild) {
      document.body.appendChild(wrapper.firstChild);
    }
  }

  function scrollToBottom() {
    var msgs = document.getElementById('mg-chat-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  function addMessage(text, role) {
    var msgs = document.getElementById('mg-chat-msgs');
    if (!msgs) return;
    var div = document.createElement('div');
    var isBot = role === 'bot';
    div.style.cssText = 'align-self:' + (isBot ? 'flex-start' : 'flex-end') + ';max-width:85%;background:' + (isBot ? 'rgba(255,255,255,0.06)' : 'rgba(248,192,106,0.12)') + ';border-radius:' + (isBot ? '12px 12px 12px 4px' : '12px 12px 4px 12px') + ';padding:10px 14px;font-size:13px;line-height:1.5;color:' + (isBot ? 'rgba(238,242,238,0.9)' : '#eef2ee') + ';white-space:pre-wrap;word-break:break-word';
    div.textContent = text;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    var msgs = document.getElementById('mg-chat-msgs');
    if (!msgs) return;
    var div = document.createElement('div');
    div.id = 'mg-typing-indicator';
    div.innerHTML = TYPING_HTML;
    msgs.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    var el = document.getElementById('mg-typing-indicator');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function getLocalFallback(msg) {
    var m = (msg || '').toLowerCase().trim();
    m = m.replace(/[^a-z0-9\s]/g, '').trim();
    if (!m) return 'Please type a message! I can help with bookings, tracking, pricing, and more.';
    if (m.includes('hello') || m.startsWith('hi') || m === 'hey' || m.includes('namaste') || m.includes('hy') || m.includes('hlo')) return 'Namaste! 🙏 How can I help you with your move today?';
    if (m.includes('price') || m.includes('cost') || m.includes('rate') || m.includes('quote') || m.includes('how much')) return 'Our pricing is based on distance, item volume, and special handling needs. Get an instant quote by filling out the booking form.';
    if (m.includes('book') || m.includes('order') || m.includes('move') || m.includes('shift') || m.includes('schedule')) return 'To book: open the app, fill in pickup/drop locations, select items, and confirm. You\'ll get a distance-based quote.';
    if (m.includes('track') || m.includes('status') || m.includes('where') || m.includes('delivery') || m.includes('location')) return 'Track your shipment in real-time via the app — go to "My Bookings" and tap the shipment.';
    if (m.includes('payment') || m.includes('pay') || m.includes('khalti') || m.includes('esewa') || m.includes('cash')) return 'We accept Cash on Delivery, Bank Transfer, ConnectIPS, Khalti, and eSewa.';
    if (m.includes('cancel') || m.includes('refund')) return 'To cancel a booking, please contact our support team. Refunds are case-by-case.';
    if (m.includes('vehicle') || m.includes('truck')) return 'We have mini trucks to large trucks for full household shifting. The right vehicle is assigned based on your items.';
    if (m.includes('fragile') || m.includes('glass') || m.includes('breakable')) return 'Yes! Mark items as fragile during booking — our team will handle them with extra care.';
    if (m.includes('contact') || m.includes('support') || m.includes('phone') || m.includes('help')) return 'Reach support via the app\'s Help section or contact admin. We respond within 24 hours.';
    if (m.includes('thank') || m.includes('thanks')) return 'You\'re welcome! 😊 Happy moving with MeroGhar!';
    if (m.includes('yes') || m.includes('ok') || m.includes('okay') || m.includes('sure')) return 'Great! Let me know if you have any specific questions about booking, pricing, or tracking.';
    if (m === 'help' || m.includes('commands') || m.includes('capabilities') || m.includes('what can you do') || m.includes('available') && (m.includes('option') || m.includes('command')) || m.includes('show options') || m.includes('menu') || m.includes('what can i ask')) {
      return 'Here\'s what I can help you with:\n\n📦 BOOKING — "Book a move"\n' +
        '   Redirects you to the booking form\n\n' +
        '📍 TRACKING — "Track my shipment"\n' +
        '   Shows your shipment status\n\n' +
        '💰 PRICING — "What are the prices?"\n' +
        '   Explains pricing (distance + items)\n\n' +
        '💳 PAYMENTS — "Payment options"\n' +
        '   Lists accepted payment methods\n\n' +
        '🔐 ACCOUNT — "Login" / "Sign up"\n' +
        '   Go to login or registration page\n\n' +
        '🚚 VEHICLES — "What trucks do you have?"\n' +
        '   Info about our fleet\n\n' +
        '📞 SUPPORT — "Contact support"\n' +
        '   Reach our help team\n\n' +
        '❓ Just type any question naturally — I\'ll do my best to help!';
    }
    if (m.includes('what') || m.includes('who') || m.includes('which') || m.includes('how')) return 'I can help with questions about bookings, pricing, tracking, payments, vehicles, and more. What would you like to know?';
    return 'I\'m here to help with MeroGhar Logistics — bookings, tracking, pricing, and more. Try asking "How to book?" or "What are the prices?"';
  }

  var ACTIONS = [
    {
      patterns: ['book a move', 'booking form', 'go to booking', 'start booking', 'new booking', 'schedule move', 'shift my items', 'want to move', 'open booking'],
      intent: 'redirect', target: '/src/pages/user.html',
      requiresAuth: false, message: 'Opening the booking form...'
    },
    {
      patterns: ['my bookings', 'my orders', 'track', 'tracking', 'my shipment', 'where is my shipment', 'shipment status', 'my moves', 'my booking'],
      intent: 'redirect', target: '/src/pages/user.html',
      requiresAuth: true, role: 'user',
      message: 'Redirecting to your dashboard...'
    },
    {
      patterns: ['login', 'sign in', 'log in', 'login page', 'go to login'],
      intent: 'redirect', target: '/src/pages/login.html',
      requiresAuth: false, message: 'Redirecting to login...'
    },
    {
      patterns: ['sign up', 'register', 'create account', 'new account', 'signup'],
      intent: 'redirect', target: '/src/pages/signup.html',
      requiresAuth: false, message: 'Redirecting to signup...'
    },
    {
      patterns: ['admin panel', 'go to admin', 'admin dashboard', 'admin page'],
      intent: 'redirect', target: '/src/pages/admin.html',
      requiresAuth: true, role: 'admin',
      message: 'Redirecting to admin panel...'
    },
    {
      patterns: ['vendor portal', 'vendor dashboard', 'vendor page', 'my vendor'],
      intent: 'redirect', target: '/src/pages/vendor.html',
      requiresAuth: true, role: 'vendor',
      message: 'Redirecting to vendor portal...'
    }
  ];

  function validateAction(action) {
    if (!action.requiresAuth) return { valid: true };
    try {
      var userData = localStorage.getItem('meroGharUser');
      if (!userData) return { valid: false, message: 'Please log in first. Type "Login" to go to the login page.' };
      var user = JSON.parse(userData);
      if (!user || !user.role) return { valid: false, message: 'Session expired. Please log in again.' };
      if (action.role && user.role !== action.role) return { valid: false, message: 'This feature requires a ' + action.role + ' account. Your current role is ' + user.role + '.' };
      return { valid: true };
    } catch (e) {
      return { valid: false, message: 'Session error. Please log in again.' };
    }
  }

  function matchAction(text) {
    var m = (text || '').toLowerCase().trim();
    for (var i = 0; i < ACTIONS.length; i++) {
      var action = ACTIONS[i];
      for (var j = 0; j < action.patterns.length; j++) {
        if (m.includes(action.patterns[j])) return action;
      }
    }
    return null;
  }

  function renderChips() {
    var msgs = document.getElementById('mg-chat-msgs');
    if (!msgs) return;
    var chips = [
      { label: '📖 Book a Move', text: 'Book a move' },
      { label: '📍 Track', text: 'Track my shipment' },
      { label: '💰 Pricing', text: 'What are the prices' },
      { label: '💳 Payments', text: 'Payment options' },
      { label: '🔐 Login', text: 'Login' },
      { label: '❓ Help', text: 'help' }
    ];
    var container = document.createElement('div');
    container.id = 'mg-chips';
    container.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 6px';
    for (var i = 0; i < chips.length; i++) {
      var btn = document.createElement('button');
      btn.textContent = chips[i].label;
      btn.dataset.text = chips[i].text;
      btn.style.cssText = 'padding:5px 12px;border-radius:16px;border:1px solid rgba(248,192,106,0.25);background:rgba(248,192,106,0.06);color:#eef2ee;font-size:11px;cursor:pointer;white-space:nowrap;transition:background 0.15s';
      btn.addEventListener('mouseenter', function () { this.style.background = 'rgba(248,192,106,0.15)'; });
      btn.addEventListener('mouseleave', function () { this.style.background = 'rgba(248,192,106,0.06)'; });
      btn.addEventListener('click', function () {
        var input = document.getElementById('mg-chat-input');
        if (!input) return;
        input.value = this.dataset.text;
        sendMessage();
      });
      container.appendChild(btn);
    }
    msgs.appendChild(container);
    scrollToBottom();
  }

  function renderChatHistory() {
    var msgs = document.getElementById('mg-chat-msgs');
    if (!msgs) return;
    msgs.innerHTML = '';
    var greeting = document.createElement('div');
    greeting.className = 'mg-msg mg-bot';
    greeting.style.cssText = 'align-self:flex-start;max-width:85%;background:rgba(255,255,255,0.06);border-radius:12px 12px 12px 4px;padding:10px 14px;font-size:13px;line-height:1.5;color:rgba(238,242,238,0.9)';
    greeting.textContent = 'Namaste! 🙏 I\'m MeroBot, your AI assistant for MeroGhar Logistics. Ask me about booking, tracking, pricing, or anything else!';
    msgs.appendChild(greeting);
    if (chatHistory.length === 0) {
      renderChips();
    }
    for (var i = 0; i < chatHistory.length; i++) {
      addMessage(chatHistory[i].text, chatHistory[i].role === 'user' ? 'user' : 'bot');
    }
  }

  function sendMessage() {
    if (isSending) return;
    var input = document.getElementById('mg-chat-input');
    if (!input) return;
    var text = input.value.trim();
    if (!text) return;

    input.value = '';

    var action = matchAction(text);
    if (action) {
      var validation = validateAction(action);
      if (!validation.valid) {
        addMessage(text, 'user');
        addMessage(validation.message, 'bot');
        return;
      }
      addMessage(text, 'user');
      addMessage(action.message, 'bot');
      setTimeout(function () {
        window.location.href = action.target;
      }, 800);
      return;
    }

    addMessage(text, 'user');
    chatHistory.push({ role: 'user', text: text });
    isSending = true;
    showTyping();

    console.log('[MeroBot] Sending:', text);
    var url = getBaseUrl() + '/api/chatbot/message';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: chatHistory.slice(-10) }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        hideTyping();
        isSending = false;
        console.log('[MeroBot] Response:', data);
        var reply = data.response || data.reply || data.message || getLocalFallback(text);
        addMessage(reply, 'bot');
        chatHistory.push({ role: 'model', text: reply });
      })
      .catch(function (err) {
        hideTyping();
        isSending = false;
        console.warn('[MeroBot] Fetch failed, using local fallback:', err);
        var fallback = getLocalFallback(text);
        addMessage(fallback, 'bot');
        chatHistory.push({ role: 'model', text: fallback });
      });
  }

  function bindEvents() {
    var btn = document.getElementById('mg-chat-btn');
    var panel = document.getElementById('mg-chat-panel');
    var close = document.getElementById('mg-chat-close');
    var input = document.getElementById('mg-chat-input');
    var send = document.getElementById('mg-chat-send');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      isOpen = true;
      panel.style.display = 'flex';
      btn.style.display = 'none';
      renderChatHistory();
      setTimeout(function () {
        if (input) input.focus();
      }, 300);
    });

    function closePanel() {
      isOpen = false;
      panel.style.display = 'none';
      btn.style.display = 'flex';
      chatHistory = [];
    }

    if (close) {
      close.addEventListener('click', closePanel);
    }

    if (send) {
      send.addEventListener('click', sendMessage);
    }

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage();
        }
      });
    }
  }

  function init() {
    if (typeof document === 'undefined') return;
    var ready = function () {
      injectStyles();
      createWidget();
      bindEvents();
    };
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(ready, 2000);
    } else {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(ready, 2000); });
    }
  }

  init();
})();
