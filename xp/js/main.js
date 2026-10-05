/* Ekran akışı (açılış → giriş → masaüstü), masaüstü simgeleri, Başlat menüsü, tepsi ve kapatma. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const screens = ['boot', 'welcome', 'desktop', 'off'];
  const { Items } = Apps;
  const SEEN_KEY = 'xpcv-seen';
  let desktopReady = false;

  const storage = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* yok say */ } },
  };
  const ICON_POS_KEY = 'xpcv-icon-pos';
  const localStore = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)) || null; } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* yok say */ } },
    remove(k) { try { localStorage.removeItem(k); } catch { /* yok say */ } },
  };

  function show(id) {
    screens.forEach((s) => ($('#' + s).hidden = s !== id));
    document.body.classList.remove('busy');
  }
  // XP'nin "arka planda çalışıyor" imleci
  function busy(ms) {
    document.body.classList.add('busy');
    if (ms) setTimeout(() => document.body.classList.remove('busy'), ms);
  }

  // Statik görseller
  $$('.xp-logo-flag').forEach((i) => (i.src = ICONS.flag));
  $$('.user-pic').forEach((i) => (i.src = ICONS.user));
  $('#welcome-power img').src = ICONS.power;
  $('#start-btn img').src = ICONS.flag;
  $('#tray-shield').src = ICONS.shield;
  $('#tray-network').src = ICONS.network;
  $('#tray-speaker').src = ICONS.speaker;
  $('.off-btn img').src = ICONS.power;

  /* ---------------- Açılış ---------------- */
  let bootTimer = null;
  function boot() {
    WM.closeAll();
    window.Extras?.reset();
    show('boot');
    clearTimeout(bootTimer);
    bootTimer = setTimeout(welcome, 3400);
  }
  $('#boot').addEventListener('click', () => { clearTimeout(bootTimer); welcome(); });

  /* ---------------- Giriş ekranı ---------------- */
  const wlMsg = $('.wl-message');
  function welcome(message) {
    show('welcome');
    $('.wl-left').hidden = $('.wl-right').hidden = $('.wl-divider').hidden = false;
    wlMsg.hidden = true;
    if (message) welcomeMessage(message, true);
    else setTimeout(() => $('#login-user').focus({ preventScroll: true }), 50);
  }
  function welcomeMessage(text, small) {
    show('welcome');
    $('.wl-left').hidden = $('.wl-right').hidden = $('.wl-divider').hidden = true;
    wlMsg.textContent = text;
    wlMsg.classList.toggle('small', !!small);
    wlMsg.hidden = false;
    busy();
  }
  $('#login-user').addEventListener('click', () => {
    welcomeMessage('hoş geldiniz');
    setTimeout(() => enterDesktop(true), 1500);
  });
  $('#welcome-power').addEventListener('click', () => {
    welcomeMessage('Windows kapatılıyor...', true);
    setTimeout(() => off('shutdown'), 1600);
  });

  /* ---------------- Kapalı / Bekleme ---------------- */
  let offMode = 'shutdown';
  function off(mode) {
    offMode = mode;
    WM.closeAll();
    $('.off-btn span').textContent = mode === 'standby' ? 'Bilgisayar bekleme modunda. Devam etmek için tıklayın.' : 'Bilgisayarı açmak için tıklayın';
    $('.off-btn img').src = mode === 'standby' ? ICONS.standby : ICONS.power;
    show('off');
  }
  $('#off').addEventListener('click', () => (offMode === 'standby' ? show('desktop') : boot()));

  /* ---------------- Masaüstü ---------------- */
  const desktopItems = () => [
    { ...Items.app('Bilgisayarım', 'computer', () => Apps.explorer('Bilgisayarım'), 'Sistem Klasörü'), folder: 'Bilgisayarım' },
    Items.folder('Belgelerim', 'mydocs', 'Belgelerim', 'Sistem Klasörü'),
    Items.app('Internet Explorer', 'ie', () => Apps.ie()),
    ...CV_FILES.map(Items.txt),
    Items.pdf(),
    Items.app('Mayın Tarlası', 'mine', () => Apps.minesweeper()),
    Items.app('Paint', 'paint', () => Apps.paint()),
    Items.app('Komut İstemi', 'cmd', () => Apps.cmd()),
    Items.app('Visual Studio Code', 'vscode', () => Apps.vscode()),
  ];
  Apps.setDesktopItems(desktopItems);
  const recycleItem = { ...Items.folder('Geri Dönüşüm Kutusu', 'recycleFull', 'Geri Dönüşüm Kutusu', 'Sistem Klasörü') };

  function makeIcon(item, extraClass = '') {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon ' + extraClass;
    b.innerHTML = `<img src="${ICONS[item.icon]}" alt=""><span></span>`;
    b.querySelector('span').textContent = item.name;
    b.title = item.name;
    b._item = item;
    b.addEventListener('pointerdown', (e) => {
      if (e.button === 2 && b.classList.contains('selected')) return;
      const multi = e.ctrlKey || e.metaKey;
      if (!multi && !b.classList.contains('selected')) clearSelection();
      b.classList.toggle('selected', multi ? !b.classList.contains('selected') : true);
      WM.blurAll();
      closeStart();
      if (e.button === 0) startIconDrag(b, e);
    });
    b.addEventListener('click', (e) => {
      // Dokunmatikte açma pointerup'ta yapılır (startIconDrag); sürüklemeden sonra tarayıcı click'i yutabiliyor.
      if (b._dragged || (e.pointerType && e.pointerType !== 'mouse')) return;
      if (!(e.ctrlKey || e.metaKey)) { clearSelection(); b.classList.add('selected'); }
    });
    b.addEventListener('dblclick', () => !b._dragged && item.open());
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); item.open(); }
      if (e.key === 'Delete') deleteIcon(item);
    });
    b.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearSelection();
      b.classList.add('selected');
      WM.contextMenu(e.clientX, e.clientY, [
        { label: 'Aç', bold: true, action: item.open },
        '-',
        { label: 'Sil', action: () => deleteIcon(item) },
        { label: 'Yeniden Adlandır', disabled: true },
        '-',
        { label: 'Özellikler', action: () => properties(item) },
      ]);
    });
    return b;
  }

  function deleteIcon(item) {
    WM.dialog({
      title: 'Dosya Silmeyi Onayla',
      icon: 'question',
      message: `'${item.name}' öğesini Geri Dönüşüm Kutusu'na göndermek istediğinizden emin misiniz?`,
      buttons: ['Evet', 'Hayır'],
      onButton: (b) => b === 'Evet' && WM.dialog({ title: 'Dosya silinemiyor', icon: 'error', message: `'${item.name}' silinemiyor: Bu dosya bir CV'nin ayrılmaz parçasıdır.\n\nİşe alım sürecini sürdürüp yeniden deneyin. :)` }),
    });
  }

  function properties(item) {
    WM.dialog({ title: `${item.name} Özellikleri`, icon: 'info', message: `Ad: ${item.name}\nTür: ${item.meta.join(' · ')}\nKonum: C:\\Documents and Settings\\Efe\\Masaüstü\nSahibi: ${CV.name}` });
  }

  function clearSelection() {
    $$('.icon.selected').forEach((i) => i.classList.remove('selected'));
  }

  /* ---------------- Simge yerleşimi ve sürükleme ---------------- */
  // Hücre boyutu: 76px simge + boşluk. Konumlar hücre (sütun, satır) olarak saklanır.
  const grid = () => ({ w: 80, h: WM.isMobile() ? 84 : 82, x0: 2, y0: 6 });
  function gridSize() {
    const g = grid(), wrap = $('#icons');
    return {
      cols: Math.max(1, Math.floor((wrap.clientWidth - g.x0) / g.w)),
      rows: Math.max(1, Math.floor((wrap.clientHeight - g.y0) / g.h)),
    };
  }
  const cellKey = (c) => c[0] + ',' + c[1];
  function placeIcon(el, cell) {
    const g = grid();
    el._cell = cell;
    el.style.left = g.x0 + cell[0] * g.w + 'px';
    el.style.top = g.y0 + cell[1] * g.h + 'px';
  }
  // Hedef hücre doluysa en yakın boş hücre
  function nearestFree(cell, taken, { cols, rows }) {
    let best = null, bestD = Infinity;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++) {
        if (taken.has(c + ',' + r)) continue;
        const d = (c - cell[0]) ** 2 + (r - cell[1]) ** 2;
        if (d < bestD) { bestD = d; best = [c, r]; }
      }
    return best || cell;
  }
  function layoutIcons() {
    const size = gridSize();
    const saved = localStore.get(ICON_POS_KEY) || {};
    const taken = new Set();
    const pending = [];
    $$('#icons .icon').forEach((el) => {
      const p = saved[el._item.name];
      if (Array.isArray(p) && p[0] < size.cols && p[1] < size.rows && !taken.has(cellKey(p))) {
        placeIcon(el, p);
        taken.add(cellKey(p));
      } else pending.push(el);
    });
    // Geri Dönüşüm Kutusu varsayılan olarak sağ alt köşede, diğerleri sütun sütun
    pending.sort((a, b) => b.classList.contains('recycle') - a.classList.contains('recycle'));
    let seq = 0;
    pending.forEach((el) => {
      let cell;
      if (el.classList.contains('recycle')) cell = nearestFree([size.cols - 1, size.rows - 1], taken, size);
      else {
        do { cell = [Math.floor(seq / size.rows), seq % size.rows]; seq++; } while (taken.has(cellKey(cell)) && seq < size.cols * size.rows);
        if (taken.has(cellKey(cell))) cell = nearestFree(cell, taken, size);
      }
      placeIcon(el, cell);
      taken.add(cellKey(cell));
    });
  }
  function saveIconPositions() {
    const saved = localStore.get(ICON_POS_KEY) || {};
    $$('#icons .icon').forEach((el) => (saved[el._item.name] = el._cell));
    localStore.set(ICON_POS_KEY, saved);
  }
  function arrangeIcons() {
    localStore.remove(ICON_POS_KEY);
    layoutIcons();
  }

  // Sadece taşıma: bırakılan yer doluysa en yakın boş hücreye oturur, hiçbir şey silinmez.
  function startIconDrag(b, e) {
    const sx = e.clientX, sy = e.clientY;
    const threshold = e.pointerType === 'mouse' ? 4 : 8;
    let group = null;
    const move = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!group) {
        if (Math.hypot(dx, dy) < threshold) return;
        group = $$('#icons .icon.selected').map((el) => ({ el, x: el.offsetLeft, y: el.offsetTop }));
        group.forEach(({ el }) => el.classList.add('dragging'));
      }
      group.forEach(({ el, x, y }) => {
        el.style.left = x + dx + 'px';
        el.style.top = y + dy + 'px';
      });
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!group) {
        // Dokunmatik: tek dokunuş açar
        if (ev.type === 'pointerup' && e.pointerType !== 'mouse' && ev.target.closest?.('.icon') === b) b._item.open();
        return;
      }
      b._dragged = true;
      setTimeout(() => (b._dragged = false), 400);
      const g = grid(), size = gridSize();
      const lead = group.find((o) => o.el === b) || group[0];
      const dc = Math.round((lead.el.offsetLeft - lead.x) / g.w);
      const dr = Math.round((lead.el.offsetTop - lead.y) / g.h);
      const moving = new Set(group.map((o) => o.el));
      const taken = new Set($$('#icons .icon').filter((el) => !moving.has(el)).map((el) => cellKey(el._cell)));
      group.forEach(({ el }) => {
        el.classList.remove('dragging');
        let cell = [
          Math.max(0, Math.min(size.cols - 1, el._cell[0] + dc)),
          Math.max(0, Math.min(size.rows - 1, el._cell[1] + dr)),
        ];
        if (taken.has(cellKey(cell))) cell = nearestFree(cell, taken, size);
        placeIcon(el, cell);
        taken.add(cellKey(cell));
      });
      saveIconPositions();
      window.Extras?.unlock('drag');
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function buildDesktop() {
    const wrap = $('#icons');
    wrap.innerHTML = '';
    desktopItems().forEach((it) => wrap.appendChild(makeIcon(it)));
    wrap.appendChild(makeIcon(recycleItem, 'recycle'));

    // Boş alana tıklama ve seçim dikdörtgeni
    const desk = $('#desktop');
    desk.addEventListener('pointerdown', (e) => {
      if (e.target !== wrap && e.target !== desk) return;
      clearSelection();
      WM.blurAll();
      closeStart();
      if (e.button !== 0 || e.pointerType !== 'mouse') return;
      const sx = e.clientX, sy = e.clientY;
      const rect = document.createElement('div');
      rect.className = 'sel-rect';
      desk.appendChild(rect);
      const icons = $$('.icon', desk).map((el) => ({ el, r: el.getBoundingClientRect() }));
      const move = (ev) => {
        const x1 = Math.min(sx, ev.clientX), y1 = Math.min(sy, ev.clientY);
        const x2 = Math.max(sx, ev.clientX), y2 = Math.max(sy, ev.clientY);
        Object.assign(rect.style, { left: x1 + 'px', top: y1 + 'px', width: x2 - x1 + 'px', height: y2 - y1 + 'px' });
        icons.forEach(({ el, r }) => el.classList.toggle('selected', r.left < x2 && r.right > x1 && r.top < y2 && r.bottom > y1));
      };
      const up = () => {
        rect.remove();
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });

    desk.addEventListener('contextmenu', (e) => {
      if (desk.classList.contains('no-explorer')) return e.preventDefault(); // explorer.exe sonlandırıldı
      if (e.target !== wrap && e.target !== desk) { if (!e.target.closest('input, textarea, [contenteditable], .np-text, .ie-page, .cmd')) e.preventDefault(); return; }
      e.preventDefault();
      clearSelection();
      WM.contextMenu(e.clientX, e.clientY, [
        { label: 'Simgeleri Yerleştir', action: arrangeIcons },
        { label: 'Yenile', action: refreshDesktop },
        '-',
        { label: 'Yapıştır', disabled: true },
        { label: 'Kısayol Yapıştır', disabled: true },
        '-',
        { label: 'Yeni Metin Belgesi', action: () => Apps.notepad() },
        '-',
        { label: 'Özellikler', action: Apps.sysprops },
      ]);
    });

    buildTaskbar();
    buildStartMenu();
    desktopReady = true;
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutIcons, 120);
    });
  }

  function refreshDesktop() {
    const icons = $$('.icon');
    icons.forEach((i) => i.classList.add('blink'));
    setTimeout(() => icons.forEach((i) => i.classList.remove('blink')), 180);
  }

  function enterDesktop(fresh) {
    if (!desktopReady) buildDesktop();
    show('desktop');
    layoutIcons();
    window.Extras?.desktopShown(fresh);
    storage.set(SEEN_KEY, '1');
    if (fresh) {
      busy(1600);
      setTimeout(() => {
        const about = CV_FILES.find((f) => f.name === 'Hakkımda.txt');
        Apps.notepad(about);
      }, 500);
      const how = WM.isMobile() ? 'dokunun' : 'çift tıklayın';
      setTimeout(() => balloon('Hoş geldiniz!', `Bu masaüstü benim CV'm. Bölümleri okumak için masaüstündeki .txt dosyalarına ${how}; Başlat menüsünü ve uygulamaları da keşfedebilirsiniz.`, WM.isMobile() ? 8000 : 14000), 1400);
    }
  }

  /* ---------------- Görev çubuğu ---------------- */
  function buildTaskbar() {
    const ql = $('#quick-launch');
    ql.innerHTML = '';
    [
      { icon: 'ie', title: 'Internet Explorer\'ı başlat', fn: () => Apps.ie() },
      { icon: 'desktopShow', title: 'Masaüstünü Göster', fn: () => WM.minimizeAll() },
      { icon: 'notepad', title: 'Beni Oku', fn: () => Apps.notepad(CV_FILES[0]) },
    ].forEach((q) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.title = q.title;
      b.innerHTML = `<img src="${ICONS[q.icon]}" alt="">`;
      b.addEventListener('click', q.fn);
      ql.appendChild(b);
    });

    const clock = $('#clock');
    const tick = () => {
      const d = new Date();
      clock.textContent = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
      clock.title = d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };
    tick();
    setInterval(tick, 10000);

    $('#tray-shield').addEventListener('click', () => balloon('Güvenlik Merkezi', 'Bilgisayarınız risk altında olabilir: CV çok ikna edici. Aday ile iletişime geçmeniz önerilir.\n' + CV.email, 9000, 'shield'));
    $('#tray-network').addEventListener('click', () => balloon('Yerel Ağ Bağlantısı', 'Hız: 100,0 Mb/sn\nDurum: Bağlandı\n\nLinkedIn üzerinden de bağlanabilirsiniz.', 7000, 'network'));
    $('#tray-speaker').addEventListener('click', () => balloon('Ses Düzeyi', 'Bu CV sessiz çalışır ama etkisi yüksektir. 🔊', 5000, 'speaker'));

    $('#start-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      $('#start-menu').hidden ? openStart() : closeStart();
    });
    $('#start-btn').addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  let balloonEl = null, balloonTimer = null;
  function balloon(title, text, ms = 8000, icon = 'info', onClick = null) {
    balloonEl?.remove();
    clearTimeout(balloonTimer);
    const b = document.createElement('div');
    b.className = 'balloon';
    b.innerHTML = `<h4><img src="${ICONS[icon]}" alt=""><span></span></h4><div class="balloon-text"></div><button class="balloon-x" type="button" aria-label="Kapat">×</button>`;
    b.querySelector('h4 span').textContent = title;
    b.querySelector('.balloon-text').innerHTML = WM.escapeHtml(text).replace(/\n/g, '<br>');
    b.querySelector('.balloon-x').addEventListener('click', (e) => { e.stopPropagation(); b.remove(); });
    b.addEventListener('click', () => { b.remove(); if (onClick) onClick(); else if (icon === 'info') Apps.notepad(CV_FILES[0]); });
    $('#desktop').appendChild(b);
    balloonEl = b;
    balloonTimer = setTimeout(() => b.remove(), ms);
  }
  // Telefonda balon pencerelerin altını kapatmasın: balon dışına ilk dokunuşta kapanır
  document.addEventListener('pointerdown', (e) => {
    if (balloonEl?.isConnected && WM.isMobile() && !e.target.closest('.balloon')) balloonEl.remove();
  }, true);

  /* ---------------- Başlat menüsü ---------------- */
  let flyout = null;
  function closeFlyout() { flyout?.remove(); flyout = null; $$('#start-menu .sm-item.hot').forEach((i) => i.classList.remove('hot')); }

  function smItem({ icon, label, sub, bold, small, action, fly }) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sm-item' + (bold ? ' bold' : '') + (small ? ' small' : '');
    b.innerHTML = `<img src="${ICONS[icon]}" alt=""><span>${sub ? `<b></b><small></small>` : ''}</span>${fly ? '<span class="arrow">▶</span>' : ''}`;
    const span = b.querySelector('span');
    if (sub) { span.querySelector('b').textContent = label; span.querySelector('small').textContent = sub; }
    else span.textContent = label;
    if (fly) {
      const openFly = () => {
        if (flyout && flyout._owner === b) return;
        closeFlyout();
        b.classList.add('hot');
        flyout = document.createElement('div');
        flyout.className = 'flyout';
        flyout._owner = b;
        fly().forEach((f) => {
          if (f === '-') { flyout.insertAdjacentHTML('beforeend', '<div class="sm-sep"></div>'); return; }
          const it = smItem(f);
          it.addEventListener('click', () => { closeStart(); f.action(); });
          flyout.appendChild(it);
        });
        flyout.addEventListener('pointerdown', (e) => e.stopPropagation());
        document.body.appendChild(flyout);
        const r = b.getBoundingClientRect(), fr = flyout.getBoundingClientRect();
        const left = r.right + fr.width > window.innerWidth ? Math.max(0, window.innerWidth - fr.width) : r.right - 2;
        const top = Math.max(0, Math.min(r.top, window.innerHeight - 30 - fr.height));
        Object.assign(flyout.style, { left: left + 'px', top: top + 'px' });
      };
      b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && openFly());
      b.addEventListener('click', openFly);
    } else {
      b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && closeFlyout());
      b.addEventListener('click', () => { closeStart(); action(); });
    }
    return b;
  }

  const allPrograms = () => [
    { icon: 'ie', label: 'Internet Explorer', action: () => Apps.ie() },
    { icon: 'notepad', label: 'Not Defteri', action: () => Apps.notepad() },
    { icon: 'paint', label: 'Paint', action: () => Apps.paint() },
    { icon: 'mine', label: 'Mayın Tarlası', action: () => Apps.minesweeper() },
    { icon: 'cmd', label: 'Komut İstemi', action: () => Apps.cmd() },
    { icon: 'vscode', label: 'Visual Studio Code', action: () => Apps.vscode() },
    { icon: 'msn', label: 'MSN Messenger', action: () => Extras.msnMain() },
    { icon: 'folder', label: 'Windows Gezgini', action: () => Apps.explorer('Belgelerim') },
    { icon: 'taskmgr', label: 'Görev Yöneticisi', action: () => Extras.taskmgr() },
    '-',
    ...CV_FILES.map((f) => ({ icon: 'txt', label: f.name, action: () => Apps.notepad(f) })),
    { icon: 'pdf', label: 'CV (PDF)', action: Apps.pdf },
  ];
  const connect = () => [
    { icon: 'ie', label: 'efehamdioglu.com', action: () => Apps.openExternal(CV.website) },
    { icon: 'github', label: 'GitHub', action: () => Apps.openExternal(CV.github) },
    { icon: 'linkedin', label: 'LinkedIn', action: () => Apps.openExternal(CV.linkedin) },
    { icon: 'email', label: 'E-posta gönder', action: () => (location.href = 'mailto:' + CV.email) },
  ];

  function buildStartMenu() {
    const sm = $('#start-menu');
    sm.innerHTML = `
      <div class="sm-head"><img src="${ICONS.user}" alt=""><span>${WM.escapeHtml(CV.short)}</span></div>
      <div class="sm-body"><div class="sm-left"></div><div class="sm-right"></div></div>
      <div class="sm-foot">
        <button type="button" class="sm-logoff"><img src="${ICONS.logoff}" alt="">Oturumu Kapat</button>
        <button type="button" class="sm-shutdown"><img src="${ICONS.power}" alt="">Bilgisayarı Kapat</button>
      </div>`;
    const left = $('.sm-left', sm), right = $('.sm-right', sm);
    const sep = (el) => el.insertAdjacentHTML('beforeend', '<div class="sm-sep"></div>');

    left.appendChild(smItem({ icon: 'ie', label: 'Internet', sub: 'Internet Explorer', action: () => Apps.ie() }));
    left.appendChild(smItem({ icon: 'email', label: 'E-posta', sub: CV.email, action: () => (location.href = 'mailto:' + CV.email) }));
    sep(left);
    [
      { icon: 'vscode', label: 'Visual Studio Code', action: () => Apps.vscode() },
      { icon: 'msn', label: 'MSN Messenger', action: () => Extras.msnMain() },
      { icon: 'txt', label: 'Beni Oku', action: () => Apps.notepad(CV_FILES[0]) },
      { icon: 'pdf', label: 'CV (PDF)', action: Apps.pdf },
      { icon: 'mine', label: 'Mayın Tarlası', action: () => Apps.minesweeper() },
      { icon: 'paint', label: 'Paint', action: () => Apps.paint() },
      { icon: 'cmd', label: 'Komut İstemi', action: () => Apps.cmd() },
      { icon: 'notepad', label: 'Not Defteri', action: () => Apps.notepad() },
    ].forEach((i) => left.appendChild(smItem(i)));
    sep(left);
    const all = smItem({ icon: 'arrowGreen', label: 'Tüm Programlar', fly: allPrograms });
    all.classList.add('sm-all');
    all.querySelector('img').remove();
    all.querySelector('.arrow').outerHTML = `<img src="${ICONS.arrowGreen}" alt="">`;
    left.appendChild(all);

    [
      { icon: 'mydocs', label: 'Belgelerim', bold: true, action: () => Apps.explorer('Belgelerim') },
      { icon: 'txt', label: 'Son Kullanılan Belgelerim', bold: true, fly: () => CV_FILES.map((f) => ({ icon: 'txt', label: f.name, action: () => Apps.notepad(f) })) },
      { icon: 'pictures', label: 'Resimlerim', bold: true, action: () => Apps.explorer('Resimlerim') },
      { icon: 'music', label: 'Müziğim', bold: true, action: () => Apps.explorer('Müziğim') },
      { icon: 'computer', label: 'Bilgisayarım', bold: true, action: () => Apps.explorer('Bilgisayarım') },
      { icon: 'trophy', label: 'Başarımlar', bold: true, action: () => Extras.achievements() },
      '-',
      { icon: 'control', label: 'Denetim Masası', action: Apps.sysprops },
      { icon: 'network', label: 'Bağlan', fly: connect },
      '-',
      { icon: 'help', label: 'Yardım ve Destek', action: () => Apps.notepad(CV_FILES[0]) },
      { icon: 'search', label: 'Ara', action: () => WM.dialog({ title: 'Arama Yardımcısı', icon: 'info', message: 'Ne aradığınızı biliyorum: iyi bir yazılım geliştirici.\n\nArama sonucu: 1 kişi bulundu — ' + CV.name }) },
      { icon: 'run', label: 'Çalıştır...', action: Apps.run },
    ].forEach((i) => (i === '-' ? sep(right) : right.appendChild(smItem(i))));

    $('.sm-logoff', sm).addEventListener('click', () => { closeStart(); logoffDialog(); });
    $('.sm-shutdown', sm).addEventListener('click', () => { closeStart(); shutdownDialog(); });
    sm.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  function openStart() {
    WM.closeMenus();
    $('#start-menu').hidden = false;
    $('#start-btn').classList.add('open');
  }
  function closeStart() {
    closeFlyout();
    $('#start-menu').hidden = true;
    $('#start-btn').classList.remove('open');
  }
  document.addEventListener('pointerdown', (e) => {
    if (!$('#start-menu').hidden && !e.target.closest('#start-menu, #start-btn, .flyout')) closeStart();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeStart(); WM.closeMenus(); }
    if (e.key === 'Escape' && e.ctrlKey && !$('#desktop').hidden) openStart();
  });

  /* ---------------- Kapat / Oturumu kapat ---------------- */
  function sessionDialog({ title, buttons }) {
    const overlay = document.createElement('div');
    overlay.className = 'xp-shutdown-overlay';
    overlay.innerHTML = `
      <div class="xp-shutdown" role="dialog" aria-label="${title}">
        <div class="xp-shutdown-head"><span>${title}</span><img src="${ICONS.flag}" alt=""></div>
        <div class="xp-shutdown-body"></div>
        <div class="xp-shutdown-foot"><button class="xp-btn" type="button">İptal</button></div>
      </div>`;
    const body = $('.xp-shutdown-body', overlay);
    buttons.forEach((b) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.innerHTML = `<img src="${ICONS[b.icon]}" alt=""><span>${b.label}</span>`;
      el.addEventListener('click', () => { overlay.remove(); b.action(); });
      body.appendChild(el);
    });
    $('.xp-btn', overlay).addEventListener('click', () => overlay.remove());
    overlay.addEventListener('pointerdown', (e) => e.stopPropagation());
    overlay.addEventListener('keydown', (e) => e.key === 'Escape' && overlay.remove());
    $('#desktop').appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('gray'));
    setTimeout(() => $('.xp-btn', overlay).focus(), 50);
  }

  function shutdownDialog() {
    sessionDialog({
      title: 'Bilgisayarı Kapat',
      buttons: [
        { icon: 'standby', label: 'Beklet', action: () => off('standby') },
        { icon: 'power', label: 'Kapat', action: () => { welcomeMessage('Windows kapatılıyor...', true); WM.closeAll(); setTimeout(() => off('shutdown'), 1800); } },
        { icon: 'restart', label: 'Yeniden Başlat', action: restart },
      ],
    });
  }
  function logoffDialog() {
    sessionDialog({
      title: 'Windows Oturumunu Kapat',
      buttons: [
        { icon: 'switchUser', label: 'Kullanıcı Değiştir', action: () => welcome() },
        { icon: 'logoff', label: 'Oturumu Kapat', action: () => { welcomeMessage('Oturum kapatılıyor...', true); WM.closeAll(); setTimeout(() => welcome(), 1300); } },
      ],
    });
  }

  function restart() {
    welcomeMessage('Windows yeniden başlatılıyor...', true);
    WM.closeAll();
    setTimeout(boot, 1800);
  }

  window.XP = { shutdownDialog, logoffDialog, balloon, boot, restart, closeStart };

  /* ---------------- Tam ekran ---------------- */
  // Tarayıcılar tam ekranı yalnızca kullanıcı etkileşimiyle açtırır; ilk tıklama/tuşta F11 gibi
  // tam ekrana geçilir. Kullanıcı çıkarsa bir daha zorlanmaz.
  const root = document.documentElement;
  const requestFs = root.requestFullscreen || root.webkitRequestFullscreen;
  if (requestFs && !window.matchMedia('(display-mode: fullscreen)').matches) {
    const goFullscreen = (e) => {
      if (e.type === 'keydown' && ['Escape', 'F11', 'Tab'].includes(e.key)) return;
      window.removeEventListener('pointerup', goFullscreen, true);
      window.removeEventListener('keydown', goFullscreen, true);
      if (document.fullscreenElement || document.webkitFullscreenElement) return;
      try { Promise.resolve(requestFs.call(root)).catch(() => {}); } catch { /* yok say */ }
    };
    window.addEventListener('pointerup', goFullscreen, true);
    window.addEventListener('keydown', goFullscreen, true);
  }

  /* ---------------- Başlangıç ---------------- */
  const params = new URLSearchParams(location.search);
  if (params.has('desktop') || storage.get(SEEN_KEY)) enterDesktop(params.has('desktop') && !storage.get(SEEN_KEY));
  else boot();
})();
