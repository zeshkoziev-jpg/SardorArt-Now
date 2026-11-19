'use strict';

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

if (fs.existsSync('.env')) {
  const envConfig = fs.readFileSync('.env', 'utf8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').replace(/^['"]|['"]$/g, '');
      if (!process.env[key.trim()]) process.env[key.trim()] = val.trim();
    }
  }
}

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || 'SardorZakaz_bot';
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;
const ADMIN_CHAT_ID = '8631399966'; // Sizning Telegram IDingiz

const DATA_FILE = path.join(__dirname, 'data.json');
let DATA = { users: {}, sessions: {}, authNonces: {}, products: [], orders: [], botStates: {} };
let writeQueue = Promise.resolve();

async function saveData() {
  writeQueue = writeQueue.then(async () => {
    const tmp = DATA_FILE + '.tmp';
    await fs.promises.writeFile(tmp, JSON.stringify(DATA, null, 2));
    await fs.promises.rename(tmp, DATA_FILE);
  }).catch(console.error);
  return writeQueue;
}

async function loadData() {
  try {
    const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
    DATA = JSON.parse(raw);
    if (!DATA.users) DATA.users = {};
    if (!DATA.sessions) DATA.sessions = {};
    if (!DATA.authNonces) DATA.authNonces = {};
    if (!DATA.products) DATA.products = [];
    if (!DATA.orders) DATA.orders = [];
    if (!DATA.botStates) DATA.botStates = {};
  } catch (e) {
    await saveData();
  }
}

async function sendTgMsg(chatId, text, replyMarkup = null) {
  if (!BOT_TOKEN) return;
  const body = { chat_id: chatId, text, parse_mode: 'HTML' };
  if (replyMarkup) body.reply_markup = replyMarkup;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.error('Telegram error:', err.message);
  }
}

async function answerCallback(callbackQueryId) {
  if (!BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId })
    });
  } catch (err) {
    console.error('Callback error:', err.message);
  }
}

