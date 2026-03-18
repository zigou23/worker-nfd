# Telegram 匿名留言/轉發機器人 (Cloudflare Worker)

<p align="right">
  <a href="#">中文</a> | 
  <a href="./README_en.md">English</a>
</p>

這是一個基於 Cloudflare Workers 的無伺服器 Telegram 機器人，能作為您與訪客之間的安全溝通橋樑。訪客傳送訊息給機器人並通過簡單的數學驗證碼後，訊息將會轉發給您。您可以直接在 Telegram 中回覆他們。

## ✨ 主要功能

- **數學驗證碼防護**：防範垃圾訊息機器人，驗證時效為 60 秒，答錯將封禁 5 分鐘。
- **雙語支援**：訪客與管理員介面皆支援繁體中文與英文。
- **Telegram 內建管理面板**：直接回覆訊息即可與訪客對話，或呼叫互動式選單來管理設定。
- **關鍵字過濾**：管理員可新增/刪除屏蔽詞，包含這些詞彙的訊息將被攔截。
- **詐騙庫整合**：自動比對遠端詐騙資料庫，若遇可疑 UID 將觸發警報。
- **免費無伺服器架構**：運行於 Cloudflare Workers 並使用 KV 作為資料庫。

------

## 🚀 網頁版部署教學

您無需使用任何命令列工具，只要透過瀏覽器在 Cloudflare 控制台即可完成部署。

## 第一步：準備工作

1. 在 Telegram 尋找 [@BotFather](https://t.me/botfather) 建立機器人並取得 **Bot Token**。
2. 在 Telegram 尋找 [@userinfobot](https://t.me/userinfobot) 獲取您個人的 **Telegram User ID**（一串純數字）。
3. 準備好一個 [Cloudflare 帳號](https://dash.cloudflare.com/)。

## 第二步：建立 KV 命名空間 (KV Namespace)

1. 登入 Cloudflare 控制台。
2. 前往 **Workers 與 Pages** > **KV** (位於儲存空間分類下)。
3. 點擊 **建立命名空間**。命名為 `telegram_bot_data` (或任意名稱) 並新增。

## 第三步：建立 Worker

1. 前往 **Workers 與 Pages** > **總覽**。
2. 點擊 **建立應用程式** > **建立 Worker**。
3. 為您的 Worker 命名 (例如 `stranger-chat-bot`) 並點擊 **部署**。
4. 部署完成後，點擊 **編輯程式碼**。
5. 清除預設的程式碼，貼上您提供的 JavaScript 程式碼，然後點擊 **部署**。

## 第四步：設定綁定與環境變數

1. 回到該 Worker 的控制台頁面。
2. 前往 **設定** > **變數**。
3. 向下滑動至 **KV 命名空間綁定**，點擊 **新增綁定**：
   - **變數名稱**：`nfd` *(⚠️ 必須完全一致，程式碼才能正常運作！)*
   - **KV 命名空間**：選擇您在第二步建立的命名空間。
4. 滑動至 **環境變數** 並新增以下三個變數：
   - `ENV_BOT_TOKEN`：您的 Telegram 機器人 Token (來自 [@BotFather](https://t.me/botfather))。
   - `ENV_ADMIN_UID`：從 [@userinfobot](https://t.me/userinfobot) 取得您個人的 Tg UID。
   - `ENV_BOT_SECRET`：自訂一組安全的隨機密碼 (僅限使用A-Z, a-z, 0-9, _, -)。[uuidgenerator](https://www.uuidgenerator.net/)
5. 點擊 **部署** / **儲存**。

## 第五步：註冊 Webhook

為了讓 Telegram 知道要把訊息傳給您的 Cloudflare Worker，請開啟新的瀏覽器分頁並造訪以下網址： `https://<您的_WORKER_網址>.workers.dev/registerWebhook`

如果畫面顯示 `"Ok"` 代表綁定成功！（如果未來需要解除綁定，請造訪 `/unRegisterWebhook`）。

------

## 📖 使用指南

## 訪客流程

1. 訪客向機器人發送 `/start`。
2. 系統會請訪客選擇語言（English 或 中文）。
3. 機器人會發送一道簡單的數學題驗證碼以確認為真人操作。
4. 驗證通過後，訪客發送的任何訊息都會被默默轉發給您。

## 管理員指令

直接向您的機器人發送任何文字（不要回覆任何訊息），即可開啟 **互動式管理員選單**。或者您也可以使用以下指令：

**獨立指令**

- `/setword <詞彙>` — 新增屏蔽詞。包含此詞彙的訊息將不會被轉發。
- `/delword <詞彙>` — 刪除屏蔽詞。
- `/listword` — 查看目前所有的屏蔽詞。

**上下文指令（⚠️ 您必須「回覆」訪客被轉發過來的訊息）**

- **（直接回覆文字）** — 您的文字會被轉發回給該訪客。
- `/info` — 查看該訪客的詳細資料（UID、名稱、用戶名、首次出現時間）。
- `/block` — 封禁該用戶，拒收其未來的所有訊息。
- `/unblock` — 解除封禁。
- `/checkblock` — 檢查該用戶目前的封禁狀態。

*(備註：當有新用戶首次發送訊息時，機器人會在轉發的訊息下方附上快捷按鈕，讓您可以一鍵封禁、解封或查看用戶資訊！)*

## Thanks

- [telegram-bot-cloudflare](https://github.com/cvzi/telegram-bot-cloudflare)
- NFD （[Github](https://github.com/LloydAsp/nfd) & [NodeSeek](https://www.nodeseek.com/post-286885-1)）
- AI auxiliary tools

