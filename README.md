# 🍽️ Divflow — Enterprise Restaurant POS & Digital Dining Suite

> **All-in-One Restaurant Management Ecosystem:** Cashier POS, Kitchen Display System (KDS), Customer Digital Dining QR Ordering, and Desktop POS Software.

---

## 🌟 Ecosystem Overview

1. **Manager & Cashier POS (`admin.html`):**
   - Real-time 12-table floor status (*Available, Occupied, In Kitchen, Food Served*).
   - Itemized billing register & GST tax breakdown (CGST + SGST).
   - Live Menu Studio with on-the-fly pricing & 86ing (Sold Out toggle).
   - Day-End Closing Z-Report & Sales Ledger.
   - Guest CRM with 1-click WhatsApp messaging.

2. **Kitchen Display System KDS (`kitchen.html`):**
   - Live Kitchen Order Tickets (KOT) with automated sound chime.
   - Real-time Chef order updates (*Mark as Served*).
   - Price-free kitchen view strictly focused on food preparation.

3. **Digital Dining App (`index.html`):**
   - Contactless QR-code mobile table ordering.
   - FSSAI dietary badges (Veg / Non-Veg) and instant cart review.
   - Table-isolated session management to prevent bill overlap.

4. **Table Standee Studio (`qr.html`):**
   - Print-ready high-resolution QR standees for Tables 1 to 8.

5. **Native Desktop Software (`main.js`, `preload.js`):**
   - Electron desktop app with silent thermal receipt printing.

---

## 🚀 Live Cloud Deployment

* **Manager POS:** [https://divflow.pages.dev/admin.html](https://divflow.pages.dev/admin.html)
* **Kitchen KDS:** [https://divflow.pages.dev/kitchen.html](https://divflow.pages.dev/kitchen.html)
* **Customer Table Menu:** [https://divflow.pages.dev/?table=4](https://divflow.pages.dev/?table=4)
* **Table Standees:** [https://divflow.pages.dev/qr.html](https://divflow.pages.dev/qr.html)

---

## 💻 Desktop App Execution

```bash
npm install
npm start
```

To build the Windows `.exe` installer:
```bash
npm run build:win
```