async function pollUpdates() {
  if (!BOT_TOKEN) return console.log('TELEGRAM_BOT_TOKEN berilmagan. Bot ishlamaydi.');
  let offset = 0;
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=10`);
      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleBotUpdate(update);
        }
      }
    } catch (err) {
      console.error('Polling error:', err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

async function handleBotUpdate(update) {
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;
    await answerCallback(cb.id);

    if (DATA.botStates[chatId]) {
      const state = DATA.botStates[chatId];

      if (data.startsWith('ord_genre_') && state.step === 'genre') {
        state.data.genre = data.replace('ord_genre_', '');
        state.step = 'size';
        await saveData();
        const sizes = [
          [{ text: "30x40 sm - 400,000 so'm", callback_data: "ord_size_400" }, { text: "40x50 sm - 600,000 so'm", callback_data: "ord_size_600" }],
          [{ text: "50x70 sm - 900,000 so'm", callback_data: "ord_size_900" }, { text: "60x80 sm - 1,200,000 so'm", callback_data: "ord_size_1200" }],
          [{ text: "70x100 sm - 1,800,000 so'm", callback_data: "ord_size_1800" }, { text: "100x120 sm - 2,500,000 so'm", callback_data: "ord_size_2500" }]
        ];
        await sendTgMsg(chatId, "Ajoyib! Endi rasm o'lchamini tanlang:", { inline_keyboard: sizes });
      }
      else if (data.startsWith('ord_size_') && state.step === 'size') {
        state.data.size = data.replace('ord_size_', '');
        state.step = 'theme';
        await saveData();
        const themes = [
          [{ text: "Oila a'zolari", callback_data: "ord_theme_oila" }, { text: "Tabiat", callback_data: "ord_theme_tabiat" }],
          [{ text: "Hayvonlar", callback_data: "ord_theme_hayvon" }, { text: "Portret", callback_data: "ord_theme_portret" }],
          [{ text: "Fantaziya", callback_data: "ord_theme_fantaziya" }, { text: "Boshqa", callback_data: "ord_theme_boshqa" }]
        ];
        await sendTgMsg(chatId, "Rasm nima haqida bo'lishini xohlaysiz? (Mavzuni tanlang)", { inline_keyboard: themes });
      }
      else if (data.startsWith('ord_theme_') && state.step === 'theme') {
        state.data.theme = data.replace('ord_theme_', '');
        state.step = 'phone';
        await saveData();
        await sendTgMsg(chatId, "Rahmat! Endi telefon raqamingizni yuboring:", {
          keyboard: [[{ text: "📱 Raqamni yuborish", request_contact: true }]], resize_keyboard: true, one_time_keyboard: true
        });
      }
    }
    return;
  }

  if (!update.message) return;
  const msg = update.message;
  const chatId = msg.chat.id;

  if (msg.text && msg.text.startsWith('/start ')) {
    const param = msg.text.split(' ')[1];

    if (param === 'order') {
      DATA.botStates[chatId] = { step: 'genre', data: {} };
      await saveData();
      const genres = [
        [{ text: "Portret", callback_data: "ord_genre_portret" }, { text: "Manzara", callback_data: "ord_genre_manzara" }],
        [{ text: "Natyurmort", callback_data: "ord_genre_natyurmort" }, { text: "Abstrakt", callback_data: "ord_genre_abstrakt" }],
        [{ text: "Animalistik", callback_data: "ord_genre_animal" }, { text: "Zamonaviy", callback_data: "ord_genre_zamonaviy" }]
      ];
      await sendTgMsg(chatId, "Assalomu alaykum! SARDOR ART dan maxsus rasm zakaz qilmoqchisiz. Keling, boshladik!\n\n1-qadam: Rasm janrini tanlang:", { inline_keyboard: genres });
      return;
    }

    const auth = DATA.authNonces[param];
    if (auth && Date.now() - auth.createdAt < 10 * 60 * 1000) {
      auth.chatId = chatId;
      auth.status = 'waiting_contact';
      await saveData();
      let roleText = auth.role === 'seller' ? 'savdogar' : 'mijoz';
      await sendTgMsg(chatId, `Assalomu alaykum, hurmatli ${roleText}! SARDOR ART ga xush kelibsiz. Davom etish uchun telefon raqamingizni yuboring.`, {
        keyboard: [[{ text: "📱 Raqamni yuborish", request_contact: true }]], resize_keyboard: true, one_time_keyboard: true
      });
    } else {
      await sendTgMsg(chatId, 'Xatolik: Havola eskirgan.');
    }
    return;
  }

  if (DATA.botStates[chatId]) {
    const state = DATA.botStates[chatId];

    if (state.step === 'phone' && msg.contact) {
      state.data.phone = msg.contact.phone_number;
      state.step = 'address';
      await saveData();
      await sendTgMsg(chatId, "Rahmat! Endi manzilingizni yuboring (Lokatsiya orqali yoki yozma ravishda):", {
        keyboard: [[{ text: "📍 Lokatsiyani yuborish", request_location: true }]], resize_keyboard: true, one_time_keyboard: true
      });
      return;
    }

    if (state.step === 'address' && (msg.location || msg.text)) {
      if (msg.location) {
        state.data.address = `Lokatsiya: https://www.google.com/maps?q=${msg.location.latitude},${msg.location.longitude}`;
      } else {
        state.data.address = msg.text;
      }

      const sizePrices = { '400': '400,000', '600': '600,000', '900': '900,000', '1200': '1,200,000', '1800': '1,800,000', '2500': '2,500,000' };
      const price = sizePrices[state.data.size] || 'Kelishilgan holda';

      const summary = `🎨 Yangi ZAKAZ!\n\nJanr: ${state.data.genre}\nO'lcham: ${state.data.size}\nMavzu: ${state.data.theme}\nTel: ${state.data.phone}\nManzil: ${state.data.address}`;
      await sendTgMsg(ADMIN_CHAT_ID, summary);

      const finalMsg = `Xush kelibsiz! Ma'lumotlaringiz qabul qilindi.\n\nTaxminiy narxi: <b>${price} so'm</b>\n\nTez orada aloqaga chiqamiz. Minnatdorchilik bildiramiz!\n\nBizning ijtimoiy tarmoqlar:\nTelegram: https://t.me/sardor_artest_uz\nInstagram: https://www.instagram.com/sardor_art_painter`;

      await sendTgMsg(chatId, finalMsg, { inline_keyboard: [[{ text: "Saytga qaytish", url: SITE_URL }]] });
      delete DATA.botStates[chatId];
      await saveData();
      return;
    }
  }

  // Avtorizatsiya uchun kontakt yuborilganda tasdiqlash kodini berish
  if (msg.contact) {
    const entry = Object.entries(DATA.authNonces).find(
      ([, a]) => a.chatId === chatId && a.status === 'waiting_contact' && Date.now() - a.createdAt < 10 * 60 * 1000
    );
    if (entry) {
      const [, auth] = entry;
      const code = String(Math.floor(100000 + Math.random() * 900000));
      let phone = msg.contact.phone_number;
      if (!phone.startsWith('+')) phone = '+' + phone;
      auth.phone = phone;
      auth.codeHash = crypto.createHash('sha256').update(code).digest('hex');
      auth.status = 'waiting_code';
      await saveData();
      await sendTgMsg(chatId, `Tasdiqlash kodingiz: <b>${code}</b>\n\nSaytga qaytib ushbu kodni kiriting.`, { remove_keyboard: true });
    }
  }
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '3mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://www.google.com https://maps.google.com; frame-src https://www.google.com https://maps.google.com; script-src 'self'; style-src 'self' 'unsafe-inline';");
  next();
});
app.get('/api/config', (req, res) => res.json({ phone: process.env.PHONE || '+998 90 123 45 67' }));

