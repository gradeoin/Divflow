# 🏢 Guide 04: Chatwoot CRM + WhatsApp Omnichannel Integration

## Objective
Seamlessly bridge WhatsApp messages into **Chatwoot** (an open-source customer support inbox). AI handles routine questions, and when human intervention is needed, the chat escalates to live support agents.

---

## Architecture Flow
```
Customer (WhatsApp) ---> n8n Webhook Router
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Routine AI Response]            [Human Agent Escalation]
   AI answers FAQ                   Status set to 'Open' in Chatwoot
   Chat status: 'bot'               Human agent takes over chat
```

---

## Key Integration Steps
1. **Create Chatwoot Account / Self-Host**: Use [app.chatwoot.com](https://app.chatwoot.com) or local Docker.
2. **Create API Channel in Chatwoot**: Settings $\rightarrow$ Inboxes $\rightarrow$ Add Inbox $\rightarrow$ **API Channel**.
3. **Webhook Sync**:
   - When a customer messages WhatsApp $\rightarrow$ n8n creates a contact & conversation in Chatwoot using `/api/v1/accounts/{id}/conversations`.
   - When human agent replies in Chatwoot $\rightarrow$ Chatwoot webhook notifies n8n $\rightarrow$ n8n sends WhatsApp message to the customer.
