(function () {
  'use strict';

  const DICT = {
    uz: {
      home: 'Bosh sahifa', profile: 'Profil', cart: 'Savat', logout: 'Chiqish', seller: 'Savdogar', sold: 'Sotilganlar',
      all: 'Barchasi', portrait: 'Portret', landscape: 'Manzara', stilllife: 'Natyurmort', abstract: 'Abstrakt', animal: 'Animalistik', modern: 'Zamonaviy/Pop-art',
      prepay100: '100% oldindan', prepay50: '50% oldindan, 50% keyin', postpay100: '100% keyin',
      search: 'Qidirish', add_to_cart: 'Savatga qo\'shish', buy: 'Sotib olish', remove: 'O\'chirish',
      checkout: 'Buyurtma berish', submit_order: 'Buyurtmani tasdiqlash', get_location: 'Joylashuvni aniqlash',
      save: 'Saqlash', create: 'Yaratish', empty_catalog: 'Hech narsa topilmadi', cart_empty: 'Savat bo\'sh',
      cart_total: 'Jami', required: 'Iltimos, maydonlarni to\'ldiring', login_needed: 'Tizimga kiring',
      order_success: 'Buyurtma qabul qilindi!', error_generic: 'Xatolik yuz berdi', image_req: 'Rasm tanlang',
      name: 'Ism', phone: 'Telefon', address: 'Manzil', my_works: 'Mening asarlarim', no_works: 'Hozircha asarlaringiz yo\'q',
      product_name: 'Asar nomi', price: 'Narx (so\'m)', genre: `Bo'limlar`, payment_type: 'To\'lov turi', public: 'Ommaga taqdim etish',
      seller_panel: 'Savdogar paneli', sold_items: 'Sotilganlar', buyer: 'Mijoz', map: 'Xarita', payment_info: 'To\'lov ma\'lumoti',
      upfront: 'Oldindan to\'lov', remaining: 'Keyin to\'lash', choose_role: 'Rolni tanlang', customer_role: 'Mijoz',
      seller_role: 'Savdogar', tg_login: 'Telegram orqali kirish', enter_code: 'Tasdiqlash kodini kiriting',
      verify: 'Tasdiqlash', success_auth: 'Muvaffaqiyatli kirdingiz!', waiting_tg: 'Telegramda botga o\'ting va raqamingizni yuboring...'
    },
    ru: {
      home: 'Главная', profile: 'Профиль', cart: 'Корзина', logout: 'Выйти', seller: 'Продавец', sold: 'Продано',
      all: 'Все', portrait: 'Портрет', landscape: 'Пейзаж', stilllife: 'Натюрморт', abstract: 'Абстракция', animal: 'Анималистика', modern: 'Современное',
      prepay100: '100% предоплата', prepay50: '50% предоплата, 50% после', postpay100: '100% после',
      search: 'Поиск', add_to_cart: 'В корзину', buy: 'Купить', remove: 'Удалить',
      checkout: 'Оформить', submit_order: 'Подтвердить', get_location: 'Определить местоположение',
      save: 'Сохранить', create: 'Создать', empty_catalog: 'Ничего не найдено', cart_empty: 'Корзина пуста',
      cart_total: 'Итого', required: 'Заполните поля', login_needed: 'Войдите в систему',
      order_success: 'Заказ принят!', error_generic: 'Ошибка', image_req: 'Выберите картинку',
      name: 'Имя', phone: 'Телефон', address: 'Адрес', my_works: 'Мои работы', no_works: 'У вас пока нет работ',
      product_name: 'Название', price: 'Цена (сум)', genre: 'Жанр', payment_type: 'Тип оплаты', public: 'Опубликовать',
      seller_panel: 'Панель продавца', sold_items: 'Продажи', buyer: 'Клиент', map: 'Карта', payment_info: 'Информация об оплате',
      upfront: 'Предоплата', remaining: 'Остаток', choose_role: 'Выберите роль', customer_role: 'Клиент',
      seller_role: 'Продавец', tg_login: 'Войти через Telegram', enter_code: 'Введите код',
      verify: 'Подтвердить', success_auth: 'Успешный вход!', waiting_tg: 'Перейдите в бота и отправьте номер...'
    },
    en: {
      home: 'Home', profile: 'Profile', cart: 'Cart', logout: 'Logout', seller: 'Seller', sold: 'Sold',
      all: 'All', portrait: 'Portrait', landscape: 'Landscape', stilllife: 'Still Life', abstract: 'Abstract', animal: 'Animal', modern: 'Modern/Pop-art',
      prepay100: '100% prepay', prepay50: '50% prepay, 50% after', postpay100: '100% postpay',
      search: 'Search', add_to_cart: 'Add to Cart', buy: 'Buy', remove: 'Remove',
      checkout: 'Checkout', submit_order: 'Submit Order', get_location: 'Get Location',
      save: 'Save', create: 'Create', empty_catalog: 'Nothing found', cart_empty: 'Cart is empty',
      cart_total: 'Total', required: 'Fill the fields', login_needed: 'Please login',
      order_success: 'Order placed!', error_generic: 'Error', image_req: 'Select image',
      name: 'Name', phone: 'Phone', address: 'Address', my_works: 'My Works', no_works: 'You have no works yet',
      product_name: 'Name', price: 'Price (sum)', genre: 'Genre', payment_type: 'Payment Type', public: 'Publish',
      seller_panel: 'Seller Panel', sold_items: 'Sold Items', buyer: 'Buyer', map: 'Map', payment_info: 'Payment Info',
      upfront: 'Upfront', remaining: 'Remaining', choose_role: 'Choose Role', customer_role: 'Customer',
      seller_role: 'Seller', tg_login: 'Login via Telegram', enter_code: 'Enter Code',
      verify: 'Verify', success_auth: 'Login successful!', waiting_tg: 'Go to bot and send phone...'
    }
  };

  const getLang = () => localStorage.getItem('lang') || 'uz';
  const t = (key) => (DICT[getLang()] && DICT[getLang()][key]) || key;
  const esc = (s) => String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  const fmtMoney = (n) => Number(n).toLocaleString('ru-RU') + ' so\'m';

  let AUTH_USER = null;
  const getToken = () => localStorage.getItem('token');

  async function fetchMe() {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) AUTH_USER = (await res.json()).user;
      else localStorage.removeItem('token');
    } catch {}
  }

  async function api(url, opts = {}) {
    const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const fetchOpts = { ...opts, headers };
    if (fetchOpts.body && typeof fetchOpts.body !== 'string') {
      fetchOpts.body = JSON.stringify(fetchOpts.body);
    }

    const res = await fetch(url, fetchOpts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Xatolik');
    return data;
  }

  function toast(msg) {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    el.style.opacity = 1;
    setTimeout(() => { el.style.opacity = 0; }, 3000);
  }

  const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
  const setCart = (c) => { localStorage.setItem('cart', JSON.stringify(c)); updateCartBadge(); };
  function addToCart(item) {
    const c = getCart();
    const f = c.find(x => x.id === item.id);
    if (f) f.qty += 1;
    else c.push({ ...item, qty: 1 });
    setCart(c);
  }
  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = getCart().reduce((s, x) => s + x.qty, 0);
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
  }

  function renderHeader() {
    const host = document.getElementById('main-header');
    if (!host) return;
    const isAuth = !!AUTH_USER;

    host.innerHTML = `
      <div class="header-inner">
        <button class="menu-btn" id="menu-toggle">☰</button>
        <a href="/" class="logo">SARDOR ART</a>
        <div class="search-bar">
          <input type="text" id="search-input" placeholder="${esc(t('search'))}...">
        </div>
        <nav class="nav-links">
          <a href="/">${esc(t('home'))}</a>
          <a href="/order.html" style="color:var(--accent); font-weight:bold;">Zakaz berish</a>
          ${isAuth && AUTH_USER.role === 'seller' ? `<a href="/seller.html">${esc(t('seller'))}</a><a href="/sold.html">${esc(t('sold'))}</a>` : ''}
          <a href="/profile.html">${esc(t('profile'))}</a>
          <a href="/cart.html">${esc(t('cart'))} <span id="cart-badge" class="badge hidden">0</span></a>
          ${isAuth ? `<button id="logout-btn">${esc(t('logout'))}</button>` : ''}
        </nav>
      </div>
    `;

    updateCartBadge();

    document.getElementById('logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('token');
      location.href = '/';
    });

    const searchInput = document.getElementById('search-input');
    const urlQ = new URLSearchParams(location.search).get('q');
    if (urlQ && searchInput) searchInput.value = urlQ;

    let timer;
    searchInput?.addEventListener('input', (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = e.target.value.trim();
        if (document.body.dataset.page === 'index') {
          document.dispatchEvent(new CustomEvent('search', { detail: q }));
        } else {
          location.href = `/index.html?q=${encodeURIComponent(q)}`;
        }
      }, 250);
    });

    document.getElementById('menu-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.toggle('open');
    });
  }

  async function renderFooter() {
    const host = document.getElementById('main-footer');
    if (!host) return;
    const lang = getLang();

    let phone = '+998 90 123 45 67';
    let phone1 = '+998 33 207 1213';
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.phone) phone = data.phone;
    } catch (e) {}

    host.innerHTML = `
      <div class="footer-inner">
        <div class="footer-phone">${esc(phone)}</div>
        <div class="footer-phone">${esc(phone1)}</div>
        <div class="payment-logos">
          <span class="pay-logo">HUMO</span><span class="pay-logo">UZCARD</span><span class="pay-logo">VISA</span><span class="pay-logo">MASTERCARD</span>
        </div>
        <div class="lang-switch">
          <button data-lang="uz" class="${lang === 'uz' ? 'active' : ''}">UZ</button>
          <button data-lang="ru" class="${lang === 'ru' ? 'active' : ''}">RU</button>
          <button data-lang="en" class="${lang === 'en' ? 'active' : ''}">EN</button>
        </div>
      </div>
    `;
    host.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.onclick = () => { localStorage.setItem('lang', btn.dataset.lang); location.reload(); };
    });
  }

  function initBgAnimation() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const container = document.getElementById('bg-animation');
    if (!container) return;
    const emojis = ['🎨', '🖌️', '🖼️', '✏️', '🖍️', '🎭', '🧑‍🎨'];
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.left = `${Math.random() * 100}vw`;
      span.style.fontSize = `${Math.random() * 20 + 20}px`;
      span.style.opacity = Math.random() * 0.1 + 0.15;
      span.style.animationDuration = `${Math.random() * 10 + 10}s`;
      span.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(span);
    }
  }

  async function initIndex() {
    const sidebar = document.getElementById('sidebar');
    const genres = ['all', 'portrait', 'landscape', 'stilllife', 'abstract', 'animal', 'modern'];
    if (sidebar) {
      sidebar.innerHTML = `<h3>${esc(t('genre'))}</h3><ul class="genre-list">${genres.map(g => `<li data-genre="${esc(g)}">${esc(t(g))}</li>`).join('')}</ul>`;
    }

    let currentGenre = 'all';
    const grid = document.getElementById('products-grid');
    const empty = document.getElementById('empty-msg');

    async function load(query = '') {
      try {
        const res = await api(`/api/products?q=${encodeURIComponent(query)}&genre=${encodeURIComponent(currentGenre)}`);
        if (!res.products || res.products.length === 0) {
          if (grid) grid.innerHTML = '';
          empty?.classList.remove('hidden');
          return;
        }
        empty?.classList.add('hidden');
        if (grid) {
          grid.innerHTML = res.products.map(p => {
            let priceHtml = `<div class="card-price">${fmtMoney(p.price)}</div>`;
            if (p.discount > 0) {
              priceHtml = `
                <div class="card-price" style="color:#ff4d4f;">
                  ${fmtMoney(p.price)}
                  <span style="text-decoration:line-through; color:#888; font-size:14px; margin-left:5px;">${fmtMoney(p.originalPrice)}</span>
                  <span style="background:#ff4d4f; color:white; padding:2px 5px; border-radius:5px; font-size:12px; margin-left:5px;">-${esc(p.discount)}%</span>
                </div>
              `;
            }
            return `
              <a href="/product.html?id=${encodeURIComponent(p.id)}" class="card">
                <img src="${esc(p.image)}" class="card-img" alt="${esc(p.name)}">
                <div class="card-body">
                  <div class="card-title">${esc(p.name)}</div>
                  <div class="card-genre">${esc(t(p.genre))}</div>
                  ${priceHtml}
                </div>
              </a>
            `;
          }).join('');
        }
      } catch (e) { toast(e.message); }
    }

    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          sidebar.querySelectorAll('li').forEach(el => el.classList.remove('active'));
          e.target.classList.add('active');
          currentGenre = e.target.dataset.genre;
          load((document.getElementById('search-input')?.value || '').trim());
        }
      });
      sidebar.querySelector('[data-genre="all"]')?.classList.add('active');
    }

    document.addEventListener('search', (e) => load(e.detail));

    const initialQ = new URLSearchParams(location.search).get('q') || '';
    load(initialQ);
  }

  async function initProduct() {
    const id = new URLSearchParams(location.search).get('id');
    const host = document.getElementById('product-detail');
    if (!host) return;
    if (!id) { host.innerHTML = '<p>Xato</p>'; return; }

    try {
      const res = await api(`/api/products/${encodeURIComponent(id)}`);
      const p = res.product;

      let priceHtml = `<div class="price">${fmtMoney(p.price)}</div>`;
      if (p.discount > 0) {
        priceHtml = `
          <div class="price" style="color:#ff4d4f;">
            ${fmtMoney(p.price)}
            <span style="text-decoration:line-through; color:#888; font-size:20px; margin-left:10px;">${fmtMoney(p.originalPrice)}</span>
            <span style="background:#ff4d4f; color:white; padding:3px 8px; border-radius:5px; font-size:16px; margin-left:10px;">-${esc(p.discount)}%</span>
          </div>
        `;
      }

      let descHtml = p.description
        ? `<div class="mt-2" style="line-height:1.6; color:#aaa; margin-bottom:20px;">${esc(p.description)}</div>`
        : '';

      host.innerHTML = `
        <div class="product-layout">
          <div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>
          <div class="product-info">
            <div class="genre-tag">${esc(t(p.genre))}</div>
            <h1>${esc(p.name)}</h1>
            ${descHtml}
            ${priceHtml}
            <div class="payment-info">
              <strong>${esc(t('payment_type'))}:</strong> ${esc(t(p.paymentType))}
            </div>
            <button class="btn btn-primary btn-block" id="add-btn">${esc(t('add_to_cart'))}</button>
          </div>
        </div>
      `;

      document.getElementById('add-btn').onclick = () => {
        addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, paymentType: p.paymentType });
        toast(t('add_to_cart'));
      };
    } catch (e) {
      host.innerHTML = `<p>${esc(e.message)}</p>`;
    }
  }

  function initCart() {
    const list = document.getElementById('cart-list');
    const summary = document.getElementById('cart-summary');
    const totalEl = document.getElementById('cart-total-price');

    function render() {
      const cart = getCart();
      if (!cart.length) {
        list.innerHTML = `<p class="empty-msg">${esc(t('cart_empty'))}</p>`;
        summary.classList.add('hidden');
        return;
      }
      summary.classList.remove('hidden');
      let total = 0;
      list.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
          <div class="cart-item">
            <img src="${esc(item.image)}" alt="">
            <div class="cart-item-info">
              <h3>${esc(item.name)}</h3>
              <div class="price">${fmtMoney(item.price)}</div>
              <div class="qty-controls">
                <button data-id="${esc(item.id)}" data-act="minus">-</button>
                <span>${item.qty}</span>
                <button data-id="${esc(item.id)}" data-act="plus">+</button>
              </div>
            </div>
            <button class="btn btn-danger" data-id="${esc(item.id)}" data-act="remove">${esc(t('remove'))}</button>
          </div>
        `;
      }).join('');
      totalEl.textContent = fmtMoney(total);
    }

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      let cart = getCart();
      const item = cart.find(x => x.id === id);
      if (!item) return;
      if (act === 'plus') item.qty++;
      else if (act === 'minus' && item.qty > 1) item.qty--;
      else if (act === 'remove') cart = cart.filter(x => x.id !== id);
      setCart(cart);
      render();
    });

    document.getElementById('checkout-btn').onclick = () => {
      if (!getToken()) { location.href = '/profile.html'; return; }
      location.href = '/checkout.html';
    };
    render();
  }

  async function initCheckout() {
    const host = document.getElementById('main-content');
    const cart = getCart();
    if (!cart.length) { host.innerHTML = `<p>${esc(t('cart_empty'))}</p>`; return; }

    let total = 0, upfront = 0, remaining = 0;
    cart.forEach(item => {
      const sum = item.price * item.qty;
      total += sum;
      const pt = item.paymentType || 'prepay100';
      if (pt === 'prepay100') upfront += sum;
      else if (pt === 'prepay50') { upfront += Math.floor(sum / 2); remaining += Math.ceil(sum / 2); }
      else if (pt === 'postpay100') remaining += sum;
    });

    host.innerHTML = `
      <h2>${esc(t('checkout'))}</h2>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
        <div>
          <div class="form-group"><label>${esc(t('name'))}</label><input type="text" id="c-name" class="input"></div>
          <div class="form-group"><label>${esc(t('phone'))}</label><input type="text" id="c-phone" class="input" value="${esc(AUTH_USER?.phone || '')}"></div>
          <button class="btn btn-primary" id="loc-btn">${esc(t('get_location'))}</button>
          <div id="map-preview" style="margin-top: 15px;"></div>
        </div>
        <div>
          <div class="cart-summary" style="text-align: left;">
            <p><strong>${esc(t('cart_total'))}:</strong> ${fmtMoney(total)}</p>
            <p><strong>${esc(t('upfront'))}:</strong> ${fmtMoney(upfront)}</p>
            <p><strong>${esc(t('remaining'))}:</strong> ${fmtMoney(remaining)}</p>
            <hr style="margin:15px 0; border-color:#333;">
            <button id="order-btn" class="btn btn-primary btn-block">${esc(t('submit_order'))}</button>
          </div>
        </div>
      </div>
    `;

    let lat = null, lng = null;
    document.getElementById('loc-btn').onclick = () => {
      navigator.geolocation.getCurrentPosition(pos => {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        document.getElementById('map-preview').innerHTML = `<iframe width="100%" height="200" style="border:0;border-radius:8px;" src="https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed"></iframe>`;
      }, () => toast(t('error_generic')));
    };

    document.getElementById('order-btn').onclick = async () => {
      if (!lat) return toast(t('get_location'));
      const name = document.getElementById('c-name').value.trim();
      const phone = document.getElementById('c-phone').value.trim();
      if (!name || !phone) return toast(t('required'));

      try {
        await api('/api/orders', {
          method: 'POST',
          body: { items: cart.map(x => ({ id: x.id, qty: x.qty, name: x.name })), buyerName: name, buyerPhone: phone, lat, lng }
        });
        localStorage.removeItem('cart');
        toast(t('order_success'));
        setTimeout(() => { location.href = '/'; }, 1000);
      } catch (e) { toast(e.message); }
    };
  }

  function initProfile() {
    const area = document.getElementById('main-content');
    if (AUTH_USER) {
      area.innerHTML = `
        <div class="card" style="max-width: 400px; margin: 40px auto; text-align: center; padding: 30px;">
          <h2>${esc(AUTH_USER.phone)}</h2>
          <p style="margin:20px 0;">Rol: <b>${esc(AUTH_USER.role === 'seller' ? t('seller_role') : t('customer_role'))}</b></p>
          ${AUTH_USER.role === 'seller' ? `<a href="/seller.html" class="btn btn-primary" style="margin-bottom:10px; display:block;">${esc(t('seller_panel'))}</a>` : ''}
          <button id="logout-profile" class="btn btn-danger btn-block">${esc(t('logout'))}</button>
        </div>
      `;
      document.getElementById('logout-profile').onclick = () => { localStorage.removeItem('token'); location.href = '/'; };
      return;
    }
    area.innerHTML = `
      <div class="card" style="max-width: 400px; margin: 40px auto; text-align: center; padding: 30px;">
        <h2>${esc(t('choose_role'))}</h2>
        <div style="margin: 20px 0;">
          <button id="role-cust" class="btn btn-primary" style="margin-right: 10px;">${esc(t('customer_role'))}</button>
          <button id="role-sell" class="btn btn-primary">${esc(t('seller_role'))}</button>
        </div>
        <div id="auth-status" class="hidden" style="margin-top: 20px; color: var(--accent);"></div>
      </div>
    `;

    const startAuth = async (role) => {
      const statusDiv = document.getElementById('auth-status');
      statusDiv.classList.remove('hidden');
      statusDiv.textContent = t('waiting_tg');
      try {
        const res = await api('/api/auth/start', { method: 'POST', body: { role } });
        window.open(res.url, '_blank');

        const interval = setInterval(async () => {
          try {
            const s = await api(`/api/auth/status?nonce=${encodeURIComponent(res.nonce)}`);
            if (s.status === 'waiting_code') {
              clearInterval(interval);
              location.href = `/login.html?nonce=${encodeURIComponent(res.nonce)}`;
            }
          } catch (e) {}
        }, 2000);
        setTimeout(() => clearInterval(interval), 10 * 60 * 1000);
      } catch (e) { statusDiv.textContent = e.message; }
    };

    document.getElementById('role-cust').onclick = () => startAuth('customer');
    document.getElementById('role-sell').onclick = () => startAuth('seller');
  }

  function initLogin() {
    const host = document.getElementById('main-content');
    const nonce = new URLSearchParams(location.search).get('nonce');
    if (!nonce) { host.innerHTML = '<p>Xato</p>'; return; }

    host.innerHTML = `
      <div class="card" style="max-width: 400px; margin: 40px auto; text-align: center; padding: 30px;">
        <h2>${esc(t('enter_code'))}</h2>
        <input type="text" id="code-input" class="input" style="text-align:center; font-size:24px; letter-spacing:5px;" maxlength="6">
        <button id="verify-btn" class="btn btn-primary btn-block">${esc(t('verify'))}</button>
        <p id="err-msg" style="color:var(--danger); margin-top:10px;"></p>
      </div>
    `;

    document.getElementById('verify-btn').onclick = async () => {
      const code = document.getElementById('code-input').value.trim();
      if (!/^\d{6}$/.test(code)) return;
      try {
        const res = await api('/api/auth/verify', { method: 'POST', body: { nonce, code } });
        localStorage.setItem('token', res.token);
        toast(t('success_auth'));
        setTimeout(() => { location.href = '/'; }, 1000);
      } catch (e) { document.getElementById('err-msg').textContent = e.message; }
    };
  }

  function initSeller() {
    const host = document.getElementById('main-content');
    if (!AUTH_USER || AUTH_USER.role !== 'seller') {
      if (host) host.innerHTML = '<p>Ruxsat yo\'q</p>';
      return;
    }

    let base64Img = null;
    const fileInput = document.getElementById('p-image');
    if (fileInput) {
      fileInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          base64Img = reader.result;
          const preview = document.getElementById('p-preview');
          if (preview) {
            preview.src = base64Img;
            preview.classList.remove('hidden');
          }
        };
        reader.readAsDataURL(file);
      };
    }

    async function loadMy() {
      const list = document.getElementById('my-products');
      if (!list) return;
      try {
        const res = await api('/api/seller/products');
        if (!res.products || !res.products.length) {
          list.innerHTML = `<p>${esc(t('no_works'))}</p>`;
          return;
        }
        list.innerHTML = res.products.map(p => `
          <div class="card" style="padding:15px; margin-bottom:15px;">
            <img src="${esc(p.image)}" alt="${esc(p.name)}" style="max-width:160px; border-radius:8px;">
            <h3>${esc(p.name)}</h3>
            <p>${fmtMoney(p.price)}</p>
            <button class="btn btn-danger" onclick="deleteProduct('${esc(p.id)}')">${esc(t('remove'))}</button>
          </div>
        `).join('');
      } catch (e) { toast(e.message); }
    }

    window.deleteProduct = async (id) => {
      if (!confirm('O\'chirish?')) return;
      try {
        await api(`/api/seller/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
        loadMy();
      } catch (e) { toast(e.message); }
    };

    const saveBtn = document.getElementById('p-save');
    if (saveBtn) {
      saveBtn.onclick = async () => {
        const name = document.getElementById('p-name').value.trim();
        const price = parseInt(document.getElementById('p-price').value, 10);
        const discount = parseInt(document.getElementById('p-discount')?.value, 10) || 0;
        const description = (document.getElementById('p-desc')?.value || '').trim();
        const genre = document.getElementById('p-genre').value;
        const paymentType = document.getElementById('p-payment').value;

        if (!name || !price || !base64Img) return toast(t('required'));

        try {
          await api('/api/seller/products', {
            method: 'POST',
            body: { name, price, discount, description, genre, paymentType, image: base64Img }
          });
          toast('OK');
          loadMy();
          document.getElementById('p-name').value = '';
          document.getElementById('p-price').value = '';
          if (document.getElementById('p-discount')) document.getElementById('p-discount').value = '0';
          if (document.getElementById('p-desc')) document.getElementById('p-desc').value = '';
          base64Img = null;
          document.getElementById('p-preview')?.classList.add('hidden');
        } catch (e) { toast(e.message); }
      };
    }

    loadMy();
  }

  async function initSold() {
    const host = document.getElementById('main-content');
    if (!AUTH_USER || AUTH_USER.role !== 'seller') { host.innerHTML = '<p>Ruxsat yo\'q</p>'; return; }
    try {
      const res = await api('/api/seller/sold');
      if (!res.orders.length) { host.innerHTML = `<p>${esc(t('no_works'))}</p>`; return; }
      host.innerHTML = `<h2>${esc(t('sold_items'))}</h2><div style="margin-top:20px;">` + res.orders.map(o => `
        <div class="card" style="padding:15px; margin-bottom:15px;">
          <h3>${esc(o.productName)}</h3>
          <p><strong>${esc(t('price'))}:</strong> ${fmtMoney(o.price)}</p>
          <p><strong>${esc(t('payment_type'))}:</strong> ${esc(t(o.paymentType))}</p>
          <p><strong>${esc(t('buyer'))}:</strong> ${esc(o.buyerName)} (${esc(o.buyerPhone)})</p>
          <iframe width="100%" height="150" style="border:0;border-radius:8px; margin-top:10px;" src="https://www.google.com/maps?q=${encodeURIComponent(o.lat)},${encodeURIComponent(o.lng)}&z=15&output=embed"></iframe>
        </div>
      `).join('') + '</div>';
    } catch (e) { host.innerHTML = `<p>${esc(e.message)}</p>`; }
  }

  (async () => {
    await fetchMe();
    initBgAnimation();
    renderHeader();
    await renderFooter();

    const page = document.body.dataset.page;
    if (page === 'index') initIndex();
    else if (page === 'product') initProduct();
    else if (page === 'cart') initCart();
    else if (page === 'profile') initProfile();
    else if (page === 'login') initLogin();
    else if (page === 'checkout') initCheckout();
    else if (page === 'seller') initSeller();
    else if (page === 'sold') initSold();
  })();
})();