// ── Config ────────────────────────────────────────────────────────────────────
const TOKEN    = ENV_BOT_TOKEN   // from @BotFather
const WEBHOOK  = '/endpoint'
const SECRET   = ENV_BOT_SECRET  // A-Z a-z 0-9 _ -
const ADMIN_UID = ENV_ADMIN_UID  // your Telegram user ID

const CAPTCHA_TIMEOUT  = 60   * 1000   // 1 min to answer captcha
const CAPTCHA_BLOCK    = 5    * 60 * 1000  // 5 min block on wrong answer
 
const fraudDb = 'https://raw.githubusercontent.com/LloydAsp/nfd/main/data/fraud.db'
 
// ── i18n (guest-facing) ───────────────────────────────────────────────────────
const GUEST_I18N = {
  en: {
    selectLang:    '🌐 Please select your language:',
    captchaQ:      (a, op, b) => `🔐 Quick verification: ${a} ${op} ${b} = ?\nPlease reply with the number.`,
    captchaOk:     '✅ Verified! Your message has been forwarded.',
    captchaFail:   '❌ Wrong answer. You are blocked for 5 minutes.',
    captchaExpire: '⏰ Verification timed out. Please resend your message to try again.',
    blocked:       '🚫 You are blocked.',
    tempBlocked:   (m) => `⏳ You are temporarily blocked. Please try again in ${m} minute(s).`,
    wordBlocked:   '🚫 Your message contains prohibited content and was not forwarded.',
  },
  zh: {
    selectLang:    '🌐 請選擇語言：',
    captchaQ:      (a, op, b) => `🔐 快速驗證：${a} ${op} ${b} = ？\n請回覆數字答案。`,
    captchaOk:     '✅ 驗證通過！您的訊息已轉發。',
    captchaFail:   '❌ 答案錯誤，您已被暫時封禁 5 分鐘。',
    captchaExpire: '⏰ 驗證逾時，請重新發送訊息以再次驗證。',
    blocked:       '🚫 您已被封禁。',
    tempBlocked:   (m) => `⏳ 您已被暫時封禁，請 ${m} 分鐘後再試。`,
    wordBlocked:   '🚫 您的訊息含有屏蔽內容，未能轉發。',
  }
}
 
