# 🧠 Guide 06: Hermes Autonomous Agents

## What is an Autonomous Agent?
Unlike linear workflows, an autonomous agent operates in a continuous **Reasoning + Action (ReAct)** loop:
1. **Goal**: User gives a broad task (e.g., *"Research top 5 competitors for this brand and draft a comparison report"*).
2. **Tools**: The agent is provided tools (Search, Web Scraper, Google Docs, CRM API).
3. **Execution**: The agent autonomously queries tools, evaluates results, and loops until the goal is achieved.

---

## Building an Agent in n8n
1. Use the **AI Agent** node in n8n.
2. Attach an LLM (Gemini 2.5 Flash / Groq Llama 3.3).
3. Attach Tools:
   - **HTTP Request Tool** (Custom API calls)
   - **Calculator Tool**
   - **Search / Wikipedia Tool**
   - **Custom Code Tool**
4. Set memory to **Window Buffer Memory** for multi-turn context retention.
