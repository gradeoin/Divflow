# 📨 Guide 05: Gmail AI Lead Extraction & Auto-Responder

## Objective
Automatically monitor inbound customer emails, classify lead intent, save lead details, and generate tailored draft responses.

---

## Workflow Steps
1. **Gmail Trigger Node**: Poll for unread messages with query `is:unread -from:me`.
2. **AI Information Extractor Node**:
   - Extract: `Sender Name`, `Company`, `Budget`, `Service Needed`, `Urgency`.
3. **Branching (Switch Node)**:
   - If Urgency == High $\rightarrow$ Send alert to Telegram / Discord.
   - If Standard Lead $\rightarrow$ Draft response in Gmail.
4. **Gmail Node (Create Draft)**:
   - To: `{{ $json.from }}`
   - Subject: `Re: {{ $json.subject }}`
   - Body: `{{ $json.ai_draft }}`
