// ============================================================
// 🔥 إعدادات Firebase — عدّل هذه القيم بإعداداتك الخاصة
// ============================================================
// كيفية الحصول على هذه القيم:
// 1. افتح https://console.firebase.google.com
// 2. أنشئ مشروعاً جديداً أو افتح مشروعك الحالي
// 3. اذهب إلى: Project Settings > Your apps > Web app
// 4. انسخ firebaseConfig وضعه هنا
// ============================================================

const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ============================================================
// إعدادات التطبيق
// ============================================================
const APP_CONFIG = {
  name:       "النظام المتكامل",
  version:    "2.0.0",
  pageSize:   15,          // عدد السجلات في الصفحة
  warnDays:   30,          // أيام التنبيه لانتهاء الترخيص
};
