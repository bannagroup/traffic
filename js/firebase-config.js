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
  apiKey:            "AIzaSyBiRE-Zj6GKOOwe4IAdEPblfk40kTi8jxU",
  authDomain:        "car-traffic-9828b.firebaseapp.com",
  projectId:         "car-traffic-9828b",
  storageBucket:     "car-traffic-9828b.firebasestorage.app",
  messagingSenderId: "554924112638",
  appId:             "1:554924112638:web:12ab897a31c579782083af"
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