// ── i18n (admin-facing) ───────────────────────────────────────────────────────
const ADMIN_I18N = {
  en: {
    menu:         '⚙️ Admin Menu — what would you like to do?',
    ctxMenu:      (id) => `⚙️ Actions for UID: ${id}`,
    help:         '📋 Reply-context commands (reply to a forwarded message first):\n' +
                  '  /block · /unblock · /checkblock · /info\n\n' +
                  'Standalone commands:\n' +
                  '  /setword <word>   — add a blocked word\n' +
                  '  /delword <word>   — remove a blocked word\n' +
                  '  /listword         — list all blocked words',
    blockOk:      (id) => `✅ Blocked UID: ${id}`,
    unblockOk:    (id) => `✅ Unblocked UID: ${id}`,
    blockSelf:    "❌ Can't block yourself.",
    checkBlock:   (id, b) => `UID: ${id} is ${b ? '🔴 blocked' : '🟢 not blocked'}`,
    wordAdded:    (w) => `✅ Blocked word added: "${w}"`,
    wordRemoved:  (w) => `✅ Removed blocked word: "${w}"`,
    wordNotFound: (w) => `❌ Word not found: "${w}"`,
    wordList:     (ws) => ws.length
      ? `📋 Blocked words (${ws.length}):\n${ws.map(w => `  • ${w}`).join('\n')}`
      : '📋 No blocked words set.',
    userInfo:     (u) => `👤 User Info\n${'─'.repeat(20)}\nUID:        ${u.id}\nName:       ${u.name}\nUsername:   @${u.username || 'none'}\nFirst seen: ${u.firstSeen}`,
    noInfo:       '❌ No stored info for this user.',
    setwordUsage: '⚠️ Usage: /setword <word>',
    delwordUsage: '⚠️ Usage: /delword <word>',
    langSet:      '✅ Language set to English.',
    fraudAlert:   (id) => `⚠️ Fraud database match! UID: ${id}`,
    noCtx:        '⚠️ No guest chat found for that message.',
    // inline button labels
    btnBlock:     '🚫 Block',
    btnUnblock:   '✅ Unblock',
    btnCheckBlock:'🔍 Block Status',
    btnInfo:      '👤 User Info',
    btnListWord:  '📋 Blocked Words',
    btnSwitchLang:'🌐 Switch to 中文',
    btnHelp:      '❓ Help',
  },
  zh: {
    menu:         '⚙️ 管理員選單 — 請選擇操作：',
    ctxMenu:      (id) => `⚙️ 對 UID: ${id} 的操作：`,
    help:         '📋 需要回覆轉發訊息的指令：\n' +
                  '  /block · /unblock · /checkblock · /info\n\n' +
                  '獨立指令：\n' +
                  '  /setword <詞>   — 新增屏蔽詞\n' +
                  '  /delword <詞>   — 刪除屏蔽詞\n' +
                  '  /listword       — 列出所有屏蔽詞',
    blockOk:      (id) => `✅ 已封禁 UID: ${id}`,
    unblockOk:    (id) => `✅ 已解除封禁 UID: ${id}`,
    blockSelf:    '❌ 不能封禁自己。',
    checkBlock:   (id, b) => `UID: ${id} ${b ? '🔴 已封禁' : '🟢 未封禁'}`,
    wordAdded:    (w) => `✅ 已新增屏蔽詞：「${w}」`,
    wordRemoved:  (w) => `✅ 已刪除屏蔽詞：「${w}」`,
    wordNotFound: (w) => `❌ 找不到此屏蔽詞：「${w}」`,
    wordList:     (ws) => ws.length
      ? `📋 屏蔽詞列表（共 ${ws.length} 個）：\n${ws.map(w => `  • ${w}`).join('\n')}`
      : '📋 目前沒有設定屏蔽詞。',
    userInfo:     (u) => `👤 用戶資料\n${'─'.repeat(20)}\nUID：      ${u.id}\n名稱：     ${u.name}\n用戶名：   @${u.username || '無'}\n首次出現： ${u.firstSeen}`,
    noInfo:       '❌ 沒有此用戶的資料。',
    setwordUsage: '⚠️ 用法：/setword <屏蔽詞>',
    delwordUsage: '⚠️ 用法：/delword <屏蔽詞>',
    langSet:      '✅ 語言已設為中文。',
    fraudAlert:   (id) => `⚠️ 詐騙資料庫命中！UID: ${id}`,
    noCtx:        '⚠️ 找不到該訊息對應的用戶。',
    btnBlock:     '🚫 封禁',
    btnUnblock:   '✅ 解封',
    btnCheckBlock:'🔍 封禁狀態',
    btnInfo:      '👤 用戶資料',
    btnListWord:  '📋 屏蔽詞列表',
    btnSwitchLang:'🌐 Switch to English',
    btnHelp:      '❓ 指令說明',
  }
}
 
// Translate helpers
function gt(lang, key, ...args) {
  const d = GUEST_I18N[lang] || GUEST_I18N.zh
  const v = d[key]
  return typeof v === 'function' ? v(...args) : (v ?? key)
}
function at(lang, key, ...args) {
  const d = ADMIN_I18N[lang] || ADMIN_I18N.zh
  const v = d[key]
  return typeof v === 'function' ? v(...args) : (v ?? key)
}
 
// KV helpers
async function getLang(chatId) {
  return (await nfd.get('lang-' + chatId)) || 'zh'
}
async function getAdminLang() {
  return getLang(ADMIN_UID)
}
 
// ── Telegram API helpers ──────────────────────────────────────────────────────
function apiUrl(methodName, params = null) {
  let query = ''
  if (params) query = '?' + new URLSearchParams(params).toString()
  return `https://api.telegram.org/bot${TOKEN}/${methodName}${query}`
}
 
function requestTelegram(methodName, body, params = null) {
  return fetch(apiUrl(methodName, params), body).then(r => r.json())
}
 
function makeReqBody(body) {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }
}
 
const sendMessage         = (msg) => requestTelegram('sendMessage',         makeReqBody(msg))
const editMessageText     = (msg) => requestTelegram('editMessageText',     makeReqBody(msg))
const answerCallbackQuery = (msg) => requestTelegram('answerCallbackQuery', makeReqBody(msg))
const copyMessage         = (msg) => requestTelegram('copyMessage',         makeReqBody(msg))
const forwardMessage      = (msg) => requestTelegram('forwardMessage',      makeReqBody(msg))
 
