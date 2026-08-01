const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const server = app.listen(PORT, () => {
  console.log(`🚀 DMSc CONNECT Server running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });
let feedback = [];
let participants = new Set();

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  console.log(`✅ Client connected: ${clientId}`);

  ws.send(JSON.stringify({
    type: 'sync',
    data: feedback,
    participantCount: participants.size
  }));

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);

      if (message.type === 'feedback') {
        const newFeedback = {
          id: uuidv4(),
          text: message.text,
          pillar: message.pillar,
          staffType: message.staffType,
          author: message.author || 'Anonymous',
          timestamp: new Date().toISOString(),
          likes: 0,
          isNew: true
        };

        feedback.push(newFeedback);
        participants.add(clientId);

        broadcast({
          type: 'new_feedback',
          data: newFeedback,
          participantCount: participants.size,
          totalFeedback: feedback.length
        });

        try {
          await saveToGoogleSheets(newFeedback);
        } catch (error) {
          console.error('Error saving to Google Sheets:', error);
        }
      }

      if (message.type === 'like') {
        const feedbackItem = feedback.find(f => f.id === message.feedbackId);
        if (feedbackItem) {
          feedbackItem.likes += 1;
          broadcast({
            type: 'feedback_liked',
            feedbackId: message.feedbackId,
            likes: feedbackItem.likes
          });
        }
      }

      if (message.type === 'join') {
        participants.add(clientId);
        broadcast({
          type: 'participants_update',
          count: participants.size
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`❌ Client disconnected: ${clientId}`);
    participants.delete(clientId);
    broadcast({
      type: 'participants_update',
      count: participants.size
    });
  });
});

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

async function saveToGoogleSheets(feedbackItem) {
  try {
    const { GoogleSpreadsheet } = require('google-spreadsheet');
    const { JWT } = require('google-auth-library');

    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT) {
      console.warn('⚠️  Google Sheets not fully configured');
      return;
    }

    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['ความคิดเห็น'];
    if (!sheet) {
      console.error('Sheet "ความคิดเห็น" not found');
      return;
    }

    const pillarNames = {
      'pillar1': 'พัฒนาศักยภาพการบริการตรวจวินิจฉัยโรคของประเทศไทย',
      'pillar2': 'เสริมสร้างความเข้มแข็งและยกระดับมาตรฐานอุตสาหกรรมชีวเภสัชภัณฑ์ วัคซีน และผลิตภัณฑ์การแพทย์ขั้นสูง',
      'pillar3': 'พัฒนาศูนย์ทดสอบมาตรฐานเครื่องมือแพทย์ระดับชาติแบบครบวงจร',
      'pillar4': 'สนับสนุนและพัฒนาศักยภาพอุตสาหกรรมอาหารใหม่ของประเทศไทย',
      'pillar5': 'ยกระดับสมุนไพรไทยสู่ยาและผลิตภัณฑ์สุขภาพระดับสากล',
      'pillar6': 'สนับสนุนเส้นทางการท่องเที่ยวสุขภาพแบบครบวงจร'
    };

    const staffTypeNames = {
      'internal': 'บุคคลภายใน',
      'external': 'บุคคลภายนอก'
    };

    await sheet.addRow({
      'เสาหลัก': pillarNames[feedbackItem.pillar] || feedbackItem.pillar,
      'ความคิดเห็น': feedbackItem.text,
      'ประเภท': staffTypeNames[feedbackItem.staffType] || feedbackItem.staffType,
      'ผู้ส่ง': feedbackItem.author,
      'วันเวลา': new Date(feedbackItem.timestamp).toLocaleString('th-TH'),
      'ID': feedbackItem.id
    });

    console.log(`✅ Saved to Google Sheets: ${feedbackItem.id}`);
  } catch (error) {
    console.error('Google Sheets error:', error.message);
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'display.html'));
});

app.get('/api/feedback', (req, res) => {
  res.json({
    feedback,
    participantCount: participants.size,
    totalFeedback: feedback.length
  });
});
