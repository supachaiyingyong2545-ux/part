import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { sanitizeText, validateMessage, generateDisplaySeed, logEvent } from './common.js';

// DOM Elements
const form = document.getElementById('feedbackForm');
const nameInput = document.getElementById('nameInput');
const orgInput = document.getElementById('orgInput');
const messageInput = document.getElementById('messageInput');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const spinner = document.getElementById('spinner');

const charCounter = document.getElementById('charCounter');
const charProgressBar = document.getElementById('charProgressBar');
const charCountContainer = document.getElementById('charCountContainer');

const successModal = document.getElementById('successModal');
const errorModal = document.getElementById('errorModal');
const successBtn = document.getElementById('successBtn');
const errorBtn = document.getElementById('errorBtn');
const errorMessage = document.getElementById('errorMessage');

// Character counter
messageInput.addEventListener('input', (e) => {
  const length = e.target.value.length;
  charCounter.textContent = length;

  // Update progress bar
  const percent = (length / 250) * 100;
  charProgressBar.style.width = percent + '%';

  // Update warning states
  charCountContainer.classList.remove('warning', 'danger');
  charProgressBar.classList.remove('warning', 'danger');

  if (length > 220) {
    charCountContainer.classList.add('warning');
    charProgressBar.classList.add('warning');
  }
  if (length > 240) {
    charCountContainer.classList.add('danger');
    charProgressBar.classList.add('danger');
  }
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  const name = nameInput.value.trim();
  const organization = orgInput.value.trim();

  // Validate message
  const validation = validateMessage(message);
  if (!validation.valid) {
    showErrorModal(validation.error);
    return;
  }

  // Disable submit button and show spinner
  submitBtn.disabled = true;
  spinner.classList.remove('hidden');

  try {
    // Create feedback document
    const feedbackData = {
      name: name || 'ผู้เข้าร่วมงาน',
      organization: organization || '',
      message: sanitizeText(message),
      status: 'pending',
      createdAt: serverTimestamp(),
      approvedAt: null,
      displaySeed: 0 // Will be set after document creation
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'comments'), feedbackData);

    logEvent('Feedback submitted', { id: docRef.id, length: message.length });

    // Update displaySeed with the created document ID
    const displaySeed = generateDisplaySeed(docRef.id);
    await docRef.update({ displaySeed });

    // Show success modal
    showSuccessModal();

    // Reset form
    form.reset();
    charCounter.textContent = '0';
    charProgressBar.style.width = '0%';
    charCountContainer.classList.remove('warning', 'danger');
    charProgressBar.classList.remove('warning', 'danger');

  } catch (error) {
    logEvent('Feedback submission error', { error: error.message });
    showErrorModal(`เกิดข้อผิดพลาด: ${error.message}`);
  } finally {
    // Re-enable submit button and hide spinner
    submitBtn.disabled = false;
    spinner.classList.add('hidden');
  }
});

// Modal handlers
function showSuccessModal() {
  successModal.classList.add('show');
}

function showErrorModal(message) {
  errorMessage.textContent = message;
  errorModal.classList.add('show');
}

function closeSuccessModal() {
  successModal.classList.remove('show');
  messageInput.focus();
}

function closeErrorModal() {
  errorModal.classList.remove('show');
  messageInput.focus();
}

// Modal button handlers
successBtn.addEventListener('click', closeSuccessModal);
errorBtn.addEventListener('click', closeErrorModal);

// Close modal on background click
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) closeSuccessModal();
});

errorModal.addEventListener('click', (e) => {
  if (e.target === errorModal) closeErrorModal();
});

// Focus on message input on page load
window.addEventListener('load', () => {
  messageInput.focus();
});
