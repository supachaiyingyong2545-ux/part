# 🚀 Deploy DMSc CONNECT - Simple Version

## 📋 ไฟล์ที่ต้องมี

1. **index.html** - ไฟล์เดี่ยว (Mobile Form + TV Display)
2. **Code.gs** - Google Apps Script

---

## 🔧 ขั้นตอนการติดตั้ง

### Step 1: เตรียม Google Apps Script

1. เปิด Google Sheet: 
   https://docs.google.com/spreadsheets/d/1x6ZrmiPFY_TZXXAgPYfrt87FOrQ5ykqKZjGRInLbgMU/

2. ไปที่ **Extensions** → **Apps Script**

3. ลบโค้ดเดิม และคัดลอก **Code.gs** ทั้งหมดเข้ามา

4. บันทึก (Ctrl+S)

### Step 2: Deploy as Web App

1. คลิก **Deploy** (ปุ่มสีน้ำเงิน)
2. เลือก **New deployment**
3. Type: **Web app**
4. Execute as: **Your Account**
5. Who has access: **Anyone**
6. คลิก **Deploy**
7. ✅ **คัดลอก URL** ที่ได้

### Step 3: อัปเดต index.html

ค้นหาบรรทัดนี้:

```javascript
const GAS_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent';
```

แทนที่ `YOUR_DEPLOYMENT_ID` ด้วย URL ที่ได้จาก Step 2

---

## 📱 ใช้งาน

### **หน้าโทรศัพท์ / QR Code** (Mobile Form)
```
https://your-domain/index.html
```

### **หน้าจอ TV** (Display Screen)
```
https://your-domain/index.html?display=1
```

---

## ✅ ทดสอบ

1. เปิด **หน้าโทรศัพท์** และส่งความคิดเห็น
2. เปิด **หน้าจอ TV** → ความคิดเห็นควรปรากฏทันที
3. ตรวจสอบ Google Sheet → ข้อมูลควรบันทึกเข้า

---

## 📊 Sheet Structure

ชีต **"ความคิดเห็น"** ต้องมีคอลัมน์:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| เสาหลัก | ความคิดเห็น | ประเภท | ผู้ส่ง | วันเวลา | ID |

---

## 🎨 การจัดการจอ TV

```bash
# หน้าโทรศัพท์ (เปิดในโทรศัพท์)
https://domain/index.html

# หน้าจอ TV (เปิดในจอใหญ่)
https://domain/index.html?display=1

# เปิด URL ในเบราว์เซอร์ของจอ TV
- ตั้ง fullscreen
- ปิด taskbar
```

---

**เสร็จ! ระบบพร้อมใช้** 🎉