// ── Fetch listener ────────────────────────────────────────────────────────────
addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (url.pathname === WEBHOOK) {
    event.respondWith(handleWebhook(event))
  } else if (url.pathname === '/registerWebhook') {
    event.respondWith(registerWebhook(event, url, WEBHOOK, SECRET))
  } else if (url.pathname === '/unRegisterWebhook') {
    event.respondWith(unRegisterWebhook(event))
  } else {
    event.respondWith(new Response('', { status: 404 }))
  }
})
 
async function handleWebhook(event) {
  if (event.request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== SECRET) {
    return new Response('Unauthorized', { status: 403 })
  }
  const update = await event.request.json()
  event.waitUntil(onUpdate(update))
  return new Response('Ok')
}
 
async function onUpdate(update) {
  if ('message'        in update) await onMessage(update.message)
  if ('callback_query' in update) await onCallbackQuery(update.callback_query)
}
 
// ── Message router ────────────────────────────────────────────────────────────
async function onMessage(message) {
  if (message.chat.id.toString() === ADMIN_UID) {
    return handleAdmin(message)
  }
  return handleGuest(message)
}
 
// ── Admin handler ─────────────────────────────────────────────────────────────
async function handleAdmin(message) {
  const lang     = await getAdminLang()
  const text     = message.text || ''
  const hasReply = !!message?.reply_to_message
 
  // Language selection (also works for admin)
  if (text === '/start') return sendLangSelection(message.chat.id, true)
 
  // ── Standalone commands (no reply needed) ─────────────────────────────────
  if (/^\/listword$/.test(text)) return handleListWord(lang)
 
  const setMatch = /^\/setword\s+(.+)/.exec(text)
  if (setMatch) return handleSetWord(setMatch[1].trim(), lang)
  if (/^\/setword$/.test(text)) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'setwordUsage') })
 
  const delMatch = /^\/delword\s+(.+)/.exec(text)
  if (delMatch) return handleDelWord(delMatch[1].trim(), lang)
  if (/^\/delword$/.test(text)) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'delwordUsage') })
 
  // ── Reply-context commands ────────────────────────────────────────────────
  if (hasReply) {
    if (/^\/block$/.test(text))      return handleBlock(message, lang)
    if (/^\/unblock$/.test(text))    return handleUnBlock(message, lang)
    if (/^\/checkblock$/.test(text)) return handleCheckBlock(message, lang)
    if (/^\/info$/.test(text))       return handleInfo(message, lang)
 
    // Plain reply text → copy back to guest
    const guestChatId = await nfd.get('msg-map-' + message.reply_to_message.message_id, { type: 'json' })
    if (guestChatId) {
      return copyMessage({
        chat_id:      guestChatId,
        from_chat_id: message.chat.id,
        message_id:   message.message_id,
      })
    }
    return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'noCtx') })
  }
 
  // ── No context → show interactive menu ───────────────────────────────────
  return sendAdminMenu(lang)
}
 
// ── Admin: global menu (no reply context) ────────────────────────────────────
async function sendAdminMenu(lang) {
  return sendMessage({
    chat_id: ADMIN_UID,
    text: at(lang, 'menu'),
    reply_markup: {
      inline_keyboard: [
        [
          { text: at(lang, 'btnListWord'),   callback_data: 'admin:listword' },
          { text: at(lang, 'btnSwitchLang'), callback_data: 'admin:switchlang' },
        ],
        [
          { text: at(lang, 'btnHelp'),       callback_data: 'admin:help' },
        ],
      ]
    }
  })
}
 
// ── Admin: per-user action menu (sent after every forwarded message) ──────────
async function sendAdminActionMenu(guestId, lang) {
  return sendMessage({
    chat_id: ADMIN_UID,
    text: at(lang, 'ctxMenu', guestId),
    reply_markup: {
      inline_keyboard: [[
        { text: at(lang, 'btnBlock'),      callback_data: `admin:block:${guestId}` },
        { text: at(lang, 'btnUnblock'),    callback_data: `admin:unblock:${guestId}` },
        { text: at(lang, 'btnCheckBlock'), callback_data: `admin:checkblock:${guestId}` },
        { text: at(lang, 'btnInfo'),       callback_data: `admin:info:${guestId}` },
      ]]
    }
  })
}
 