const rlBuckets = new Map();
setInterval(() => rlBuckets.clear(), 60000);
function rateLimit(max) {
  return (req, res, next) => {
    const ip = req.ip; let b = rlBuckets.get(ip);
    if (!b) { b = { count: 0 }; rlBuckets.set(ip, b); }
    b.count++; if (b.count > max) return res.status(429).json({ error: 'Ko\'p so\'rov.' }); next();
  };
}
app.use(express.static(path.join(__dirname, 'public')));

function auth(required = true) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return required ? res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' }) : next();
    const session = DATA.sessions[token];
    if (!session) return res.status(401).json({ error: 'Sessiya eskirgan' });
    const user = DATA.users[session.phone];
    if (!user) return res.status(401).json({ error: 'Foydalanuvchi topilmadi' });
    req.user = user; req.token = token; next();
  };
}

app.post('/api/auth/start', rateLimit(10), async (req, res) => {
  const { role } = req.body;
  const nonce = crypto.randomBytes(16).toString('hex');
  DATA.authNonces[nonce] = { role, createdAt: Date.now(), status: 'pending' };
  await saveData();
  res.json({ nonce, url: `https://t.me/${BOT_USERNAME}?start=${nonce}` });
});
app.get('/api/auth/status', (req, res) => {
  const auth = DATA.authNonces[req.query.nonce];
  res.json({ status: auth ? auth.status : 'not_found' });
});
app.post('/api/auth/verify', rateLimit(10), async (req, res) => {
  const { nonce, code } = req.body;
  const auth = DATA.authNonces[nonce];
  if (!auth || Date.now() - auth.createdAt > 600000) return res.status(400).json({ error: 'Xato' });
  const hash = crypto.createHash('sha256').update(String(code)).digest('hex');
  if (hash !== auth.codeHash) return res.status(400).json({ error: 'Kod xato' });
  const token = crypto.randomBytes(32).toString('hex');
  DATA.sessions[token] = { phone: auth.phone, role: auth.role, createdAt: Date.now() };
  DATA.users[auth.phone] = { ...DATA.users[auth.phone], phone: auth.phone, role: auth.role, telegramId: auth.chatId };
  delete DATA.authNonces[nonce]; await saveData();
  sendTgMsg(auth.chatId, `✅ Muvaffaqiyatli ro'yxatdan o'tdingiz!`, { inline_keyboard: [[{ text: "🌐 Saytga qaytish", url: SITE_URL }]] });
  res.json({ token });
});
app.get('/api/me', auth(), (req, res) => res.json({ user: { phone: req.user.phone, role: req.user.role } }));
app.get('/api/products', (req, res) => {
  let list = DATA.products.filter(p => p.status === 'available');
  const { q, genre } = req.query;
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if (genre && genre !== 'all') list = list.filter(p => p.genre === genre);
  list.sort((a, b) => b.createdAt - a.createdAt);
  res.json({ products: list.map(p => {
    const d = p.discount || 0; const finalPrice = d > 0 ? Math.round(p.price * (1 - d / 100)) : p.price;
    return { id: p.id, name: p.name, price: finalPrice, originalPrice: p.price, discount: d, genre: p.genre, paymentType: p.paymentType, image: p.image };
  })});
});
app.get('/api/products/:id', (req, res) => {
  const p = DATA.products.find(x => x.id === req.params.id && x.status === 'available');
  if (!p) return res.status(404).json({ error: 'Topilmadi' });
  const d = p.discount || 0; const finalPrice = d > 0 ? Math.round(p.price * (1 - d / 100)) : p.price;
  res.json({ product: { id: p.id, name: p.name, price: finalPrice, originalPrice: p.price, discount: d, genre: p.genre, paymentType: p.paymentType, image: p.image, description: p.description || '' } });
});
app.get('/api/seller/products', auth(), (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ error: 'Ruxsat yo\'q' });
  res.json({ products: DATA.products.filter(p => p.sellerPhone === req.user.phone) });
});
app.post('/api/seller/products', auth(), rateLimit(20), async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ error: 'Ruxsat yo\'q' });
  const { name, price, genre, paymentType, image, description, discount } = req.body;
  const disc = Number(discount) || 0;
  const id = crypto.randomBytes(8).toString('hex');
  const product = { id, name, price, genre, paymentType, image, description: description || '', discount: disc, sellerPhone: req.user.phone, status: 'available', createdAt: Date.now() };
  DATA.products.push(product); await saveData(); res.json({ product });
});
app.delete('/api/seller/products/:id', auth(), async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ error: 'Ruxsat yo\'q' });
  const idx = DATA.products.findIndex(p => p.id === req.params.id && p.sellerPhone === req.user.phone);
  if (idx !== -1) DATA.products.splice(idx, 1);
  await saveData(); res.json({ ok: true });
});
app.get('/api/seller/sold', auth(), (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ error: 'Ruxsat yo\'q' });
  res.json({ orders: DATA.orders.filter(o => o.sellerPhone === req.user.phone).sort((a, b) => b.createdAt - a.createdAt) });
});
app.post('/api/orders', auth(), rateLimit(10), async (req, res) => {
  if (req.user.role !== 'customer') return res.status(403).json({ error: 'Ruxsat yo\'q' });
  const { items, buyerName, buyerPhone, lat, lng } = req.body;
  const createdOrders = [];
  for (const item of items) {
    const p = DATA.products.find(x => x.id === item.id);
    if (!p || p.status !== 'available') return res.status(400).json({ error: `Asar topilmadi: ${item.name}` });
    const d = p.discount || 0; const finalPrice = d > 0 ? Math.round(p.price * (1 - d / 100)) : p.price;
    p.status = 'sold';
    const order = { id: crypto.randomBytes(8).toString('hex'), productId: p.id, productName: p.name, price: finalPrice, paymentType: p.paymentType, buyerName, buyerPhone, lat, lng, sellerPhone: p.sellerPhone, createdAt: Date.now() };
    DATA.orders.push(order); createdOrders.push(order);
    const seller = DATA.users[p.sellerPhone];
    if (seller && seller.telegramId) sendTgMsg(seller.telegramId, `🎉 Asar sotildi!\n${p.name}\nMijoz: ${buyerName}`);
  }
  await saveData(); res.json({ ok: true, orders: createdOrders });
});

(async () => {
  await loadData();
  app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
    pollUpdates();
  });
})();