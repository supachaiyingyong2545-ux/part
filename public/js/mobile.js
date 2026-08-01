class MobileFeedbackApp {
  constructor() {
    this.ws = null;
    this.participantCount = 0;
    this.feedbackCount = 0;
    this.isAnonymous = false;
    this.init();
  }

  init() {
    this.connectWebSocket();
    this.setupEventListeners();
    this.detectServerUrl();
  }

  detectServerUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}`;
  }

  connectWebSocket() {
    const wsUrl = this.detectServerUrl();
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('✅ Connected to server');
      this.ws.send(JSON.stringify({ type: 'join' }));
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('🔌 Disconnected from server');
      setTimeout(() => this.connectWebSocket(), 3000);
    };
  }

  handleMessage(message) {
    if (message.type === 'sync') {
      this.participantCount = message.participantCount;
      this.feedbackCount = message.data?.length || 0;
      this.updateStats();
    }

    if (message.type === 'new_feedback') {
      this.participantCount = message.participantCount;
      this.feedbackCount = message.totalFeedback;
      this.updateStats();
    }

    if (message.type === 'participants_update') {
      this.participantCount = message.count;
      this.updateStats();
    }
  }

  setupEventListeners() {
    const form = document.getElementById('feedbackForm');
    const feedbackText = document.getElementById('feedbackText');
    const charCounter = document.getElementById('charCounter');
    const anonBtn = document.getElementById('anonBtn');
    const authorInput = document.getElementById('author');

    // Character counter
    feedbackText.addEventListener('input', (e) => {
      charCounter.textContent = e.target.value.length;
    });

    // Anonymous button
    anonBtn.addEventListener('click', () => {
      this.isAnonymous = !this.isAnonymous;
      if (this.isAnonymous) {
        authorInput.value = '';
        authorInput.disabled = true;
        anonBtn.style.background = 'var(--secondary-cyan)';
        anonBtn.style.color = 'white';
      } else {
        authorInput.disabled = false;
        anonBtn.style.background = 'var(--bg-light)';
        anonBtn.style.color = 'var(--secondary-cyan)';
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitFeedback();
    });
  }

  submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value.trim();
    const pillar = document.getElementById('pillar').value;
    const staffType = document.getElementById('staffType').value;
    const author = this.isAnonymous ? 'Anonymous' : document.getElementById('author').value || 'Anonymous';

    if (!feedbackText || !pillar || !staffType) {
      alert('กรุณากรอกความคิดเห็น เลือกเสาหลัก และประเภท');
      return;
    }

    const feedback = {
      type: 'feedback',
      text: feedbackText,
      pillar,
      staffType,
      author
    };

    this.ws.send(JSON.stringify(feedback));

    this.showSuccessMessage();
    this.resetForm();
  }

  resetForm() {
    document.getElementById('feedbackForm').reset();
    document.getElementById('charCounter').textContent = '0';
    this.isAnonymous = false;
  }

  showSuccessMessage() {
    const messageDiv = document.getElementById('feedbackMessage');
    messageDiv.style.display = 'flex';

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 3000);
  }

  updateStats() {
    document.getElementById('participantCount').textContent = this.participantCount;
    document.getElementById('feedbackCount').textContent = this.feedbackCount;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MobileFeedbackApp();
});
