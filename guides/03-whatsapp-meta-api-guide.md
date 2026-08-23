# 💬 Guide 03: WhatsApp Automation with Meta Cloud API

## Objective
Connect official WhatsApp Cloud API directly to n8n to receive customer messages, route inquiries, and reply automatically.

---

## Step 1: Create Meta Developer App
1. Go to [developers.facebook.com](https://developers.facebook.com/) and create a Developer Account.
2. Click **Create App** $\rightarrow$ Select **Other** $\rightarrow$ Select **Business**.
3. Under Add Products, find **WhatsApp** and click **Set up**.
4. You will receive a **Test Phone Number**, **Phone Number ID**, and a **Temporary Access Token**.

---

## Step 2: Set Up n8n Webhook Verification
Meta requires a one-time GET verification handshake for webhooks:
1. In n8n, add a **Webhook Node** (HTTP Method: `GET`, Path: `whatsapp`).
2. Add a **Code Node** to respond to Meta's verification challenge:
```javascript
const mode = $json.query['hub.mode'];
const token = $json.query['hub.verify_token'];
const challenge = $json.query['hub.challenge'];

if (mode === 'subscribe' && token === 'divflow_verify_token_123') {
  return [{ json: { body: challenge } }];
}
throw new Error('Verification token mismatch');
```

3. In Meta App Dashboard $\rightarrow$ **WhatsApp** $\rightarrow$ **Configuration** $\rightarrow$ **Callback URL**:
   - URL: `https://<YOUR-TUNNEL-URL>/webhook/whatsapp`
   - Verify Token: `divflow_verify_token_123`
   - Subscribe to the **`messages`** field.

---

## Step 3: Handle Incoming Messages & Reply via HTTP Node
1. Switch Webhook node to handle **POST** requests.
2. Add an **HTTP Request Node** to send a WhatsApp message:
   - **Method**: `POST`
   - **URL**: `https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages`
   - **Headers**: `Authorization: Bearer <WHATSAPP_TOKEN>`
   - **Body (JSON)**:
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.entry[0].changes[0].value.messages[0].from }}",
  "type": "text",
  "text": { "body": "Hello from Divflow! How can I help you today?" }
}
```
