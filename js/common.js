// Common Utility Functions

// Generate unique ID with timestamp + random
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date to Thai locale
export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp.toDate ? timestamp.toDate() : timestamp);
  return date.toLocaleString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });
}

// HTML escape user input to prevent XSS
export function sanitizeText(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Validate message
export function validateMessage(message) {
  const trimmed = message.trim();
  if (!trimmed) return { valid: false, error: 'กรุณากรอกความคิดเห็น' };
  if (trimmed.length < 5) return { valid: false, error: 'ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร' };
  if (trimmed.length > 250) return { valid: false, error: 'ความคิดเห็นต้องไม่เกิน 250 ตัวอักษร' };
  return { valid: true };
}

// Seeded random number generator (for consistent positioning)
export function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate display seed from feedback ID
export function generateDisplaySeed(feedbackId) {
  let hash = 0;
  for (let i = 0; i < feedbackId.length; i++) {
    const char = feedbackId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Simple event logging
export function logEvent(eventName, data = {}) {
  console.log(`[${new Date().toISOString()}] ${eventName}`, data);
}