// ── Callback query handler ────────────────────────────────────────────────────
async function onCallbackQuery(query) {
  const data = query.data || ''
  const from = query.from.id.toString()
  await answerCallbackQuery({ callback_query_id: query.id })
 
  // ── Language selection (guests + admin) ───────────────────────────────────
  if (data.startsWith('lang:')) {
    const selectedLang = data.split(':')[1]
    if (!GUEST_I18N[selectedLang]) return
 
    await nfd.put('lang-' + from, selectedLang)
 
    // Edit the selection message to confirm
    await editMessageText({
      chat_id:    query.message.chat.id,
      message_id: query.message.message_id,
      text: selectedLang === 'zh' ? '✅ 已選擇中文' : '✅ Language set to English',
    }).catch(() => {})  // ignore if message is too old to edit
 
    // Admin: just confirm, no captcha
    if (from === ADMIN_UID) {
      return sendMessage({ chat_id: from, text: at(selectedLang, 'langSet') })
    }
 
    // Guest: issue captcha
    return sendCaptcha(from, selectedLang)
  }
 
  // ── Admin-only callbacks ──────────────────────────────────────────────────
  if (from !== ADMIN_UID) return
 
  const adminLang = await getAdminLang()
 
  if (data === 'admin:listword') return handleListWord(adminLang)
  if (data === 'admin:help')     return sendMessage({ chat_id: ADMIN_UID, text: at(adminLang, 'help') })
 
  if (data === 'admin:switchlang') {
    const newLang = adminLang === 'zh' ? 'en' : 'zh'
    await nfd.put('lang-' + ADMIN_UID, newLang)
    return sendMessage({ chat_id: ADMIN_UID, text: at(newLang, 'langSet') })
  }
 
  // Per-user actions embedded with guestId
  const parts = data.split(':')  // ['admin', action, guestId]
  if (parts.length === 3) {
    const [, action, guestId] = parts
    if (action === 'block') {
      if (guestId === ADMIN_UID) return sendMessage({ chat_id: ADMIN_UID, text: at(adminLang, 'blockSelf') })
      await nfd.put('isblocked-' + guestId, true)
      return sendMessage({ chat_id: ADMIN_UID, text: at(adminLang, 'blockOk', guestId) })
    }
    if (action === 'unblock') {
      await nfd.put('isblocked-' + guestId, false)
      return sendMessage({ chat_id: ADMIN_UID, text: at(adminLang, 'unblockOk', guestId) })
    }
    if (action === 'checkblock') {
      const blocked = await nfd.get('isblocked-' + guestId, { type: 'json' })
      return sendMessage({ chat_id: ADMIN_UID, text: at(adminLang, 'checkBlock', guestId, blocked) })
    }
    if (action === 'info') {
      return sendUserInfo(guestId, adminLang)
    }
  }
}
 
// ── Guest handler ─────────────────────────────────────────────────────────────
async function handleGuest(message) {
  const chatId = message.chat.id
  const text   = message.text || ''
 
  // /start → always show language selection (reset flow)
  if (text === '/start') {
    const verified = await nfd.get('verified-' + chatId, { type: 'json' })
    if (verified) {
      const lang = await getLang(chatId)
      return sendMessage({
        chat_id: chatId,
        text: lang === 'zh'
          ? '👋 您已通過驗證，請直接發送訊息。'
          : '👋 You are already verified. Just send your message.',
      })
    }
    await nfd.delete('captcha-' + chatId)
    await nfd.delete('pending-' + chatId)
    return sendLangSelection(chatId, false)
  }
 
  // Hard block
  if (await nfd.get('isblocked-' + chatId, { type: 'json' })) {
    const lang = await getLang(chatId)
    return sendMessage({ chat_id: chatId, text: gt(lang, 'blocked') })
  }
 
  // Temporary captcha-fail block
  const tempBlock = await nfd.get('captcha-block-' + chatId, { type: 'json' })
  if (tempBlock && Date.now() < tempBlock) {
    const lang     = await getLang(chatId)
    const minsLeft = Math.ceil((tempBlock - Date.now()) / 60000)
    return sendMessage({ chat_id: chatId, text: gt(lang, 'tempBlocked', minsLeft) })
  }
 
  // Pending captcha?
  const captcha = await nfd.get('captcha-' + chatId, { type: 'json' })
  if (captcha) {
    if (Date.now() - captcha.ts <= CAPTCHA_TIMEOUT) {
      // Still within the 1-minute window → check their answer
      return handleCaptchaAnswer(message, captcha)
    }
    // Expired
    await nfd.delete('captcha-' + chatId)
    const lang = await getLang(chatId)
    await sendMessage({ chat_id: chatId, text: gt(lang, 'captchaExpire') })
    // Fall through to re-issue captcha below
  }
 
  // Already verified?
  const verified = await nfd.get('verified-' + chatId, { type: 'json' })
  if (verified) {
    return forwardGuestMessage(message)
  }
 
  // Not verified yet → store pending message, trigger captcha
  await nfd.put('pending-' + chatId, JSON.stringify({
    message_id: message.message_id,
    chat_id:    chatId,
  }))
 
  const langKey = await nfd.get('lang-' + chatId)
  if (!langKey) {
    // Language not chosen yet → show selection (captcha will follow after lang pick)
    return sendLangSelection(chatId, false)
  }
  return sendCaptcha(chatId, langKey)
}
 
