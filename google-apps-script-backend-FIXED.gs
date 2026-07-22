/**
 * RIMS Manage - Google Apps Script Backend (FIXED - API Gateway with CORS)
 *
 * ขั้นตอนการใช้:
 * 1. Copy โค้ดทั้งหมดจากไฟล์นี้
 * 2. ไปที่ Google Apps Script ของคุณ
 * 3. ลบโค้ดเก่าทั้งหมด
 * 4. Paste โค้ดใหม่
 * 5. Deploy > New deployment > Web app
 * 6. Copy Deployment URL ใหม่
 */

const SPREADSHEET_ID = '1ZPvtaeiHVDEYjbqjYJR5KNCsFrFOQ3K9no8EfQNSAtI';

function doGet(e) {
  const path = e.parameter.path || '';

  try {
    if (path === 'system-link') {
      return sendJSON({
        success: true,
        link: getSystemLink()
      });
    }
    else if (path === 'dashboard') {
      return sendJSON(JSON.parse(getDashboardData()));
    }
    else if (path === 'mou') {
      return sendJSON(getMouData());
    }
    else {
      return sendJSON({
        success: false,
        message: 'Unknown endpoint'
      });
    }
  } catch (error) {
    return sendJSON({
      success: false,
      message: error.toString()
    });
  }
}

function doPost(e) {
  return sendJSON({ success: true, message: 'OK' });
}

function getSystemLink() {
  return 'https://moph.link/RIMS';
}

function sendJSON(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return output;
}

function getDashboardData() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    var personalRaw = getSheetDataSafe(ss, 'ข้อมูลส่วนตัว');
    var researchRaw = getSheetDataSafe(ss, 'ข้อมูลวิจัย');
    var coordRaw = getSheetDataSafe(ss, 'ผู้ประสานงาน');
    var newsRaw = getSheetDataSafe(ss, 'ข่าวสาร');

    var personalCols = ['คำนำหน้า', 'ชื่อ - นามสกุล', 'วันเดือนปีเกิด', 'ปีเกิด', 'อายุ', 'e-mail', 'เบอร์โทรศัพท์', 'เบอร์โทรภายใน', 'หน่วยงาน', 'สถานะนักวิจัย', 'ปีที่บรรจุเข้าทำงาน', 'ประเภทบุคลากร', 'ตำแหน่งทางวิชาการ', 'สาขาความเชี่ยวชาญ', 'ความเชี่ยวชาญ', 'ระดับการศึกษาสูงสุด', 'ปีที่จบ', 'สาขาที่จบ', 'รหัสนักวิจัย', 'สถานะ'];
    var researchCols = ['รหัสนักวิจัย', 'ชื่อผลงานวิจัย', 'ปีที่ดำเนินงาน', 'บทบาทหน้าที่', 'สัดส่วน %', 'ผลงานตีพิมพ์', 'วารสาร', 'ปีที่ตีพิมพ์', 'ลิงก์หลักฐาน'];
    var coordCols = ['ชื่อ-นามสกุล', 'หน่วยงาน', 'เบอร์โทร', 'สถานะผู้ประสาน'];
    var newsCols = ['หัวข้อข่าว'];

    return JSON.stringify({
      success: true,
      researchers: extractDataRobust(personalRaw, personalCols),
      projects: extractDataRobust(researchRaw, researchCols),
      coordinators: extractDataRobust(coordRaw, coordCols),
      news: extractDataRobust(newsRaw, newsCols)
    });

  } catch (e) {
    return JSON.stringify({ success: false, message: e.toString() });
  }
}

function getMouData() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var mouRaw = getSheetDataSafe(ss, 'MOU');

    var mouCols = ['รหัส MOU', 'ชื่อบันทึก', 'หน่วยงานคู่จัดทำ MOU', 'หน่วยงานที่รับผิดชอบ', 'สถานะ', 'ระยะเวลาเริ่มต้น', 'ระยะเวลาสิ้นสุด', 'ผู้รับผิดชอบ/ผู้ประสาน', 'ติดต่อ', 'ประเภทองค์กร', 'ประเภท', 'วัตถุประสงค์', 'ด้านการศึกษาและวิจัย', 'สนับสนุน/พัฒนา การใช้เครื่องมือและห้องปฏิบัติการในการดำเนินงาน', 'ด้านการพัฒาระบบประกันคุณภาพห้องปฏิบัติการ', 'ด้านวิชาการและพัฒนาบุคลากร', 'หมายเหตุ', 'MOUจริง', 'ความก้าวหน้าMOU'];

    return JSON.stringify({
      success: true,
      data: extractDataRobust(mouRaw, mouCols)
    });
  } catch (error) {
    return JSON.stringify({ success: false, error: error.toString() });
  }
}

function getSheetDataSafe(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function extractDataRobust(raw, expectedColumns) {
  if (!raw || raw.length < 2) return [];

  var sheetHeaders = raw[0].map(function(h) {
    return h.toString().replace(/[\s\n]+/g, '').toLowerCase();
  });

  var colIndices = {};
  expectedColumns.forEach(function(colName) {
    var cleanColName = colName.replace(/[\s\n]+/g, '').toLowerCase();
    var idx = -1;
    for (var i = 0; i < sheetHeaders.length; i++) {
      if (sheetHeaders[i] === cleanColName || sheetHeaders[i].indexOf(cleanColName) !== -1) {
        idx = i;
        break;
      }
    }
    colIndices[colName] = idx;
  });

  var data = [];
  for (var i = 1; i < raw.length; i++) {
    var row = raw[i];
    var obj = {};
    var isEmptyRow = true;

    expectedColumns.forEach(function(colName) {
      var idx = colIndices[colName];
      var val = (idx !== -1 && row[idx] !== undefined && row[idx] !== null) ? row[idx] : "";

      val = val.toString().trim();
      obj[colName] = val;

      if (val !== "") isEmptyRow = false;
    });

    if (!isEmptyRow) data.push(obj);
  }
  return data;
}
