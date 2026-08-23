# 🌊 Divflow

> **Modern, Zero-Cost AI Automation Engine & Workflow Hub**  
> Built for local execution, n8n orchestration, autonomous AI agents, and omnichannel messaging (WhatsApp, Telegram, Discord, Gmail, Chatwoot).

---

## ⚡ Overview

**Divflow** is a complete, production-ready AI automation suite running directly on your local hardware at **₹0 cost**. It connects messaging platforms and webhooks to modern AI models (Google Gemini / Groq Llama 3) and CRMs without requiring paid servers.

```
+-----------------------------------------------------------------------------------+
|                                DIVFLOW ARCHITECTURE                               |
+-----------------------------------------------------------------------------------+
|  [Triggers & Platforms]   --->  [Divflow n8n Engine]  --->  [AI Models & Actions] |
|   • WhatsApp (Meta API)          • Local Workflow Engine     • Gemini / Groq LLMs |
|   • Telegram Bot                 • Webhook Routing           • Chatwoot CRM       |
|   • Gmail & Discord              • Cloudflare Free Tunnel    • Databases / Sheets |
+-----------------------------------------------------------------------------------+
```

---

## 🛠️ Quick Start (1-Click Local Execution)

### 1. Launch n8n Locally
Open PowerShell and run:
```powershell
.\scripts\start-n8n.ps1
```
Open **http://localhost:5678** in your browser.

### 2. Expose Webhooks for External Platforms (Free Tunnel)
In a new PowerShell window, run:
```powershell
.\scripts\start-tunnel.ps1
```
This creates a free, secure HTTPS URL (via Cloudflare Quick Tunnel) for WhatsApp and Telegram webhooks.

---

## 📂 Repository Structure

```
Divflow/
├── .env.example            # Environment variables template
├── .gitignore              # Sensitive data exclusions
├── README.md               # Main project documentation
├── scripts/                # Automated launch & helper scripts
│   ├── start-n8n.ps1       # Starts n8n locally with persistent storage
│   └── start-tunnel.ps1    # Free Cloudflare HTTPS tunnel for webhooks
├── workflows/              # Exported n8n workflow templates (JSON)
│   ├── 01-telegram-ai-bot.json
│   ├── 02-whatsapp-meta-cloud.json
│   └── 03-gmail-lead-extractor.json
├── guides/                 # Step-by-step masterclass documentation
│   ├── 01-environment-setup.md
│   ├── 02-telegram-ai-bot-guide.md
│   ├── 03-whatsapp-meta-api-guide.md
│   ├── 04-chatwoot-crm-integration.md
│   ├── 05-gmail-ai-responder-guide.md
│   └── 06-hermes-autonomous-agents.md
└── templates/              # Sample webhook payloads & verification scripts
```

---

## 🚀 Projects Included

1. **🤖 Telegram AI Assistant** - Live conversational AI bot using Telegram Bot API and Gemini.
2. **💬 WhatsApp Cloud API Automation** - Official Meta Cloud API webhook handler with smart AI responses.
3. **📨 Gmail Lead Extractor** - Automated inbound email monitoring, intent classification, and draft replies.
4. **🏢 Chatwoot CRM Omnichannel Support** - AI auto-replies with human agent handover routing.
5. **🧠 Hermes Autonomous Agents** - Multi-step goal-directed AI tool execution.

---

## 💰 Zero-Cost Guarantee (₹0 Spent)
* **Workflow Engine:** n8n Self-Hosted (Free & Open Source)
* **AI Models:** Google AI Studio (Gemini 2.5/1.5 Flash Free Tier) & Groq Cloud
* **Webhook Tunneling:** Cloudflare Quick Tunnel (100% Free Forever)
* **Bot APIs:** Telegram Bot API (Free) & Meta WhatsApp Cloud API (1,000 free conversations/mo)
