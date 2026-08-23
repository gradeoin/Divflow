# 🛠️ Guide 01: Zero-Cost Environment Setup

## 1. Running n8n Locally
Since Node.js is already installed on your system, you can run n8n without any heavy VM:
```powershell
# From the Divflow root directory:
.\scripts\start-n8n.ps1
```
Visit **http://localhost:5678** in your browser. On your first visit, set up an admin account (owner email and password).

---

## 2. Exposing Webhooks for Free (Cloudflare Quick Tunnel)
External platforms (WhatsApp, Telegram, Stripe) cannot communicate with `localhost`. They require a public HTTPS URL.

Run:
```powershell
.\scripts\start-tunnel.ps1
```
This gives you a free HTTPS URL like `https://random-words.trycloudflare.com`.

Whenever you set up webhooks in Meta or Telegram, use:
```
https://<YOUR-TUNNEL-URL>/webhook/<path>
```

---

## 3. Getting Free AI Keys (₹0)
1. **Google Gemini**: Visit [Google AI Studio](https://aistudio.google.com/), click **Get API Key**, and copy it into your `.env`.
2. **Groq (Fast Llama 3)**: Visit [Groq Console](https://console.groq.com/), create a free account, and generate an API key.
