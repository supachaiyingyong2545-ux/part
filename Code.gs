// DMSc CONNECT Feedback System - Google Apps Script
const SHEET_NAME = "ความคิดเห็น";
const SHEET_ID = "1x6ZrmiPFY_TZXXAgPYfrt87FOrQ5ykqKZjGRInLbgMU";

const PILLAR_NAMES = {
  'pillar1': 'พัฒนาศักยภาพการบริการตรวจวินิจฉัยโรคของประเทศไทย',
  'pillar2': 'เสริมสร้างความเข้มแข็งและยกระดับมาตรฐานอุตสาหกรรมชีวเภสัชภัณฑ์ วัคซีน และผลิตภัณฑ์การแพทย์ขั้นสูง',
  'pillar3': 'พัฒนาศูนย์ทดสอบมาตรฐานเครื่องมือแพทย์ระดับชาติแบบครบวงจร',
  'pillar4': 'สนับสนุนและพัฒนาศักยภาพอุตสาหกรรมอาหารใหม่ของประเทศไทย',
  'pillar5': 'ยกระดับสมุนไพรไทยสู่ยาและผลิตภัณฑ์สุขภาพระดับสากล',
  'pillar6': 'สนับสนุนเส้นทางการท่องเที่ยวสุขภาพแบบครบวงจร'
};

const STAFF_TYPE_NAMES = {
  'internal': 'บุคคลภายใน',
  'external': 'บุคคลภายนอก'
};

// ทำให้ CORS ทำงาน
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getAll') {
    return getAllFeedback();
  }

  return HtmlService.createHtmlOutput('Invalid request');
}

// รับ feedback จากฟอร์ม
function doPost(e) {
  try {
    const rawData = e.postData.contents;
    Logger.log('📨 Raw POST data received: ' + rawData);

    const data = JSON.parse(rawData);
    Logger.log('✅ Parsed JSON: ' + JSON.stringify(data));

    if (data.action === 'addFeedback') {
      return addFeedbackToSheet(data);
    }

    if (data.action === 'getFeedback') {
      return getAllFeedback();
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('❌ Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// บันทึกข้อมูล feedback ไป Sheet
function addFeedbackToSheet(data) {
  try {
    Logger.log('🔍 Opening spreadsheet with ID: ' + SHEET_ID);
    const ss = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('📋 Looking for sheet: ' + SHEET_NAME);

    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log('❌ Sheet not found! Available sheets:');
      ss.getSheets().forEach((s, i) => {
        Logger.log('  [' + i + '] ' + s.getName());
      });
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }

    const pillarName = PILLAR_NAMES[data.pillar] || data.pillar;
    const staffTypeName = STAFF_TYPE_NAMES[data.staffType] || data.staffType;
    const timestamp = new Date().toLocaleString('th-TH');

    const row = [
      pillarName,
      data.text,
      staffTypeName,
      data.author || 'Anonymous',
      timestamp,
      Utilities.getUuid()
    ];

    Logger.log('📝 Appending row: ' + JSON.stringify(row));
    sheet.appendRow(row);
    Logger.log('✅ Row appended successfully');

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Feedback saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log('❌ Error in addFeedbackToSheet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ดึงข้อมูล feedback ทั้งหมด
function getAllFeedback() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        feedback: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const feedback = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      feedback.push({
        pillar: row[0],
        text: row[1],
        staffType: row[2],
        author: row[3],
        timestamp: row[4],
        id: row[5],
        likes: 0
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      feedback: feedback.reverse()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      feedback: [],
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