// ── Captcha ───────────────────────────────────────────────────────────────────
async function sendLangSelection(chatId, isAdmin) {
  const text = isAdmin
    ? '🌐 Select your language / 請選擇語言：'
    : '🌐 Please select your language / 請選擇語言：'
  return sendMessage({
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [[
        { text: 'English', callback_data: 'lang:en' },
        { text: '中文',    callback_data: 'lang:zh' },
      ]]
    }
  })
}
 
async function sendCaptcha(chatId, lang) {
  const ops = ['+', '-', '*']
  const op  = ops[Math.floor(Math.random() * ops.length)]

  let a = Math.floor(Math.random() * 90) + 10  // 10-99
  let b = Math.floor(Math.random() * 90) + 10  // 10-99

  // 減法確保結果不為負數
  if (op === '-' && b > a) [a, b] = [b, a]

  let answer
  if (op === '+') answer = a + b
  if (op === '-') answer = a - b
  if (op === '*') answer = a * b

  await nfd.put('captcha-' + chatId, JSON.stringify({ answer, ts: Date.now() }))
  return sendMessage({ chat_id: chatId, text: gt(lang, 'captchaQ', a, op, b) })
}

 
async function handleCaptchaAnswer(message, captcha) {
  const chatId = message.chat.id
  const lang   = await getLang(chatId)
  const answer = parseInt(message.text, 10)
 
  if (answer === captcha.answer) {
    // ✅ Correct
    await nfd.delete('captcha-' + chatId)
    await nfd.put('verified-' + chatId, true)
    await sendMessage({ chat_id: chatId, text: gt(lang, 'captchaOk') })
 
    // Forward the pending message that triggered the captcha
    const pendingRaw = await nfd.get('pending-' + chatId)
    if (pendingRaw) {
      await nfd.delete('pending-' + chatId)
      let pending
      try { pending = JSON.parse(pendingRaw) } catch { return }
      const fwdReq = await forwardMessage({
        chat_id:      ADMIN_UID,
        from_chat_id: chatId,
        message_id:   pending.message_id,
      })
      if (fwdReq.ok) {
        await nfd.put('msg-map-' + fwdReq.result.message_id, chatId)
        await saveUserInfo(message)
        await sendAdminActionMenu(chatId, await getAdminLang())
      }
    }
    return
  }
 
  // ❌ Wrong answer
  await nfd.delete('captcha-' + chatId)
  await nfd.put('captcha-block-' + chatId, Date.now() + CAPTCHA_BLOCK)
  return sendMessage({ chat_id: chatId, text: gt(lang, 'captchaFail') })
}
 
// ── Forward verified guest message ────────────────────────────────────────────
async function forwardGuestMessage(message) {
  const chatId    = message.chat.id
  const lang      = await getLang(chatId)
  const adminLang = await getAdminLang()
 
  // Blocked-word filter
  if (message.text && await containsBlockedWord(message.text)) {
    return sendMessage({ chat_id: chatId, text: gt(lang, 'wordBlocked') })
  }
 
  // Fraud database check
  if (await isFraud(chatId)) {
    return sendMessage({ chat_id: ADMIN_UID, text: at(adminLang, 'fraudAlert', chatId) })
  }
 
  // Check first message BEFORE saving info
  const isFirstMsg = !(await nfd.get('userinfo-' + chatId, { type: 'json' }))
 
  // Save / update user info
  await saveUserInfo(message)
 
  // Forward to admin
  const fwdReq = await forwardMessage({
    chat_id:      ADMIN_UID,
    from_chat_id: chatId,
    message_id:   message.message_id,
  })
  if (fwdReq.ok) {
    await nfd.put('msg-map-' + fwdReq.result.message_id, chatId)
    // Only show action menu on the very first message from this user
    if (isFirstMsg) {
      await sendAdminActionMenu(chatId, adminLang)
    }
  }
}
 
