/**
 * RIMS Manage - Google Apps Script Backend
 * สำหรับใช้ร่วมกับ Netlify Frontend
 *
 * การเตรียม:
 * 1. เปิด Google Apps Script ของคุณ
 * 2. ลบโค้ดเก่าทั้งหมด
 * 3. คัดลอกโค้ดนี้ไปวาง
 * 4. แก้ไข SPREADSHEET_ID ให้ตรงกับ Google Sheet ของคุณ
 * 5. Deploy > New deployment > Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Copy Deployment URL
 */

// ⚙️ แก้ไขตรงนี้: ใส่ ID ของ Google Sheet ของคุณ
const SPREADSHEET_ID = '1kzGil32hil6p9BB2LJIOYf21P6YJ7g5r2ZfrxHEjQVQ';

/**
 * GET endpoint - รับข้อมูลจาก Google Sheet
 * ใช้ path parameter เพื่อเลือกข้อมูล
 *
 * ตัวอย่าง URL:
 * https://script.google.com/macros/d/SCRIPT_ID/usercopy?path=dashboard
 * https://script.google.com/macros/d/SCRIPT_ID/usercopy?path=mou
 * https://script.google.com/macros/d/SCRIPT_ID/usercopy?path=system-link
 */
function doGet(e) {
  const path = e.parameter.path || '';

  try {
    if (path === 'system-link') {
      return sendJSON({
        success: true,
        link: 'https://moph.link/RIMS'
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

/**
 * ส่ง JSON response พร้อม CORS headers
 * เพื่อให้ Netlify สามารถเรียก API ได้
 */
function sendJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * POST endpoint - สำหรับ CORS preflight requests
 */
function doPost(e) {
  return sendJSON({ success: true, message: 'OK' });
}

/**
 * ดึงข้อมูล Dashboard
 * ได้แก่: Researchers, Projects, Coordinators, News
 */
function getDashboardData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    // ดึงข้อมูลจากแต่ละ Sheet
    const personalRaw = getSheetDataSafe(ss, 'ข้อมูลส่วนตัว');
    const researchRaw = getSheetDataSafe(ss, 'ข้อมูลวิจัย');
    const coordRaw = getSheetDataSafe(ss, 'ผู้ประสานงาน');
    const newsRaw = getSheetDataSafe(ss, 'ข่าวสาร');

    // กำหนดคอลัมน์ที่ต้องการ (ต้องตรงกับ Sheet ของคุณ)
    const personalCols = [
      'คำนำหน้า', 'ชื่อ - นามสกุล', 'วันเดือนปีเกิด', 'ปีเกิด', 'อายุ',
      'e-mail', 'เบอร์โทรศัพท์', 'เบอร์โทรภายใน', 'หน่วยงาน', 'สถานะนักวิจัย',
      'ปีที่บรรจุเข้าทำงาน', 'ประเภทบุคลากร', 'ตำแหน่งทางวิชาการ',
      'สาขาความเชี่ยวชาญ', 'ความเชี่ยวชาญ', 'ระดับการศึกษาสูงสุด',
      'ปีที่จบ', 'สาขาที่จบ', 'รหัสนักวิจัย', 'สถานะ'
    ];

    const researchCols = [
      'รหัสนักวิจัย', 'ชื่อผลงานวิจัย', 'ปีที่ดำเนินงาน', 'บทบาทหน้าที่',
      'สัดส่วน %', 'ผลงานตีพิมพ์', 'วารสาร', 'ปีที่ตีพิมพ์', 'ลิงก์หลักฐาน'
    ];

    const coordCols = [
      'ชื่อ-นามสกุล', 'หน่วยงาน', 'เบอร์โทร', 'สถานะผู้ประสาน'
    ];

    const newsCols = [
      'หัวข้อข่าว'
    ];

    // สร้าง response object
    return JSON.stringify({
      success: true,
      researchers: extractDataRobust(personalRaw, personalCols),
      projects: extractDataRobust(researchRaw, researchCols),
      coordinators: extractDataRobust(coordRaw, coordCols),
      news: extractDataRobust(newsRaw, newsCols)
    });

  } catch (e) {
    return JSON.stringify({
      success: false,
      message: e.toString()
    });
  }
}

/**
 * ดึงข้อมูล MOU (Memorandum of Understanding)
 */
function getMouData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const mouRaw = getSheetDataSafe(ss, 'MOU');

    const mouCols = [
      'รหัส MOU', 'ชื่อบันทึก', 'หน่วยงานคู่จัดทำ MOU',
      'หน่วยงานที่รับผิดชอบ', 'สถานะ', 'ระยะเวลาเริ่มต้น',
      'ระยะเวลาสิ้นสุด', 'ผู้รับผิดชอบ/ผู้ประสาน', 'ติดต่อ',
      'ประเภทองค์กร', 'ประเภท', 'วัตถุประสงค์',
      'ด้านการศึกษาและวิจัย',
      'สนับสนุน/พัฒนา การใช้เครื่องมือและห้องปฏิบัติการในการดำเนินงาน',
      'ด้านการพัฒาระบบประกันคุณภาพห้องปฏิบัติการ',
      'ด้านวิชาการและพัฒนาบุคลากร', 'หมายเหตุ', 'MOUจริง', 'ความก้าวหน้าMOU'
    ];

    return {
      success: true,
      data: extractDataRobust(mouRaw, mouCols)
    };
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * ดึงข้อมูลจาก Sheet อย่างปลอดภัย
 * ถ้า Sheet ไม่มี จะคืน array ว่าง
 */
function getSheetDataSafe(ss, sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    return sheet.getDataRange().getDisplayValues();
}

/**
 * ดึงข้อมูลจาก Sheet แบบ Robust (แข็งแกร่ง)
 *
 * ทำการตรวจสอบและจับคู่ชื่อคอลัมน์ อย่างยืดหยุ่น
 * ลบ whitespace และแปลงเป็นตัวพิมพ์เล็ก ก่อนทำการเปรียบเทียบ
 *
 * @param {Array} raw - ข้อมูลดิบจาก Sheet (ทั้งแถวหัวตาราง)
 * @param {Array} expectedColumns - ชื่อคอลัมน์ที่ต้องการ
 * @return {Array} Array ของ objects ที่มีคอลัมน์ที่ต้องการ
 */
function extractDataRobust(raw, expectedColumns) {
  // ถ้าข้อมูลไม่มี หรือมีแค่หัวตาราง ให้คืน array ว่าง
  if (!raw || raw.length < 2) return [];

  // แปลงชื่อคอลัมน์จาก Sheet ให้เป็นตัวพิมพ์เล็ก และลบ whitespace
  const sheetHeaders = raw[0].map(h =>
    h.toString().replace(/[\s\n]+/g, '').toLowerCase()
  );

  // สร้าง mapping ระหว่าง column name และตำแหน่ง index
  const colIndices = {};
  expectedColumns.forEach(colName => {
    const cleanColName = colName.replace(/[\s\n]+/g, '').toLowerCase();
    const idx = sheetHeaders.findIndex(h =>
      h === cleanColName || h.includes(cleanColName)
    );
    colIndices[colName] = idx;
  });

  // ดึงข้อมูลจากแต่ละแถว (เริ่มจากแถวที่ 2 ข้ามหัวตาราง)
  const data = [];
  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const obj = {};
    let isEmptyRow = true;

    // ดึงค่าตามคอลัมน์ที่ต้องการ
    expectedColumns.forEach(colName => {
      const idx = colIndices[colName];
      let val = (idx !== -1 && row[idx] !== undefined && row[idx] !== null)
        ? row[idx]
        : "";

      val = val.toString().trim();
      obj[colName] = val;

      // ถ้าแถวนี้มีข้อมูล ให้เก็บไว้
      if (val !== "") isEmptyRow = false;
    });

    // เพิ่มแถวลงใน array ถ้ามีข้อมูล (ข้ามแถวว่าง)
    if (!isEmptyRow) data.push(obj);
  }

  return data;
}
