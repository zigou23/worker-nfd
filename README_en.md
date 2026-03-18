# Telegram Stranger Chat / Forwarding Bot (Cloudflare Worker)

A serverless Telegram bot built on Cloudflare Workers that acts as a secure bridge between you and guests. Guests can message the bot, pass a quick math captcha, and have their messages forwarded to you. You can reply directly from your Telegram app.

## ✨ Features

- **Math Captcha Verification**: Protects against spam bots with a 60-second timeout and a 5-minute penalty for wrong answers.
- **Bilingual i18n**: Supports both English and Traditional Chinese for guests and admins.
- **Admin Dashboard via Telegram**: Reply to messages to communicate with users, or use an interactive inline menu to manage settings.
- **Word Filtering**: Admin can add or remove blocked words to prevent abusive messages from being forwarded.
- **Fraud Database Integration**: Automatically checks a remote database to alert you of known malicious IDs.
- **Serverless & Free**: Runs efficiently on Cloudflare Workers using Cloudflare KV for storage.

------

## 🚀 Web-Based Deployment Tutorial

You can deploy this bot entirely from your web browser using the Cloudflare Dashboard.

## Step 1: Gather Prerequisites

1. Talk to [@BotFather](https://t.me/botfather) on Telegram to create a bot and get your **Bot Token**.
2. Talk to [@userinfobot](https://t.me/userinfobot) (or similar) to get your personal **Telegram User ID** (a string of numbers).
3. Have a [Cloudflare account](https://dash.cloudflare.com/) ready.

## Step 2: Create a KV Namespace

1. Log in to your Cloudflare Dashboard.
2. Navigate to **Workers & Pages** > **KV** (under Storage).
3. Click **Create a namespace**. Name it something like `telegram_bot_data` and click Add.

## Step 3: Create the Worker

1. Go to **Workers & Pages** > **Overview**.
2. Click **Create Application** > **Create Worker**.
3. Name your worker (e.g., `stranger-chat-bot`) and click **Deploy**.
4. Once deployed, click **Edit code**.
5. Clear the default code, paste the provided JavaScript code into the editor, and click **Deploy**.

## Step 4: Configure Bindings & Environment Variables

1. Go back to your Worker's dashboard page.
2. Navigate to **Settings** > **Variables**.
3. Scroll down to **KV Namespace Bindings** and click **Add binding**:
   - **Variable name**: `nfd` *(⚠️ This exact name is required for the code to work!)*
   - **KV namespace**: Select the namespace you created in Step 2.
4. Scroll to **Environment Variables** and add the following:
   - `ENV_BOT_TOKEN`: Your Telegram bot token (from [@BotFather](https://t.me/botfather)).
   - `ENV_ADMIN_UID`: Obtain your personal Telegram UID from [@userinfobot](https://t.me/userinfobot).
   - `ENV_BOT_SECRET`: Create a random, secure password (only use A-Z, a-z, 0-9, _, -).[uuidgenerator](https://www.uuidgenerator.net/)
5. Click **Deploy** / **Save**.

## Step 5: Register the Webhook

To connect Telegram to your Cloudflare Worker, open a new browser tab and visit the following URL: `https://<YOUR_WORKER_URL>.workers.dev/registerWebhook`

If successful, the page should display `"Ok"`. (If you ever need to disconnect it, visit `/unRegisterWebhook`).

------

## 📖 Usage Guide

## Guest Flow

1. Guests send `/start` to the bot.
2. They are prompted to select a language (English or 中文).
3. A simple math captcha is presented to verify they are human.
4. Once solved, their messages are silently forwarded to you.

## Admin Commands

Send messages directly to your bot (without replying) to open the **Interactive Admin Menu**, or use the following commands:

**Standalone Commands**

- `/setword <word>` — Add a word to the blocked list. Messages containing this word will not be forwarded.
- `/delword <word>` — Remove a word from the blocked list.
- `/listword` — View all currently blocked words.

**Context Commands (You MUST reply to a forwarded guest message)**

- **(Simply reply with text)** — Forwards your text back to that specific guest.
- `/info` — View the user's details (UID, Name, Username, First Seen date).
- `/block` — Block the user from sending further messages.
- `/unblock` — Unblock a previously blocked user.
- `/checkblock` — Check if the user is currently blocked.

*(Note: The bot also attaches handy inline buttons to the first message from any new user, allowing you to quickly block, unblock, or view their info!)*

## Thanks

- [telegram-bot-cloudflare](https://github.com/cvzi/telegram-bot-cloudflare)
- NFD （[Github](https://github.com/LloydAsp/nfd) & [NodeSeek](https://www.nodeseek.com/post-286885-1)）
- AI auxiliary tools