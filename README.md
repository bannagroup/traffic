# 🚦 النظام المتكامل — السائقين والمخالفات والتراخيص

نظام متكامل لإدارة السائقين والمخالفات والخصومات والتراخيص، مبني على Google Apps Script + Google Sheets.

## 📁 هيكل الملفات

```
├── Code.gs          ← كود السيرفر (Google Apps Script)
├── Index.html       ← واجهة المستخدم (HTML + CSS + JS)
├── appsscript.json  ← إعدادات المشروع
└── README.md        ← هذا الملف
```

## 🚀 طريقة الرفع على GitHub

### الخطوات:

1. افتح مشروع Apps Script من داخل Google Sheets:
   `الإضافات ← Apps Script`

2. في Apps Script، فعّل GitHub integration عبر **clasp**:
   ```bash
   npm install -g @google/clasp
   clasp login
   clasp clone <SCRIPT_ID>
   ```

3. انسخ الملفات إلى مجلد المشروع وارفعها:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

## 🗂️ الشيتات المطلوبة في Google Sheets

| اسم الشيت                     | الوصف                          |
|-------------------------------|-------------------------------|
| `بيانات_السائقين_والسيارات`   | قائمة السائقين والسيارات       |
| `سجل_المخالفات`               | جميع المخالفات المسجلة         |
| `سجل_الخصومات`               | جميع الخصومات المسجلة          |
| `الحسابات`                    | ملخص حسابات كل سائق            |
| `التقارير`                    | تقارير المخالفات               |
| `البيانات`                    | بيانات السيارات والتراخيص      |
| `إدخال_مخالفات`               | صفحة إدخال المخالفات (شيت)     |
| `إدخال_خصم`                   | صفحة إدخال الخصومات (شيت)      |

> لإنشاء جميع الشيتات تلقائياً: افتح القائمة **🚦 النظام المتكامل** ← **📂 إنشاء النظام كامل**

## 🔥 الحفاظ على بيانات Firebase

إذا كنت تستخدم Firebase للمصادقة أو التخزين الإضافي، أضف config الخاص بك داخل `Index.html` في المكان المخصص:

```html
<!-- Firebase Config — أضفها قبل نهاية الـ <head> -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  const app = initializeApp(firebaseConfig);
</script>
```

> ⚠️ **لا ترفع `firebaseConfig` مع بياناتك الحقيقية على GitHub العام.** استخدم `.env` أو GitHub Secrets.

## ✨ المميزات

- 👤 إدارة السائقين والسيارات (إضافة / تعديل / حذف)
- 🚨 تسجيل المخالفات مع التفاصيل والمبالغ
- 💸 إدارة الخصومات (فردية وجماعية)
- 💰 حسابات تلقائية لكل سائق
- 🪪 متابعة تراخيص السيارات وتنبيهات الانتهاء
- 📊 تقارير شهرية وتصدير Excel
- 📥 استيراد بيانات من Excel
- 🖨️ طباعة إيصالات PDF
- 🔍 بحث ذكي مع إكمال تلقائي

## 📋 متطلبات الصلاحيات

عند نشر التطبيق كـ Web App، تأكد من:
- **Execute as:** Me (your Google account)
- **Who has access:** Anyone (or your domain)