// ── Blocked words ─────────────────────────────────────────────────────────────
async function getBlockedWords() {
  return (await nfd.get('blocked-words', { type: 'json' })) || []
}
 
async function containsBlockedWord(text) {
  const words = await getBlockedWords()
  const lower = text.toLowerCase()
  return words.some(w => lower.includes(w.toLowerCase()))
}
 
async function handleSetWord(word, lang) {
  if (!word) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'setwordUsage') })
  const words = await getBlockedWords()
  if (!words.includes(word)) {
    words.push(word)
    await nfd.put('blocked-words', JSON.stringify(words))
  }
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'wordAdded', word) })
}
 
async function handleDelWord(word, lang) {
  if (!word) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'delwordUsage') })
  const words = await getBlockedWords()
  const idx   = words.findIndex(w => w.toLowerCase() === word.toLowerCase())
  if (idx === -1) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'wordNotFound', word) })
  words.splice(idx, 1)
  await nfd.put('blocked-words', JSON.stringify(words))
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'wordRemoved', word) })
}
 
async function handleListWord(lang) {
  const words = await getBlockedWords()
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'wordList', words) })
}
 
// ── User info ─────────────────────────────────────────────────────────────────
async function saveUserInfo(message) {
  const u = message.from || message.chat
  if (!u) return
  // 已有記錄就跳過，不重複寫入
  const existing = await nfd.get('userinfo-' + u.id, { type: 'json' })
  if (existing) return   // ← 加這一行
  const info = {
    id:        u.id,
    name:      [u.first_name, u.last_name].filter(Boolean).join(' ') || u.title || '—',
    username:  u.username || '',
    firstSeen: new Date().toISOString().slice(0, 10),
  }
  await nfd.put('userinfo-' + u.id, JSON.stringify(info))
}

 
async function sendUserInfo(guestId, lang) {
  const info = await nfd.get('userinfo-' + guestId, { type: 'json' })
  if (!info) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'noInfo') })
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'userInfo', info) })
}
 
// ── Admin command handlers (reply-context) ────────────────────────────────────
async function getGuestId(message) {
  return nfd.get('msg-map-' + message.reply_to_message.message_id, { type: 'json' })
}
 
async function handleBlock(message, lang) {
  const guestChatId = await getGuestId(message)
  if (!guestChatId) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'noCtx') })
  if (guestChatId.toString() === ADMIN_UID) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'blockSelf') })
  await nfd.put('isblocked-' + guestChatId, true)
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'blockOk', guestChatId) })
}
 
async function handleUnBlock(message, lang) {
  const guestChatId = await getGuestId(message)
  if (!guestChatId) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'noCtx') })
  await nfd.put('isblocked-' + guestChatId, false)
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'unblockOk', guestChatId) })
}
 
async function handleCheckBlock(message, lang) {
  const guestChatId = await getGuestId(message)
  if (!guestChatId) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'noCtx') })
  const blocked = await nfd.get('isblocked-' + guestChatId, { type: 'json' })
  return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'checkBlock', guestChatId, blocked) })
}
 
async function handleInfo(message, lang) {
  const guestChatId = await getGuestId(message)
  if (!guestChatId) return sendMessage({ chat_id: ADMIN_UID, text: at(lang, 'noInfo') })
  return sendUserInfo(guestChatId, lang)
}
 
// ── Fraud check ───────────────────────────────────────────────────────────────
async function isFraud(id) {
  id = id.toString()
  const db  = await fetch(fraudDb).then(r => r.text())
  const arr = db.split('\n').filter(v => v.trim())
  return arr.includes(id)
}
 
// ── Webhook management ────────────────────────────────────────────────────────
async function registerWebhook(event, requestUrl, suffix, secret) {
  const webhookUrl = `${requestUrl.protocol}//${requestUrl.hostname}${suffix}`
  const r = await (await fetch(apiUrl('setWebhook', { url: webhookUrl, secret_token: secret }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}
 
async function unRegisterWebhook(event) {
  const r = await (await fetch(apiUrl('setWebhook', { url: '' }))).json()
  return new Response('ok' in r && r.ok ? 'Ok' : JSON.stringify(r, null, 2))
}
 
