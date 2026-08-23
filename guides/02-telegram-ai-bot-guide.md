# 🤖 Guide 02: Telegram AI Bot (10-Minute Setup)

## Objective
Build an AI-powered Telegram chatbot that listens for user messages, generates an intelligent answer using Gemini / Groq, and replies in Telegram in real-time.

---

## Step 1: Create Your Telegram Bot
1. Open Telegram and search for **`@BotFather`**.
2. Send `/newbot`.
3. Choose a name (e.g. `Divflow Assistant`) and a username (e.g. `divflow_ai_bot`).
4. Copy the **HTTP API Bot Token** provided by BotFather.

---

## Step 2: Configure Telegram Trigger in n8n
1. In n8n, create a new workflow and add the **Telegram Trigger** node.
2. Under **Credentials**, add your Bot Token.
3. Set **Updates**: `message`.
4. Click **Listen for Test Event** and send a message to your bot on Telegram to verify incoming data.

---

## Step 3: Connect AI Model & Reply
1. Add an **AI Agent** or **Google Gemini / OpenAI** node.
2. Set the prompt: `{{ $json.message.text }}`.
3. System message: `"You are Divflow, a friendly and concise AI assistant."`
4. Add a **Telegram Node (Send Message)**:
   - **Chat ID**: `{{ $json.message.chat.id }}`
   - **Text**: `{{ $json.output }}`
5. Activate the workflow!
