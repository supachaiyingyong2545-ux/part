class DisplayFeedbackApp {
  constructor() {
    this.ws = null;
    this.feedback = [];
    this.participantCount = 0;
    this.currentModeIndex = 0;
    this.modes = ['liveWall', 'bubbleNetwork', 'wordCloudMode', 'topIdeasMode', 'summaryMode'];
    this.modeSwapInterval = 35000;
    this.init();
  }

  init() {
    this.connectWebSocket();
    this.initializeQRCode();
    this.startModeRotation();
  }

  connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ Display connected to server');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('🔌 Display disconnected');
      setTimeout(() => this.connectWebSocket(), 3000);
    };
  }

  handleMessage(message) {
    if (message.type === 'sync') {
      this.feedback = message.data || [];
      this.participantCount = message.participantCount;
      this.renderAllModes();
      this.updateStats();
    }

    if (message.type === 'new_feedback') {
      this.feedback.push(message.data);
      this.participantCount = message.participantCount;
      this.renderAllModes();
      this.updateStats();
    }

    if (message.type === 'feedback_liked') {
      const item = this.feedback.find(f => f.id === message.feedbackId);
      if (item) {
        item.likes = message.likes;
        this.renderAllModes();
      }
    }

    if (message.type === 'participants_update') {
      this.participantCount = message.count;
      this.updateStats();
    }
  }

  startModeRotation() {
    setInterval(() => {
      this.switchMode();
    }, this.modeSwapInterval);
  }

  switchMode() {
    const currentMode = document.getElementById(this.modes[this.currentModeIndex]);
    currentMode.style.display = 'none';

    this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
    const nextMode = document.getElementById(this.modes[this.currentModeIndex]);
    nextMode.style.display = 'flex';

    console.log(`🔄 Switched to ${this.modes[this.currentModeIndex]}`);
  }

  renderAllModes() {
    this.renderLiveWall();
    this.renderBubbleNetwork();
    this.renderWordCloud();
    this.renderTopIdeas();
    this.renderSummary();
  }

  renderLiveWall() {
    const container = document.getElementById('commentWall');
    if (!container) return;

    if (this.feedback.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>รอความคิดเห็นจากผู้เข้าร่วม...</p></div>';
      return;
    }

    container.innerHTML = this.feedback
      .slice()
      .reverse()
      .map((item, index) => this.createCommentCard(item, index))
      .join('');

    this.attachLikeListeners();
  }

  createCommentCard(item, index) {
    const isNew = index === 0;
    const pillarEmoji = {
      'pillar1': '🔬',
      'pillar2': '💊',
      'pillar3': '⚙️',
      'pillar4': '🍴',
      'pillar5': '🌿',
      'pillar6': '🏥'
    }[item.pillar] || '💭';

    const pillarShort = {
      'pillar1': 'ตรวจวินิจฉัยโรค',
      'pillar2': 'ชีววัคซีน',
      'pillar3': 'มาตรฐานเครื่องมือ',
      'pillar4': 'อาหารใหม่',
      'pillar5': 'สมุนไพรไทย',
      'pillar6': 'ท่องเที่ยวสุขภาพ'
    }[item.pillar] || 'Other';

    const staffTypeLabel = item.staffType === 'internal' ? '👔 ภายใน' : '🌍 ภายนอก';

    return `
      <div class="feedback-card ${isNew ? 'is-new' : ''}">
        <div class="card-header">
          <div>
            <span class="card-category">${pillarEmoji} ${pillarShort}</span>
            <span class="card-staff-type">${staffTypeLabel}</span>
          </div>
          <span class="card-author">${item.author}</span>
        </div>
        <p class="card-text">${this.escapeHtml(item.text)}</p>
        <div class="card-footer">
          <span>${new Date(item.timestamp).toLocaleTimeString('th-TH')}</span>
          <button class="like-btn" data-id="${item.id}">
            ❤️ <span class="like-count">${item.likes || 0}</span>
          </button>
        </div>
      </div>
    `;
  }

  attachLikeListeners() {
    document.querySelectorAll('.like-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const feedbackId = btn.dataset.id;
        this.ws.send(JSON.stringify({
          type: 'like',
          feedbackId
        }));
      });
    });
  }

  renderBubbleNetwork() {
    const svg = document.getElementById('networkSvg');
    if (!svg || this.feedback.length === 0) return;

    const width = 1920;
    const height = 900;

    svg.innerHTML = '';

    const lines = svg.createElementNS('http://www.w3.org/2000/svg', 'g');
    const bubbles = svg.createElementNS('http://www.w3.org/2000/svg', 'g');

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    for (let i = 0; i < this.feedback.length; i++) {
      const angle = (i / this.feedback.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const line = svg.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX);
      line.setAttribute('y1', centerY);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'network-line');
      lines.appendChild(line);

      const circle = svg.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 30 + Math.random() * 20);
      circle.setAttribute('class', 'bubble');
      circle.setAttribute('data-text', this.feedback[i].text.substring(0, 50));
      circle.style.fill = this.getColorByCategory(this.feedback[i].category);
      bubbles.appendChild(circle);
    }

    const centerBubble = svg.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerBubble.setAttribute('cx', centerX);
    centerBubble.setAttribute('cy', centerY);
    centerBubble.setAttribute('r', 50);
    centerBubble.setAttribute('class', 'network-node');
    bubbles.appendChild(centerBubble);

    svg.appendChild(lines);
    svg.appendChild(bubbles);
  }

  renderWordCloud() {
    const container = document.getElementById('wordCloud');
    if (!container || this.feedback.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>รอการอัปเดต...</p></div>';
      return;
    }

    const words = this.extractWords(this.feedback.map(f => f.text));
    const topWords = Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));

    container.innerHTML = topWords
      .map(item => `<span class="word-tag" style="font-size: ${12 + item.count * 2}px;">${item.word}</span>`)
      .join('');
  }

  extractWords(texts) {
    const words = {};
    const stopWords = new Set(['และ', 'ที่', 'เพราะ', 'ของ', 'ถึง', 'จาก', 'ให้', 'เป็น', 'มี', 'ได้', 'ไป']);

    texts.forEach(text => {
      text.split(/[\s\n]+/).forEach(word => {
        const clean = word.toLowerCase().replace(/[^\w฀-๿]/g, '');
        if (clean.length > 2 && !stopWords.has(clean)) {
          words[clean] = (words[clean] || 0) + 1;
        }
      });
    });

    return words;
  }

  renderTopIdeas() {
    const container = document.getElementById('topIdeasList');
    if (!container) return;

    const sorted = this.feedback
      .slice()
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 5);

    if (sorted.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>ยังไม่มีความคิดเห็นยอดนิยม</p></div>';
      return;
    }

    container.innerHTML = sorted
      .map((item, index) => `
        <div class="top-idea-item">
          <div>
            <span class="top-idea-rank">${index + 1}</span>
            <span class="top-idea-text">${this.escapeHtml(item.text)}</span>
          </div>
          <div class="top-idea-stats">
            <span>❤️ ${item.likes || 0}</span>
            <span>👤 ${item.author}</span>
            <span>${new Date(item.timestamp).toLocaleTimeString('th-TH')}</span>
          </div>
        </div>
      `)
      .join('');
  }

  renderSummary() {
    const container = document.getElementById('summaryStats');
    if (!container || this.feedback.length === 0) {
      container.innerHTML = '<div class="empty-state" style="grid-column: span 2;"><p>รอการอัปเดต...</p></div>';
      return;
    }

    const categories = {};
    this.feedback.forEach(item => {
      categories[item.category] = (categories[item.category] || 0) + 1;
    });

    const mostCommonCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    const topFeedback = this.feedback.slice().sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];

    const stats = [
      { label: 'หมวดหลัก', content: `${mostCommonCategory[0]} (${mostCommonCategory[1]} รายการ)` },
      { label: 'ยอดนิยมสูงสุด', content: `${this.escapeHtml(topFeedback.text.substring(0, 40))}... (${topFeedback.likes || 0} ❤️)` },
      { label: 'รวมทั้งหมด', content: `${this.feedback.length} ความคิดเห็น` },
      { label: 'ผู้เข้าร่วม', content: `${this.participantCount} ท่าน` }
    ];

    container.innerHTML = stats
      .map(stat => `
        <div class="summary-item">
          <div class="summary-label">${stat.label}</div>
          <div class="summary-content">${stat.content}</div>
        </div>
      `)
      .join('');
  }

  initializeQRCode() {
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) return;

    const qrUrl = window.location.href.replace('/display', '');

    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
      text: qrUrl,
      width: 160,
      height: 160,
      colorDark: '#1769C2',
      colorLight: '#F2F9FF',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  updateStats() {
    document.getElementById('totalParticipants').textContent = this.participantCount;
    document.getElementById('totalFeedback').textContent = this.feedback.length;

    const topLiked = this.feedback.length > 0
      ? Math.max(...this.feedback.map(f => f.likes || 0))
      : 0;
    document.getElementById('topLiked').textContent = topLiked;
  }

  getColorByCategory(category) {
    const colors = {
      'research': '#38BDF8',
      'innovation': '#38CFA7',
      'service': '#1769C2',
      'network': '#FFB547',
      'other': '#FFB5F0'
    };
    return colors[category] || '#38BDF8';
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new DisplayFeedbackApp();
});
