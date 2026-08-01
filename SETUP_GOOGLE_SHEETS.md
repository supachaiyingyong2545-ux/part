# 🔧 ตั้งค่า Google Sheets Integration

## 1️⃣ เตรียม Google Sheet

✅ Sheet ID: `1x6ZrmiPFY_TZXXAgPYfrt87FOrQ5ykqKZjGRInLbgMU`  
✅ Sheet Name: `ความคิดเห็น`  
✅ คอลัมน์ที่ต้องมี:
- เสาหลัก
- ความคิดเห็น
- ประเภท
- ผู้ส่ง (ตัวเลือก)
- วันเวลา (ตัวเลือก)
- ID (ตัวเลือก)

---

## 2️⃣ สร้าง Service Account (Google Cloud Console)

### ขั้นตอน:

1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้าง Project ใหม่ (หรือใช้โปรเจกต์เดิม)
3. เปิด **APIs & Services** → **Credentials**
4. คลิก **Create Credentials** → **Service Account**
5. กรอกรายละเอียด:
   - Service Account Name: `dmsc-feedback-system`
   - Description: `DMSc CONNECT Feedback System`
6. คลิก **Create and Continue**
7. เพิ่มบทบาท: `Editor`
8. คลิก **Continue** → **Done**

### ดาวน์โหลด JSON Key:

1. ไปที่ **Service Accounts**
2. คลิกที่ Service Account ที่สร้าง
3. ไปที่ **Keys** tab
4. **Add Key** → **Create new key** → **JSON**
5. File JSON จะดาวน์โหลดมา

---

## 3️⃣ เปิดใช้ Google Sheets API

1. ไปที่ **APIs & Services** → **Library**
2. ค้นหา "Google Sheets API"
3. คลิก **Enable**

---

## 4️⃣ แชร์ Google Sheet กับ Service Account

1. เปิด JSON file ที่ดาวน์โหลด
2. คัดลอก `client_email` (เช่น: `dmsc-feedback@your-project.iam.gserviceaccount.com`)
3. ไปที่ Google Sheet
4. คลิก **Share**
5. ใส่ email ของ Service Account
6. เลือก **Editor**
7. Send

---

## 5️⃣ ตั้งค่า .env

1. สร้าง `.env` จากตัวอย่าง:

```bash
cp .env.example .env
```

2. แก้ไข `.env`:

```env
PORT=3000
GOOGLE_SHEET_ID=1x6ZrmiPFY_TZXXAgPYfrt87FOrQ5ykqKZjGRInLbgMU
GOOGLE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"your_key_id","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEv...YOUR_KEY...\n-----END PRIVATE KEY-----\n","client_email":"dmsc-feedback@your-project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}
NODE_ENV=development
```

### วิธีคัดลอก JSON Key:

1. เปิด JSON file ที่ดาวน์โหลด
2. คัดลอก **ทั้งหมด**
3. ใส่ใน `GOOGLE_SERVICE_ACCOUNT` (ต้องเป็น JSON string หนึ่งบรรทัด)

---

## 6️⃣ ทดสอบระบบ

```bash
# ติดตั้ง dependencies
npm install

# รัน server
npm start

# เปิด:
# - โทรศัพท์: http://localhost:3000
# - จอแสดงผล: http://localhost:3000/display
```

ส่งความคิดเห็นทดสอบและตรวจสอบ Google Sheet 📊

---

## ❌ แก้ไขปัญหา

### "Sheet 'ความคิดเห็น' not found"
✅ ตรวจสอบชื่อชีตใน Google Sheet ให้ตรงกับ `ความคิดเห็น`

### "Invalid service account"
✅ ตรวจสอบว่า JSON key ถูกคัดลอก และ Service Account มี Editor permission

### "PERMISSION_DENIED"
✅ แชร์ Google Sheet กับ email ของ Service Account

### ไม่ส่งข้อมูล
✅ เปิด Console (F12) ดูข้อความผิดพลาด  
✅ ตรวจสอบ `.env` ว่าถูกต้อง

---

## 📝 ตัวอย่าง JSON Service Account

```json
{
  "type": "service_account",
  "project_id": "dmsc-connect-project",
  "private_key_id": "1234567890abcdef",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "dmsc-feedback@dmsc-connect-project.iam.gserviceaccount.com",
  "client_id": "1234567890",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dmsc-feedback%40dmsc-connect-project.iam.gserviceaccount.com"
}
```

---

**ติดตั้งเสร็จ! 🎉**
