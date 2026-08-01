# 🚀 Deploy Guide - DMSc CONNECT Single HTML + Google Apps Script

## 📋 ไฟล์ที่ต้องมี

1. **index.html** - HTML file เดี่ยว (mobile + display)
2. **Code.gs** - Google Apps Script file

---

## 🔧 Step-by-Step

### Step 1: สร้าง Apps Script ใน Google Sheet

1. เปิด Google Sheet: https://docs.google.com/spreadsheets/d/1x6ZrmiPFY_TZXXAgPYfrt87FOrQ5ykqKZjGRInLbgMU/
2. ไปที่ **Extensions** → **Apps Script**
3. ลบโค้ดเดิม (ถ้ามี) และคัดลอก **Code.gs** ทั้งหมดเข้ามา
4. บันทึก (Ctrl+S)

### Step 2: Deploy Google Apps Script as Web App

1. ที่หน้า Apps Script:
   - คลิก **Deploy** (ปุ่มสีน้ำเงิน)
   - เลือก **New deployment**
   - Type: **Web app**
2. ตั้งค่า:
   - **Execute as**: ผู้ใช้ Google Account ของคุณ
   - **Who has access**: **Anyone**
3. คลิก **Deploy**
4. **✅ คัดลอก Deployment URL** (เช่น: `https://script.google.com/macros/s/A...usercontent`)

### Step 3: อัปเดต index.html

ค้นหา บรรทัดนี้ใน index.html:

```javascript
const gasUrl = params.get('gasUrl') || 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent';
```

แทนที่ `YOUR_DEPLOYMENT_ID` ด้วย URL ที่ได้จาก Step 2

### Step 4: โฮสต์ HTML File

**ตัวเลือก A: GitHub Pages**
1. Push `index.html` ขึ้น GitHub
2. ไปที่ Settings → Pages
3. Deploy from main branch
4. ใช้ URL: `https://your-username.github.io/part/?mode=mobile`

**ตัวเลือก B: Google Drive (แนะนำ)**
1. เปิด Google Drive
2. Upload `index.html`
3. Right-click → Open with → Google Apps Script Editor
4. Copy as HTML link

**ตัวเลือก C: ท้องถิ่น (Local)**
1. ดาวน์โหลด `index.html`
2. เปิดในเบราว์เซอร์

---

## 📱 ใช้งาน

### หน้าโทรศัพท์ (Mobile Form)
```
https://your-domain.com/index.html?mode=mobile&gasUrl=YOUR_GAS_URL
```

### หน้าจอแสดงผล (Display Screen)
```
https://your-domain.com/index.html?mode=display&gasUrl=YOUR_GAS_URL
```

---

## 📊 Google Sheet Structure

ให้แน่ใจว่าชีต **"ความคิดเห็น"** มีคอลัมน์ดังนี้:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| เสาหลัก | ความคิดเห็น | ประเภท | ผู้ส่ง | วันเวลา | ID |

---

## ✅ ทดสอบระบบ

1. ไปที่ **หน้าโทรศัพท์**: ส่งความคิดเห็นทดสอบ
2. ตรวจสอบ **Google Sheet**: ข้อมูลควรปรากฏในชีต "ความคิดเห็น"
3. ไปที่ **หน้าจอแสดงผล**: ข้อมูลควรแสดง

---

## ❌ แก้ไขปัญหา

### "Fetch error" หรือ CORS error
✅ ตรวจสอบ:
- GAS URL ถูกต้องและ deployed
- Deployment permissions: "Anyone"
- ลองดู Browser Console (F12)

### ไม่เห็นข้อมูลใน Sheet
✅ ตรวจสอบ:
- ชีตชื่อ "ความคิดเห็น" ตรง
- คอลัมน์ชื่อตรงกับ Code.gs
- ไม่มี error ใน Apps Script logs

### "Invalid action"
✅ ตรวจสอบ:
- GAS URL ถูกต้อง
- Deploy type: Web app
- Execute as: your account

---

## 🔄 Update Code

ถ้าต้องแก้ไข `Code.gs`:
1. ไปที่ Apps Script
2. แก้ไขโค้ด
3. บันทึก
4. Deploy → **Deploy** → **Update** (เลือก existing deployment)

ถ้าต้องแก้ไข `index.html`:
1. ลบ deployment เดิม
2. Deploy ใหม่ได้เลย (ไม่ต้อง update)

---

## 📧 QR Code

ใน `index.html` ที่บรรทัด:
```javascript
<div class="qr-code">📱 QR</div>
```

แทนที่ด้วย:
```javascript
<div id="qrContainer" class="qr-code"></div>
```

และเพิ่มสคริปต์:
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
    new QRCode(document.getElementById('qrContainer'), {
        text: window.location.href.replace('?mode=display', '?mode=mobile'),
        width: 160,
        height: 160,
        colorDark: '#1769C2',
        colorLight: '#F2F9FF'
    });
</script>
```

---

**ติดตั้งเสร็จ! 🎉**
