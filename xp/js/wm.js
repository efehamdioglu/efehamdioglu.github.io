/* Pencere yöneticisi: pencereler, görev çubuğu düğmeleri, menüler, iletişim kutuları. */
const WM = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const layer = () => $('#windows');
  const taskbar = () => $('#task-buttons');
  const TASKBAR_H = 30;
  const wins = new Map();
  let z = 10, seq = 0, cascade = 0;

  const isMobile = () => window.innerWidth < 700;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function open(opts) {
    if (opts.id && wins.has(opts.id)) {
      const w = wins.get(opts.id);
      restore(w);
      return w;
    }
    const id = opts.id || 'win' + ++seq;
    const el = document.createElement('div');
    el.className = 'window opening' + (opts.resizable === false ? ' fixed' : '') + (opts.className ? ' ' + opts.className : '');
    el.setAttribute('role', 'dialog');
    el.innerHTML = `
      <div class="title-bar">
        ${opts.icon ? `<img class="title-icon" src="${opts.icon}" alt="">` : ''}
        <span class="title-text"></span>
        <div class="title-controls">
          ${opts.help ? '<button class="tb-btn tb-help" type="button" aria-label="Yardım"></button>' : ''}
          ${opts.minimizable !== false ? '<button class="tb-btn tb-min" type="button" aria-label="Simge durumuna küçült"></button>' : ''}
          ${opts.resizable !== false ? '<button class="tb-btn tb-max" type="button" aria-label="Ekranı kapla"></button>' : ''}
          <button class="tb-btn tb-close" type="button" aria-label="Kapat"></button>
        </div>
      </div>
      <div class="window-body"></div>
      ${['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((d) => `<div class="rz" data-dir="${d}"></div>`).join('')}`;
    const w = {
      id, el, opts,
      body: $('.window-body', el),
      titleEl: $('.title-text', el),
      task: null,
      maximized: false,
      minimized: false,
      prev: null,
      onClose: opts.onClose,
    };
    w.setTitle = (t) => {
      w.title = t;
      w.titleEl.textContent = t;
      if (w.task) {
        w.task.querySelector('span').textContent = t;
        w.task.title = t;
      }
    };
    w.close = () => close(w);
    w.focus = () => focus(w);

    layer().appendChild(el);
    wins.set(id, w);
    w.setTitle(opts.title || '');

    // Boyut & konum
    const deskW = window.innerWidth, deskH = window.innerHeight - TASKBAR_H;
    if (opts.width) el.style.width = Math.min(opts.width, deskW - 8) + 'px';
    if (opts.height) el.style.height = Math.min(opts.height, deskH - 8) + 'px';

    if (opts.render) opts.render(w.body, w);

    const ww = el.offsetWidth, wh = el.offsetHeight;
    let x, y;
    if (opts.center) {
      x = (deskW - ww) / 2;
      y = (deskH - wh) / 2.4;
    } else {
      const off = (cascade++ % 8) * 26;
      x = (opts.x ?? (window.innerWidth > 1000 ? 200 : 110) + off);
      y = (opts.y ?? 40 + off);
      if (x + ww > deskW) x = Math.max(4, deskW - ww - 10);
      if (y + wh > deskH) y = Math.max(0, deskH - wh - 10);
    }
    el.style.left = Math.round(Math.max(0, x)) + 'px';
    el.style.top = Math.round(Math.max(0, y)) + 'px';
    el.addEventListener('animationend', () => el.classList.remove('opening'), { once: true });

    // Görev çubuğu düğmesi
    if (opts.taskbar !== false) {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'task-btn';
      t.innerHTML = `<img src="${opts.icon || ICONS.flag}" alt=""><span></span>`;
      t.querySelector('span').textContent = w.title;
      t.title = w.title;
      t.addEventListener('click', () => {
        if (w.minimized) restore(w);
        else if (el.classList.contains('active')) minimize(w);
        else focus(w);
      });
      t.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu(e.clientX, e.clientY - 70, [
          { label: 'Geri Yükle', disabled: !w.minimized && !w.maximized, action: () => (w.minimized ? restore(w) : toggleMax(w)) },
          { label: 'Simge Durumuna Küçült', disabled: w.minimized || opts.minimizable === false, action: () => minimize(w) },
          { label: 'Ekranı Kapla', disabled: w.maximized || opts.resizable === false, action: () => { restore(w); toggleMax(w); } },
          '-',
          { label: 'Kapat', bold: true, key: 'Alt+F4', action: () => close(w) },
        ]);
      });
      taskbar().appendChild(t);
      w.task = t;
    }

    wire(w);
    if ((opts.maximized || (isMobile() && opts.resizable !== false))) toggleMax(w, true);
    focus(w);
    return w;
  }

  function wire(w) {
    const { el } = w;
    const bar = $('.title-bar', el);
    el.addEventListener('pointerdown', () => focus(w), true);

    $('.tb-close', el).addEventListener('click', (e) => { e.stopPropagation(); close(w); });
    $('.tb-min', el)?.addEventListener('click', (e) => { e.stopPropagation(); minimize(w); });
    $('.tb-max', el)?.addEventListener('click', (e) => { e.stopPropagation(); toggleMax(w); });
    $('.tb-help', el)?.addEventListener('click', (e) => { e.stopPropagation(); w.opts.help(); });

    bar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.tb-btn') || w.opts.resizable === false) return;
      toggleMax(w);
    });

    bar.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.tb-btn') || w.maximized) return;
      const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      bar.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const nx = clamp(ox + ev.clientX - sx, -el.offsetWidth + 80, window.innerWidth - 80);
        const ny = clamp(oy + ev.clientY - sy, 0, window.innerHeight - TASKBAR_H - 26);
        el.style.left = nx + 'px';
        el.style.top = ny + 'px';
      };
      const up = () => {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });

    el.querySelectorAll('.rz').forEach((h) =>
      h.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        const dir = h.dataset.dir;
        const r = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
        const minW = w.opts.minWidth || 220, minH = w.opts.minHeight || 120;
        const sx = e.clientX, sy = e.clientY;
        h.setPointerCapture(e.pointerId);
        const move = (ev) => {
          const dx = ev.clientX - sx, dy = ev.clientY - sy;
          let { x, y, w: nw, h: nh } = r;
          if (dir.includes('e')) nw = Math.max(minW, r.w + dx);
          if (dir.includes('s')) nh = Math.max(minH, r.h + dy);
          if (dir.includes('w')) { nw = Math.max(minW, r.w - dx); x = r.x + r.w - nw; }
          if (dir.includes('n')) { nh = Math.max(minH, r.h - dy); y = Math.max(0, r.y + r.h - nh); }
          Object.assign(el.style, { left: x + 'px', top: y + 'px', width: nw + 'px', height: nh + 'px' });
          w.opts.onResize?.(w);
        };
        const up = () => {
          h.removeEventListener('pointermove', move);
          h.removeEventListener('pointerup', up);
        };
        h.addEventListener('pointermove', move);
        h.addEventListener('pointerup', up);
      })
    );
  }

  function focus(w) {
    if (!w || !wins.has(w.id)) return;
    if (w.el.classList.contains('active') && +w.el.style.zIndex === z) return;
    wins.forEach((o) => {
      o.el.classList.remove('active');
      o.task?.classList.remove('active');
    });
    w.el.style.zIndex = ++z;
    w.el.classList.add('active');
    w.task?.classList.add('active');
    w.task?.classList.remove('flash');
    w.opts.onFocus?.(w);
  }

  function blurAll() {
    wins.forEach((o) => {
      o.el.classList.remove('active');
      o.task?.classList.remove('active');
    });
  }

  function topmost(except) {
    let best = null;
    wins.forEach((o) => {
      if (o === except || o.minimized) return;
      if (!best || +o.el.style.zIndex > +best.el.style.zIndex) best = o;
    });
    return best;
  }

  function minimize(w) {
    w.minimized = true;
    w.el.classList.add('minimized');
    w.el.classList.remove('active');
    w.task?.classList.remove('active');
    const next = topmost(w);
    if (next) focus(next);
  }

  function restore(w) {
    if (w.minimized) {
      w.minimized = false;
      w.el.classList.remove('minimized');
    }
    focus(w);
  }

  function toggleMax(w, force) {
    const el = w.el;
    if (!w.maximized || force === true) {
      if (w.maximized) return;
      w.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
      Object.assign(el.style, { left: '0px', top: '0px', width: '100%', height: `calc(100% - ${TASKBAR_H}px)` });
      el.classList.add('maximized');
      w.maximized = true;
    } else {
      Object.assign(el.style, w.prev);
      el.classList.remove('maximized');
      w.maximized = false;
    }
    w.opts.onResize?.(w);
  }

  function close(w) {
    if (!wins.has(w.id)) return;
    if (w.onClose && w.onClose(w) === false) return;
    w.el.remove();
    w.task?.remove();
    wins.delete(w.id);
    const next = topmost();
    if (next) focus(next);
  }

  function closeAll() {
    [...wins.values()].forEach((w) => {
      w.el.remove();
      w.task?.remove();
    });
    wins.clear();
  }

  function minimizeAll() {
    const visible = [...wins.values()].filter((w) => !w.minimized && w.opts.minimizable !== false);
    if (visible.length) visible.forEach(minimize);
    else wins.forEach((w) => w.minimized && restore(w));
  }

  function get(id) { return wins.get(id); }

  /* ---------- Menüler ---------- */
  let openCtx = null;
  function closeMenus() {
    openCtx?.remove();
    openCtx = null;
    document.querySelectorAll('.menubar .mb-item.open').forEach((m) => {
      m.classList.remove('open');
      m.querySelector('.dropdown')?.remove();
    });
  }

  function buildItems(container, items) {
    items.forEach((it) => {
      if (it === '-') {
        container.insertAdjacentHTML('beforeend', '<div class="msep"></div>');
        return;
      }
      const d = document.createElement('div');
      d.className = 'mi' + (it.disabled ? ' disabled' : '') + (it.checked ? ' checked' : '') + (it.bold ? ' bold' : '');
      d.innerHTML = `<span>${escapeHtml(it.label)}</span>${it.key ? `<span class="mi-key">${escapeHtml(it.key)}</span>` : ''}`;
      d.addEventListener('pointerup', (e) => {
        e.stopPropagation();
        if (it.disabled) return;
        closeMenus();
        it.action?.();
      });
      d.addEventListener('pointerdown', (e) => e.stopPropagation());
      container.appendChild(d);
    });
  }

  function contextMenu(x, y, items) {
    closeMenus();
    const m = document.createElement('div');
    m.className = 'ctx';
    buildItems(m, items);
    document.body.appendChild(m);
    const r = m.getBoundingClientRect();
    m.style.left = clamp(x, 0, window.innerWidth - r.width - 2) + 'px';
    m.style.top = clamp(y, 0, window.innerHeight - r.height - 2) + 'px';
    openCtx = m;
  }

  function menubar(parent, menus) {
    const bar = document.createElement('div');
    bar.className = 'menubar';
    let active = false;
    menus.forEach((menu) => {
      const item = document.createElement('div');
      item.className = 'mb-item';
      item.textContent = menu.label;
      const show = () => {
        closeMenus();
        item.classList.add('open');
        const dd = document.createElement('div');
        dd.className = 'dropdown';
        buildItems(dd, typeof menu.items === 'function' ? menu.items() : menu.items);
        item.appendChild(dd);
        active = true;
      };
      item.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (e.target.closest('.dropdown')) return;
        if (item.classList.contains('open')) { closeMenus(); active = false; }
        else show();
      });
      item.addEventListener('pointerenter', () => {
        if (active && bar.querySelector('.mb-item.open') && !item.classList.contains('open')) show();
      });
      bar.appendChild(item);
    });
    const logo = document.createElement('div');
    logo.className = 'mb-logo';
    logo.innerHTML = `<img src="${ICONS.flagTile}" alt="">`;
    bar.appendChild(logo);
    document.addEventListener('pointerdown', () => { active = false; });
    parent.appendChild(bar);
    return bar;
  }

  document.addEventListener('pointerdown', closeMenus);
  window.addEventListener('blur', closeMenus);

  /* ---------- İletişim kutuları ---------- */
  function dialog({ title = 'Windows', icon = 'info', message = '', buttons = ['Tamam'], onButton }) {
    let win;
    win = open({
      title,
      icon: null,
      width: null,
      resizable: false,
      minimizable: false,
      taskbar: false,
      center: true,
      className: 'dialog',
      render(body) {
        body.innerHTML = `
          <div class="dlg">
            <div class="dlg-row"><img src="${ICONS[icon] || ICONS.info}" alt=""><div class="dlg-msg"></div></div>
            <div class="dlg-btns"></div>
          </div>`;
        body.querySelector('.dlg-msg').textContent = message;
        const bb = body.querySelector('.dlg-btns');
        buttons.forEach((label, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'xp-btn' + (i === 0 ? ' default' : '');
          b.textContent = label;
          b.addEventListener('click', () => {
            win.close();
            onButton?.(label, i);
          });
          bb.appendChild(b);
        });
        setTimeout(() => bb.querySelector('button')?.focus(), 30);
      },
    });
    return win;
  }

  return { open, close, closeAll, focus, blurAll, minimize, minimizeAll, restore, toggleMax, get, dialog, menubar, contextMenu, closeMenus, isMobile, escapeHtml, wins };
})();
