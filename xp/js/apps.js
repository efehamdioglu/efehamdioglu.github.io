/* Uygulamalar: Not Defteri, Gezgin, Internet Explorer, Mayın Tarlası, Paint, Komut İstemi, Çalıştır, Sistem Özellikleri, VS Code. */
const Apps = (() => {
  const esc = WM.escapeHtml;
  const svg16 = (body) =>
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${body}</svg>`);
  const isTouch = (e) => e.pointerType && e.pointerType !== 'mouse';

  function openExternal(url) {
    window.open(url, '_blank', 'noopener');
  }

  /* URL, e-posta ve telefonları tıklanabilir yap */
  function linkify(text) {
    return esc(text).replace(
      /(https?:\/\/[^\s<]+)|([\w.+-]+@[\w-]+\.[\w.]+)|(\+90[\d ]{10,14}\d)/g,
      (m, url, mail, tel) => {
        if (url) return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
        if (mail) return `<a href="mailto:${mail}">${mail}</a>`;
        return `<a href="tel:${tel.replace(/\s/g, '')}">${tel}</a>`;
      }
    );
  }

  const byteSize = (s) => new Blob([s]).size;
  const kb = (s) => Math.max(1, Math.ceil(byteSize(s) / 1024)) + ' KB';

  /* ---------- Öğe fabrikası (masaüstü + gezgin ortak) ---------- */
  const Items = {
    txt: (f) => ({ name: f.name, icon: 'txt', meta: ['Metin Belgesi', kb(f.text)], open: () => notepad(f) }),
    pdf: () => ({ name: 'Osman_Efe_Hamdioglu_CV.pdf', icon: 'pdf', meta: ['Adobe Acrobat Belgesi', '264 KB'], open: pdf }),
    app: (name, icon, fn, meta = 'Kısayol') => ({ name, icon, meta: [meta], open: fn }),
    folder: (name, icon, path, meta = 'Dosya Klasörü') => ({ name, icon, meta: [meta], folder: path, open: () => explorer(path) }),
    link: (name, icon, url, meta = 'Internet Kısayolu') => ({ name, icon, meta: [meta], open: () => openExternal(url) }),
  };

  /* ---------- Not Defteri ---------- */
  function notepad(file) {
    const blank = !file;
    file = file || { name: 'Adsız', text: '' };
    if (!blank) window.Extras?.read(file.name);
    let fontSize = WM.isMobile() ? 12 : 13;
    return WM.open({
      id: blank ? undefined : 'np:' + file.name,
      title: `${file.name} - Not Defteri`,
      icon: ICONS.notepad,
      width: 640,
      height: 500,
      render(body, w) {
        let wrap = true;
        const text = document.createElement('div');
        text.className = 'np-text xp-scroll';
        text.tabIndex = 0;
        text.spellcheck = false;
        if (blank) {
          text.contentEditable = 'true';
          text.textContent = '';
        } else {
          text.innerHTML = linkify(file.text);
        }
        const selectAll = () => {
          const r = document.createRange();
          r.selectNodeContents(text);
          const s = getSelection();
          s.removeAllRanges();
          s.addRange(r);
        };
        const copy = () => {
          const s = String(getSelection());
          if (s && navigator.clipboard) navigator.clipboard.writeText(s).catch(() => {});
        };
        const setFont = (d) => {
          fontSize = Math.max(9, Math.min(24, fontSize + d));
          text.style.fontSize = fontSize + 'px';
        };
        WM.menubar(body, [
          {
            label: 'Dosya',
            items: [
              { label: 'Yeni', key: 'Ctrl+N', action: () => notepad() },
              { label: 'Aç...', key: 'Ctrl+O', action: () => explorer('Belgelerim') },
              { label: 'Kaydet', key: 'Ctrl+S', disabled: true },
              { label: 'Farklı Kaydet...', disabled: true },
              '-',
              { label: "CV'yi PDF olarak aç", action: pdf },
              '-',
              { label: 'Çıkış', action: () => w.close() },
            ],
          },
          {
            label: 'Düzen',
            items: () => [
              { label: 'Geri Al', key: 'Ctrl+Z', disabled: !blank, action: () => document.execCommand('undo') },
              '-',
              { label: 'Kopyala', key: 'Ctrl+C', action: copy },
              '-',
              { label: 'Tümünü Seç', key: 'Ctrl+A', action: selectAll },
              { label: 'Saat/Tarih', key: 'F5', disabled: !blank, action: () => { text.focus(); document.execCommand('insertText', false, new Date().toLocaleString('tr-TR')); } },
            ],
          },
          {
            label: 'Biçim',
            items: () => [
              { label: 'Sözcük Kaydır', checked: wrap, action: () => { wrap = !wrap; text.classList.toggle('nowrap', !wrap); } },
              '-',
              { label: 'Yazı Tipini Büyüt', key: 'Ctrl++', action: () => setFont(1) },
              { label: 'Yazı Tipini Küçült', key: 'Ctrl+-', action: () => setFont(-1) },
            ],
          },
          { label: 'Görünüm', items: [{ label: 'Durum Çubuğu', disabled: true }] },
          {
            label: 'Yardım',
            items: [
              { label: 'Yardım Konuları', action: () => notepad(CV_FILES[0]) },
              '-',
              { label: 'Not Defteri Hakkında', action: () => WM.dialog({ title: 'Not Defteri Hakkında', icon: 'info', message: 'Not Defteri\nSürüm 5.1 (Derleme 2600.xpsp_sp3_cv)\n\nBu ürün şu kişiye lisanslanmıştır:\n' + CV.name }) },
            ],
          },
        ]);
        body.appendChild(text);
        text.addEventListener('keydown', (e) => {
          if (e.ctrlKey && e.key.toLowerCase() === 'a') { e.preventDefault(); selectAll(); }
          if (e.ctrlKey && (e.key === '+' || e.key === '=')) { e.preventDefault(); setFont(1); }
          if (e.ctrlKey && e.key === '-') { e.preventDefault(); setFont(-1); }
        });
        setTimeout(() => text.focus({ preventScroll: true }), 50);
      },
    });
  }

  /* ---------- Gezgin ---------- */
  const DOCS_PATH = 'C:\\Documents and Settings\\Efe';
  const FS = {
    'Masaüstü': { icon: 'desktopShow', address: DOCS_PATH + '\\Masaüstü', items: () => desktopItems().filter((i) => i.name !== 'Geri Dönüşüm Kutusu') },
    'Belgelerim': {
      icon: 'mydocs',
      address: DOCS_PATH + '\\Belgelerim',
      items: () => [
        Items.folder('Resimlerim', 'pictures', 'Resimlerim'),
        Items.folder('Müziğim', 'music', 'Müziğim'),
        ...CV_FILES.map(Items.txt),
        Items.pdf(),
      ],
    },
    'Resimlerim': { icon: 'pictures', address: DOCS_PATH + '\\Belgelerim\\Resimlerim', items: () => [] },
    'Müziğim': { icon: 'music', address: DOCS_PATH + '\\Belgelerim\\Müziğim', items: () => [Items.link('WavLock.url', 'ie', 'https://wavlock.com')] },
    'Bilgisayarım': {
      icon: 'computer',
      address: 'Bilgisayarım',
      groups: true,
      items: () => [
        { ...Items.folder('Belgelerim', 'mydocs', 'Belgelerim'), group: 'Bu Bilgisayarda Depolanan Dosyalar' },
        { ...Items.folder('Yerel Disk (C:)', 'drive', 'C:', 'Yerel Disk'), group: 'Sabit Disk Sürücüleri' },
        {
          name: 'DVD-RW Sürücüsü (D:)', icon: 'cd', meta: ['CD Sürücüsü'], group: 'Çıkarılabilir Depolama Birimi Olan Aygıtlar',
          open: () => WM.dialog({ title: 'D:\\ öğesine erişilemiyor', icon: 'error', message: 'D:\\ öğesine erişilemiyor.\n\nAygıt hazır değil.' }),
        },
      ],
    },
    'C:': {
      icon: 'drive',
      address: 'C:\\',
      items: () => [
        Items.folder('Documents and Settings', 'folder', 'Belgelerim'),
        Items.folder('Program Files', 'folder', 'Program Files'),
        { name: 'WINDOWS', icon: 'folder', meta: ['Dosya Klasörü'], open: () => WM.dialog({ title: 'Bu dosyalar gizli', icon: 'warning', message: 'Bu klasör sisteminizin düzgün çalışmasını sağlayan dosyalar içerir.\nİçeriğini değiştirmemelisiniz.\n\n(Merak etmeyin, burada CV yok.)' }) },
      ],
    },
    'Program Files': {
      icon: 'folder',
      address: 'C:\\Program Files',
      items: () => [
        Items.app('Internet Explorer', 'ie', () => ie(), 'Uygulama'),
        Items.app('Not Defteri', 'notepad', () => notepad(), 'Uygulama'),
        Items.app('Paint', 'paint', () => paint(), 'Uygulama'),
        Items.app('Mayın Tarlası', 'mine', () => minesweeper(), 'Uygulama'),
        Items.app('Komut İstemi', 'cmd', () => cmd(), 'Uygulama'),
      ],
    },
    'Geri Dönüşüm Kutusu': {
      icon: 'recycle',
      address: 'Geri Dönüşüm Kutusu',
      items: () => RECYCLE_ITEMS.map((r) => ({
        name: r.name, icon: r.icon, meta: [r.type, r.size],
        open: () => WM.dialog({ title: 'Geri Dönüşüm Kutusu', icon: 'info', message: `"${r.name}" silinmiş bir öğedir.\nAçmak için önce geri yüklemeniz gerekir.\n\n(Bazı şeyler geri dönüşüm kutusunda kalsa daha iyi.)` }),
      })),
    },
  };

  let desktopItems = () => [];
  const setDesktopItems = (fn) => { desktopItems = fn; };

  function explorer(path = 'Belgelerim') {
    const existing = [...WM.wins.values()].find((w) => w.explorerPath === path);
    if (existing) { WM.restore(existing); return existing; }
    return WM.open({
      title: path,
      icon: ICONS[FS[path]?.icon || 'folder'],
      width: 760,
      height: 520,
      render(body, w) {
        const history = [];
        let pos = -1;
        let selected = null;

        WM.menubar(body, [
          { label: 'Dosya', items: [{ label: 'Kapat', action: () => w.close() }] },
          { label: 'Düzen', items: [{ label: 'Tümünü Seç', key: 'Ctrl+A', action: () => content.querySelectorAll('.tile').forEach((t) => t.classList.add('selected')) }] },
          { label: 'Görünüm', items: [{ label: 'Döşemeler', checked: true }, { label: 'Simgeler', disabled: true }, { label: 'Liste', disabled: true }] },
          { label: 'Sık Kullanılanlar', items: [{ label: 'GitHub', action: () => openExternal(CV.github) }, { label: 'LinkedIn', action: () => openExternal(CV.linkedin) }, { label: 'efehamdioglu.com', action: () => openExternal(CV.website) }] },
          { label: 'Araçlar', items: [{ label: 'Klasör Seçenekleri...', disabled: true }] },
          { label: 'Yardım', items: [{ label: 'Windows hakkında', action: sysprops }] },
        ]);

        body.insertAdjacentHTML('beforeend', `
          <div class="ex-toolbar">
            <button class="ex-tbtn ex-back" type="button" title="Geri"><img src="${ICONS.back}" alt=""><span>Geri</span></button>
            <button class="ex-tbtn ex-fwd" type="button" title="İleri"><img src="${ICONS.forward}" alt=""></button>
            <button class="ex-tbtn ex-up" type="button" title="Yukarı"><img src="${ICONS.up}" alt=""></button>
            <div class="ex-tsep"></div>
            <button class="ex-tbtn ex-search" type="button"><img src="${ICONS.search}" alt=""><span>Ara</span></button>
            <button class="ex-tbtn ex-folders" type="button"><img src="${ICONS.folder}" alt=""><span>Klasörler</span></button>
            <div class="ex-tsep"></div>
            <button class="ex-tbtn" type="button" title="Görünümler"><img src="${ICONS.views}" alt=""></button>
          </div>
          <div class="ex-address">
            <label>Adres</label>
            <div class="ex-path"><img alt=""><input type="text" spellcheck="false" aria-label="Adres"></div>
            <button class="ex-go" type="button"><img src="${ICONS.arrowGreen}" alt="">Git</button>
          </div>
          <div class="ex-main">
            <div class="ex-side xp-scroll"></div>
            <div class="ex-content xp-scroll" tabindex="0"></div>
          </div>
          <div class="statusbar"><span class="ex-status"></span><span><img src="${ICONS.computer}" alt="">Bilgisayarım</span></div>`);

        const $ = (s) => body.querySelector(s);
        const content = $('.ex-content'), side = $('.ex-side'), addrInput = $('.ex-path input'), addrIcon = $('.ex-path img');
        const parentOf = { 'Resimlerim': 'Belgelerim', 'Müziğim': 'Belgelerim', 'Belgelerim': 'Bilgisayarım', 'C:': 'Bilgisayarım', 'Program Files': 'C:', 'Masaüstü': null, 'Bilgisayarım': 'Masaüstü', 'Geri Dönüşüm Kutusu': 'Masaüstü' };

        function go(p, push = true) {
          if (!FS[p]) return false;
          if (push) {
            history.splice(pos + 1);
            history.push(p);
            pos = history.length - 1;
          }
          w.explorerPath = p;
          w.setTitle(p);
          w.el.querySelector('.title-icon').src = ICONS[FS[p].icon];
          w.task && (w.task.querySelector('img').src = ICONS[FS[p].icon]);
          addrInput.value = FS[p].address;
          addrIcon.src = ICONS[FS[p].icon];
          $('.ex-back').disabled = pos <= 0;
          $('.ex-fwd').disabled = pos >= history.length - 1;
          $('.ex-up').disabled = !parentOf[p];
          renderContent(p);
          renderSide(p);
          return true;
        }

        function renderContent(p) {
          const items = FS[p].items();
          content.innerHTML = '';
          selected = null;
          if (!items.length) content.innerHTML = '<div class="ex-empty">Bu klasör boş.</div>';
          let lastGroup = null;
          items.forEach((it) => {
            if (FS[p].groups && it.group !== lastGroup) {
              lastGroup = it.group;
              const g = document.createElement('div');
              g.className = 'ex-group';
              g.textContent = it.group;
              content.appendChild(g);
            }
            const t = document.createElement('div');
            t.className = 'tile';
            t.tabIndex = -1;
            t.innerHTML = `<img src="${ICONS[it.icon]}" alt=""><div class="tile-text"><span class="tile-name"></span>${it.meta.map((m) => `<span class="tile-meta">${esc(m)}</span>`).join('')}</div>`;
            t.querySelector('.tile-name').textContent = it.name;
            t.title = it.name;
            const activate = () => (it.folder && FS[it.folder] ? go(it.folder) : it.open());
            t.addEventListener('click', (e) => {
              content.querySelectorAll('.tile.selected').forEach((s) => s.classList.remove('selected'));
              t.classList.add('selected');
              selected = it;
              renderDetails(it);
              if (e.pointerType && e.pointerType !== 'mouse') activate();
            });
            t.addEventListener('pointerup', (e) => { t._pt = e.pointerType; });
            t.addEventListener('dblclick', activate);
            t.addEventListener('keydown', (e) => e.key === 'Enter' && activate());
            t._activate = activate;
            content.appendChild(t);
          });
          $('.ex-status').textContent = `${items.length} nesne`;
        }

        content.addEventListener('pointerdown', (e) => {
          if (!e.target.closest('.tile')) {
            content.querySelectorAll('.tile.selected').forEach((s) => s.classList.remove('selected'));
            selected = null;
            renderDetails(null);
          }
        });

        function panel(title, html, cls = '') {
          const p = document.createElement('div');
          p.className = 'ex-panel ' + cls;
          p.innerHTML = `<div class="ex-panel-h"><span>${esc(title)}</span><span class="chev">︽</span></div><div class="ex-panel-b"></div>`;
          p.querySelector('.ex-panel-h').addEventListener('click', () => p.classList.toggle('collapsed'));
          const b = p.querySelector('.ex-panel-b');
          if (typeof html === 'string') b.innerHTML = html;
          else html.forEach((l) => b.appendChild(l));
          side.appendChild(p);
          return p;
        }
        const link = (label, icon, fn) => {
          const a = document.createElement('div');
          a.className = 'ex-link';
          a.innerHTML = `<img src="${ICONS[icon]}" alt=""><span></span>`;
          a.querySelector('span').textContent = label;
          a.addEventListener('click', fn);
          return a;
        };

        function renderSide(p) {
          side.innerHTML = '';
          if (p === 'Bilgisayarım') {
            panel('Sistem Görevleri', [
              link('Sistem bilgilerini görüntüle', 'control', sysprops),
              link('Program ekle veya kaldır', 'control', () => WM.dialog({ title: 'Program Ekle veya Kaldır', icon: 'info', message: 'Yüklü program: Efe v2026\nBoyut: Paha biçilmez\nKaldırma: Önerilmez :)' })),
              link('Bir ayarı değiştir', 'control', sysprops),
            ], 'special');
          } else if (p === 'Geri Dönüşüm Kutusu') {
            panel('Geri Dönüşüm Kutusu Görevleri', [
              link('Geri Dönüşüm Kutusunu boşalt', 'recycle', () => WM.dialog({ title: 'Birden Çok Dosya Silmeyi Onayla', icon: 'question', message: `Bu ${RECYCLE_ITEMS.length} öğeyi silmek istediğinizden emin misiniz?`, buttons: ['Evet', 'Hayır'], onButton: (b) => b === 'Evet' && WM.dialog({ title: 'Geri Dönüşüm Kutusu', icon: 'warning', message: 'node_modules silinemiyor: Dosya çok büyük.\n\nBazı şeyler asla gerçekten silinmez.' }) })),
              link('Tüm öğeleri geri yükle', 'back', () => WM.dialog({ title: 'Geri Dönüşüm Kutusu', icon: 'info', message: 'cv_final_final_SON_v3.doc zaten güncel CV ile değiştirildi.' })),
            ]);
          } else {
            panel('Dosya ve Klasör Görevleri', [
              link("CV'yi PDF olarak aç", 'pdf', pdf),
              link('Bu klasörü Web\'de yayımla', 'ie', () => openExternal(CV.github)),
              link('Bu dosyayı e-posta ile gönder', 'email', () => (location.href = 'mailto:' + CV.email)),
            ]);
          }
          const places = ['Masaüstü', 'Belgelerim', 'Bilgisayarım', 'Geri Dönüşüm Kutusu'].filter((x) => x !== p);
          panel('Diğer Yerler', places.map((x) => link(x, FS[x].icon, () => go(x))));
          const det = panel('Ayrıntılar', '');
          det.classList.add('ex-details-panel');
          renderDetails(null);
        }

        function renderDetails(it) {
          const b = side.querySelector('.ex-details-panel .ex-panel-b');
          if (!b) return;
          const p = w.explorerPath;
          b.innerHTML = it
            ? `<div class="ex-details"><b>${esc(it.name)}</b>${it.meta.map(esc).join('<br>')}</div>`
            : `<div class="ex-details"><b>${esc(p)}</b>${p === 'Bilgisayarım' || p === 'Geri Dönüşüm Kutusu' ? 'Sistem Klasörü' : 'Dosya Klasörü'}</div>`;
        }

        $('.ex-back').addEventListener('click', () => pos > 0 && go(history[--pos], false));
        $('.ex-fwd').addEventListener('click', () => pos < history.length - 1 && go(history[++pos], false));
        $('.ex-up').addEventListener('click', () => { const up = parentOf[w.explorerPath]; up && go(up); });
        $('.ex-search').addEventListener('click', () => WM.dialog({ title: 'Arama Yardımcısı', icon: 'info', message: 'Aradığınız şey muhtemelen masaüstündeki .txt dosyalarında. :)' }));
        $('.ex-folders').addEventListener('click', () => go('Bilgisayarım'));
        const submit = () => {
          const v = addrInput.value.trim();
          const hit = Object.keys(FS).find((k) => k.toLocaleLowerCase('tr') === v.toLocaleLowerCase('tr') || FS[k].address.toLocaleLowerCase('tr') === v.toLocaleLowerCase('tr'));
          if (hit) go(hit);
          else if (/^(https?:\/\/|www\.)/i.test(v)) openExternal(/^https?:/i.test(v) ? v : 'http://' + v);
          else WM.dialog({ title: w.title, icon: 'error', message: `Windows '${v}' öğesini bulamıyor. Adın doğru yazıldığından emin olun ve yeniden deneyin.` });
        };
        $('.ex-go').addEventListener('click', submit);
        addrInput.addEventListener('keydown', (e) => e.key === 'Enter' && submit());
        content.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && selected) content.querySelector('.tile.selected')?._activate();
        });

        go(path);
      },
    });
  }

  /* ---------- Internet Explorer ---------- */
  function ieHome() {
    const projects = PROJECTS.map((p) => `
      <div class="ie-project">
        <h4>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${esc(p.name)}</a>` : esc(p.name)}</h4>
        <small>${esc(p.tech)}</small>
        <p>${esc(p.desc)}</p>
      </div>`).join('');
    const counter = String(1337 + Math.floor((Date.now() / 36e5) % 9000)).padStart(6, '0');
    return `
      <div class="ie-home">
        <div class="ie-banner">
          <h1>${esc(CV.name)}</h1>
          <p>${esc(CV.title)} · Ankara, Türkiye</p>
        </div>
        <div class="ie-marquee"><span>★ Kişisel ana sayfama hoş geldiniz! ★ Bu site en iyi 1024x768 çözünürlükte Internet Explorer 6 ile görüntülenir ★ Ziyaretiniz için teşekkürler ★</span></div>
        <div class="ie-cols">
          <div>
            <div class="ie-box"><h3>Hakkımda</h3><div>${esc(CV_FILES[1].text.split('HAKKIMDA\n--------\n')[1].split('\n\n\nDiğer')[0]).replace(/\n\n/g, '<br><br>')}</div></div>
            <div class="ie-box"><h3>Seçilmiş Projeler</h3><div>${projects}</div></div>
          </div>
          <aside>
            <div class="ie-box"><h3>Bağlantılar</h3><div>
              <a class="ie-link" href="${CV.website}" target="_blank" rel="noopener"><img src="${ICONS.ie}" alt="">efehamdioglu.com</a>
              <a class="ie-link" href="${CV.github}" target="_blank" rel="noopener"><img src="${ICONS.github}" alt="">GitHub</a>
              <a class="ie-link" href="${CV.linkedin}" target="_blank" rel="noopener"><img src="${ICONS.linkedin}" alt="">LinkedIn</a>
              <a class="ie-link" href="mailto:${CV.email}"><img src="${ICONS.email}" alt="">E-posta gönder</a>
              <a class="ie-link" href="${CV.pdf}" target="_blank" rel="noopener"><img src="${ICONS.pdf}" alt="">CV (PDF)</a>
            </div></div>
            <div class="ie-box"><h3>Şu An</h3><div>
              <b>Yazılım Geliştirici</b><br>BZB İletişim — Ankara<br><small>Haziran 2026 — Devam ediyor</small>
            </div></div>
            <div class="ie-box"><h3>Ziyaretçi Sayacı</h3><div style="text-align:center"><span class="ie-counter">${counter}</span></div></div>
          </aside>
        </div>
        <div class="ie-footer">© 2026 ${esc(CV.name)} · Son güncelleme: 23.09.2026</div>
      </div>`;
  }

  function ie() {
    return WM.open({
      id: 'ie',
      title: `${CV.short} - Microsoft Internet Explorer`,
      icon: ICONS.ie,
      width: 860,
      height: 600,
      render(body, w) {
        const favorites = () => [
          { label: 'efehamdioglu.com', action: () => openExternal(CV.website) },
          { label: 'GitHub', action: () => openExternal(CV.github) },
          { label: 'LinkedIn', action: () => openExternal(CV.linkedin) },
          '-',
          ...PROJECTS.filter((p) => p.url).map((p) => ({ label: p.name, action: () => openExternal(p.url) })),
        ];
        WM.menubar(body, [
          { label: 'Dosya', items: [{ label: 'Kapat', action: () => w.close() }] },
          { label: 'Düzen', items: [{ label: 'Tümünü Seç', disabled: true }] },
          { label: 'Görünüm', items: [{ label: 'Yenile', key: 'F5', action: () => load() }] },
          { label: 'Sık Kullanılanlar', items: favorites },
          { label: 'Araçlar', items: [{ label: 'Internet Seçenekleri...', disabled: true }] },
          { label: 'Yardım', items: [{ label: 'Internet Explorer Hakkında', action: () => WM.dialog({ title: 'Internet Explorer Hakkında', icon: 'info', message: 'Microsoft Internet Explorer 6\nSürüm: 6.0.2900.cv\n\nBu sayfadaki tüm bağlantılar yeni sekmede açılır.' }) }] },
        ]);
        body.insertAdjacentHTML('beforeend', `
          <div class="ex-toolbar">
            <button class="ex-tbtn" type="button" disabled><img src="${ICONS.back}" alt=""><span>Geri</span></button>
            <button class="ex-tbtn" type="button" disabled><img src="${ICONS.forward}" alt=""></button>
            <button class="ex-tbtn ie-stop" type="button" title="Durdur"><img src="${ICONS.stop}" alt=""></button>
            <button class="ex-tbtn ie-refresh" type="button" title="Yenile"><img src="${ICONS.refresh}" alt=""></button>
            <button class="ex-tbtn ie-home-btn" type="button" title="Giriş"><img src="${ICONS.home}" alt=""></button>
            <div class="ex-tsep"></div>
            <button class="ex-tbtn ie-fav" type="button"><img src="${ICONS.favorites}" alt=""><span>Sık Kullanılanlar</span></button>
          </div>
          <div class="ex-address">
            <label>Adres</label>
            <div class="ex-path"><img src="${ICONS.ie}" alt=""><input type="text" spellcheck="false" aria-label="Adres" value="http://www.efehamdioglu.com/"></div>
            <button class="ex-go" type="button"><img src="${ICONS.arrowGreen}" alt="">Git</button>
          </div>
          <div class="ie-page xp-scroll"></div>
          <div class="statusbar"><span class="ie-status">Bitti</span><span><img src="${ICONS.ie}" alt="">Internet</span></div>`);
        const page = body.querySelector('.ie-page');
        const status = body.querySelector('.ie-status');
        const input = body.querySelector('.ex-path input');
        function load() {
          status.textContent = 'Web sayfası açılıyor http://www.efehamdioglu.com/...';
          page.innerHTML = '';
          setTimeout(() => {
            page.innerHTML = ieHome();
            status.textContent = 'Bitti';
          }, 250);
        }
        const nav = () => {
          const v = input.value.trim();
          if (!v || /efehamdioglu\.com\/?$/i.test(v)) return load();
          openExternal(/^https?:/i.test(v) ? v : 'https://' + v);
          input.value = 'http://www.efehamdioglu.com/';
        };
        body.querySelector('.ex-go').addEventListener('click', nav);
        input.addEventListener('keydown', (e) => e.key === 'Enter' && nav());
        body.querySelector('.ie-refresh').addEventListener('click', load);
        body.querySelector('.ie-home-btn').addEventListener('click', load);
        body.querySelector('.ie-stop').addEventListener('click', () => (status.textContent = 'Bitti'));
        body.querySelector('.ie-fav').addEventListener('click', (e) => {
          e.stopPropagation();
          const r = e.currentTarget.getBoundingClientRect();
          WM.contextMenu(r.left, r.bottom, favorites());
        });
        page.addEventListener('mouseover', (e) => {
          const a = e.target.closest('a');
          status.textContent = a ? a.href : 'Bitti';
        });
        load();
      },
    });
  }

  // Varsayılan: IE indirme penceresi (extras.js); { direct: true } ile doğrudan açar
  function pdf(opts) {
    if (!opts?.direct && window.Extras) return Extras.download();
    openExternal(CV.pdf);
  }

  /* ---------- Mayın Tarlası ---------- */
  const MINE_IMG = svg16('<g stroke="#000" stroke-width="1.4"><path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2"/></g><circle cx="8" cy="8" r="4.6" fill="#000"/><rect x="5.6" y="5.6" width="2" height="2" fill="#fff"/>');
  const FLAG_IMG = svg16('<path d="M8 2v9" stroke="#000" stroke-width="1.4"/><path d="M8.6 2L3 4.8 8.6 7.4z" fill="#f00"/><path d="M5 11.5h6v1.5H4v-1.5z M6 10.5h4v1H6z" fill="#000"/>');
  const WRONG_IMG = svg16('<g stroke="#000" stroke-width="1.4"><path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2"/></g><circle cx="8" cy="8" r="4.6" fill="#000"/><path d="M2 2l12 12M14 2L2 14" stroke="#f00" stroke-width="1.6"/>');

  function minesweeper() {
    return WM.open({
      id: 'winmine',
      title: 'Mayın Tarlası',
      icon: ICONS.mine,
      resizable: false,
      render(body, w) {
        const LEVELS = { beg: [9, 9, 10], int: [16, 16, 40], exp: [30, 16, 99] };
        let level = 'beg', cols, rows, mines, cells, state, flags, opened, seconds, timer;
        WM.menubar(body, [
          {
            label: 'Oyun',
            items: () => [
              { label: 'Yeni', key: 'F2', action: reset },
              '-',
              { label: 'Başlangıç', checked: level === 'beg', action: () => { level = 'beg'; reset(); } },
              { label: 'Orta', checked: level === 'int', action: () => { level = 'int'; reset(); } },
              { label: 'Uzman', checked: level === 'exp', action: () => { level = 'exp'; reset(); } },
              '-',
              { label: 'Çıkış', action: () => w.close() },
            ],
          },
          {
            label: 'Yardım',
            items: [{ label: 'Nasıl Oynanır', action: () => WM.dialog({ title: 'Mayın Tarlası', icon: 'info', message: 'Tüm mayınsız kareleri açın.\n\n• Sol tık: kareyi aç\n• Sağ tık (telefonda basılı tutun): bayrak koy\n• Açık bir sayıya tıklamak: çevresindeki kareleri açar\n\nİpucu: CV\'mde mayın yok, orayı da açmayı unutmayın.' }) }],
          },
        ]);
        body.insertAdjacentHTML('beforeend', `
          <div class="ms">
            <div class="ms-head"><div class="ms-led ms-count">010</div><button class="ms-face" type="button" aria-label="Yeni oyun">🙂</button><div class="ms-led ms-time">000</div></div>
            <div class="ms-grid"></div>
          </div>`);
        const grid = body.querySelector('.ms-grid');
        const face = body.querySelector('.ms-face');
        const countEl = body.querySelector('.ms-count');
        const timeEl = body.querySelector('.ms-time');
        const led = (n) => (n < 0 ? '-' + String(Math.min(99, -n)).padStart(2, '0') : String(Math.min(999, n)).padStart(3, '0'));

        function reset() {
          [cols, rows, mines] = LEVELS[level];
          cells = Array.from({ length: cols * rows }, () => ({ mine: false, open: false, flag: false, n: 0 }));
          state = 'ready'; flags = 0; opened = 0; seconds = 0;
          clearInterval(timer);
          grid.style.gridTemplateColumns = `repeat(${cols}, 16px)`;
          grid.innerHTML = cells.map((_, i) => `<div class="ms-cell" data-i="${i}"></div>`).join('');
          countEl.textContent = led(mines);
          timeEl.textContent = led(0);
          face.textContent = '🙂';
        }
        const nb = (i) => {
          const x = i % cols, y = (i / cols) | 0, out = [];
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) out.push(ny * cols + nx);
          }
          return out;
        };
        const cellEl = (i) => grid.children[i];
        function place(safe) {
          const banned = new Set([safe, ...nb(safe)]);
          let n = 0;
          while (n < mines) {
            const i = (Math.random() * cells.length) | 0;
            if (cells[i].mine || banned.has(i)) continue;
            cells[i].mine = true;
            n++;
          }
          cells.forEach((c, i) => (c.n = nb(i).filter((j) => cells[j].mine).length));
        }
        function draw(i) {
          const c = cells[i], el = cellEl(i);
          if (c.open) {
            el.className = 'ms-cell open' + (c.n ? ' n' + c.n : '');
            el.innerHTML = c.mine ? `<img src="${MINE_IMG}" alt="">` : c.n || '';
          } else {
            el.className = 'ms-cell';
            el.innerHTML = c.flag ? `<img src="${FLAG_IMG}" alt="">` : '';
          }
        }
        function reveal(i) {
          const c = cells[i];
          if (c.open || c.flag) return;
          if (state === 'ready') {
            place(i);
            state = 'play';
            timer = setInterval(() => { seconds++; timeEl.textContent = led(seconds); }, 1000);
            seconds = 1; timeEl.textContent = led(1);
          }
          if (c.mine) return lose(i);
          const stack = [i];
          while (stack.length) {
            const j = stack.pop(), cj = cells[j];
            if (cj.open || cj.flag) continue;
            cj.open = true;
            opened++;
            draw(j);
            if (cj.n === 0) stack.push(...nb(j));
          }
          if (opened === cells.length - mines) win();
        }
        function chord(i) {
          const c = cells[i];
          if (!c.open || !c.n) return;
          const around = nb(i);
          if (around.filter((j) => cells[j].flag).length !== c.n) return;
          around.forEach((j) => state === 'play' && reveal(j));
        }
        function toggleFlag(i) {
          const c = cells[i];
          if (c.open || state === 'dead' || state === 'won') return;
          c.flag = !c.flag;
          flags += c.flag ? 1 : -1;
          countEl.textContent = led(mines - flags);
          draw(i);
        }
        function lose(i) {
          state = 'dead';
          clearInterval(timer);
          face.textContent = '😵';
          cells.forEach((c, j) => {
            if (c.mine && !c.flag) { c.open = true; draw(j); }
            else if (!c.mine && c.flag) cellEl(j).innerHTML = `<img src="${WRONG_IMG}" alt="">`;
          });
          cellEl(i).classList.add('boom');
        }
        function win() {
          state = 'won';
          clearInterval(timer);
          face.textContent = '😎';
          cells.forEach((c, j) => { if (c.mine && !c.flag) { c.flag = true; draw(j); } });
          countEl.textContent = led(0);
          window.Extras?.unlock('mineWin');
          setTimeout(() => WM.dialog({ title: 'Mayın Tarlası', icon: 'info', message: `Tebrikler! ${seconds} saniyede kazandınız.\n\nBu dikkatle CV'mi de okuduysanız, konuşmamız gerekiyor. :)\n${CV.email}` }), 300);
        }

        let press = null, longPressed = false, lastType = 'mouse';
        grid.addEventListener('pointerdown', (e) => {
          lastType = e.pointerType;
          const el = e.target.closest('.ms-cell');
          if (!el || state === 'dead' || state === 'won' || e.button !== 0) return;
          face.textContent = '😮';
          longPressed = false;
          if (isTouch(e)) {
            press = setTimeout(() => {
              longPressed = true;
              toggleFlag(+el.dataset.i);
              face.textContent = '🙂';
              navigator.vibrate?.(25);
            }, 380);
          }
        });
        grid.addEventListener('pointerup', (e) => {
          clearTimeout(press);
          if (state === 'ready' || state === 'play') face.textContent = '🙂';
          const el = e.target.closest('.ms-cell');
          if (!el || e.button !== 0 || longPressed || state === 'dead' || state === 'won') return;
          const i = +el.dataset.i;
          if (cells[i].open) chord(i);
          else reveal(i);
        });
        grid.addEventListener('pointerleave', () => { clearTimeout(press); if (state === 'ready' || state === 'play') face.textContent = '🙂'; });
        grid.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const el = e.target.closest('.ms-cell');
          if (el && lastType === 'mouse') toggleFlag(+el.dataset.i);
        });
        face.addEventListener('click', reset);
        w.el.addEventListener('keydown', (e) => e.key === 'F2' && (e.preventDefault(), reset()));

        // Gerçek XP hilesi: "xyzzy" + Shift+Enter → ekranın sol üst pikseli, imlecin altındaki kare mayınsa siyah, değilse beyaz olur
        let typed = '', pixel = null;
        const onKey = (e) => {
          if (!w.el.classList.contains('active') || e.target.closest?.('input, textarea')) return;
          if (e.key === 'Enter' && e.shiftKey && typed === 'xyzzy') {
            if (!pixel) {
              pixel = document.createElement('div');
              pixel.className = 'xyzzy-pixel';
              document.body.appendChild(pixel);
            }
            window.Extras?.unlock('xyzzy');
          } else if (e.key.length === 1) typed = (typed + e.key.toLowerCase()).slice(-5);
        };
        document.addEventListener('keydown', onKey);
        grid.addEventListener('pointermove', (e) => {
          if (!pixel) return;
          const el = e.target.closest('.ms-cell');
          pixel.style.background = el ? (cells[+el.dataset.i].mine ? '#000' : '#fff') : 'transparent';
        });
        grid.addEventListener('pointerleave', () => pixel && (pixel.style.background = 'transparent'));
        w.onClose = () => {
          clearInterval(timer);
          document.removeEventListener('keydown', onKey);
          pixel?.remove();
        };
        reset();
      },
    });
  }

  /* ---------- Paint ---------- */
  const TOOL_ICONS = {
    pencil: svg16('<path d="M2 14l1-4 8-8 3 3-8 8z" fill="#f7d04a" stroke="#000" stroke-width=".8"/><path d="M2 14l1-4 3 3z" fill="#eec39a" stroke="#000" stroke-width=".8"/>'),
    brush: svg16('<path d="M14 1l1 1-6 7-2-2z" fill="#a0522d" stroke="#000" stroke-width=".7"/><path d="M7 7l2 2c-.5 3-3 5-7.5 5.5C2 10 4 7.5 7 7z" fill="#333"/>'),
    eraser: svg16('<path d="M2 10l6-6 6 6-4 4H6z" fill="#f5a3b8" stroke="#000" stroke-width=".8"/><path d="M2 10l4 4 3-3-4-4z" fill="#fff" stroke="#000" stroke-width=".8"/>'),
    fill: svg16('<path d="M2.5 7.5l5-5 6 6-5 5z" fill="#ddd" stroke="#000" stroke-width=".8"/><path d="M2.5 7.5h11" stroke="#000" stroke-width=".6"/><path d="M13.5 9.5c1 1.8 1.8 3 1.3 4.2-.5 1-2 .8-2-.4 0-1 .3-2 .7-3.8z" fill="#1f5fe0"/>'),
    spray: svg16('<rect x="5" y="6" width="6" height="9" rx="1" fill="#bbb" stroke="#000" stroke-width=".8"/><rect x="7" y="3.5" width="2" height="2.5" fill="#555"/><g fill="#000"><circle cx="11.5" cy="2.5" r=".6"/><circle cx="13.5" cy="3.5" r=".6"/><circle cx="12.5" cy="1" r=".6"/><circle cx="14.5" cy="1.8" r=".6"/></g>'),
    picker: svg16('<path d="M2.5 13.5l7-7 2 2-7 7h-2z" fill="#fff" stroke="#000" stroke-width=".8"/><path d="M9.5 4.5l2.5-2.5 2 2-2.5 2.5z" fill="#000"/>'),
    line: svg16('<path d="M2 14L14 2" stroke="#000" stroke-width="1.5"/>'),
    rect: svg16('<rect x="2.5" y="4.5" width="11" height="8" fill="none" stroke="#000" stroke-width="1.2"/>'),
  };
  const TOOL_NAMES = { pencil: 'Kurşun Kalem', brush: 'Fırça', eraser: 'Silgi', fill: 'Renkle Doldur', spray: 'Püskürtme', picker: 'Renk Seç', line: 'Çizgi', rect: 'Dikdörtgen' };
  const PALETTE = ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'];

  function paint() {
    return WM.open({
      id: 'paint',
      title: 'adsız - Paint',
      icon: ICONS.paint,
      width: 760,
      height: 560,
      render(body, w) {
        let tool = 'pencil', size = 2, fg = '#000000', bg = '#ffffff';
        const undo = [];
        WM.menubar(body, [
          { label: 'Dosya', items: [{ label: 'Yeni', key: 'Ctrl+N', action: () => clear() }, { label: 'Farklı Kaydet...', action: () => save() }, '-', { label: 'Çıkış', action: () => w.close() }] },
          { label: 'Düzen', items: () => [{ label: 'Geri Al', key: 'Ctrl+Z', disabled: !undo.length, action: () => doUndo() }] },
          { label: 'Görünüm', items: [{ label: 'Araç Kutusu', checked: true }, { label: 'Renk Kutusu', checked: true }] },
          { label: 'Resim', items: [{ label: 'Resmi Temizle', key: 'Ctrl+Shift+N', action: () => clear() }] },
          { label: 'Renkler', items: [{ label: 'Renkleri Düzenle...', disabled: true }] },
          { label: 'Yardım', items: [{ label: 'Paint Hakkında', action: () => WM.dialog({ title: 'Paint Hakkında', icon: 'info', message: 'Paint\nSürüm 5.1\n\nBir şey çizip "Farklı Kaydet" ile indirebilirsiniz.' }) }] },
        ]);
        body.insertAdjacentHTML('beforeend', `
          <div class="pt-main">
            <div class="pt-tools">
              ${Object.keys(TOOL_ICONS).map((t) => `<button class="pt-tool${t === tool ? ' active' : ''}" type="button" data-tool="${t}" title="${TOOL_NAMES[t]}"><img src="${TOOL_ICONS[t]}" alt=""></button>`).join('')}
              <div class="pt-sizes">${[1, 2, 4, 7].map((s) => `<button type="button" data-size="${s}" class="${s === size ? 'active' : ''}"><i style="height:${s}px"></i></button>`).join('')}</div>
            </div>
            <div class="pt-canvas-wrap xp-scroll"><canvas></canvas></div>
          </div>
          <div class="pt-palette">
            <div class="pt-current"><i class="fg"></i><i class="bg"></i></div>
            <div class="pt-colors">${PALETTE.map((c) => `<button type="button" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>
          </div>
          <div class="statusbar"><span class="pt-status">Yardım için, Yardım menüsünde Yardım Konuları'nı tıklatın.</span><span class="pt-pos" style="width:90px"></span></div>`);
        const canvas = body.querySelector('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const wrapEl = body.querySelector('.pt-canvas-wrap');
        const posEl = body.querySelector('.pt-pos');
        const fgEl = body.querySelector('.pt-current .fg'), bgEl = body.querySelector('.pt-current .bg');
        const updateColors = () => { fgEl.style.background = fg; bgEl.style.background = bg; };
        updateColors();

        canvas.width = WM.isMobile() ? Math.max(260, window.innerWidth - 90) : 640;
        canvas.height = WM.isMobile() ? Math.max(260, window.innerHeight - 250) : 400;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const snapshot = () => ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pushUndo = () => { undo.push(snapshot()); if (undo.length > 15) undo.shift(); };
        const doUndo = () => { const s = undo.pop(); if (s) ctx.putImageData(s, 0, 0); };
        const clear = () => { pushUndo(); ctx.fillStyle = bg; ctx.fillRect(0, 0, canvas.width, canvas.height); };
        const save = () => canvas.toBlob((b) => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(b);
          a.download = 'adsız.png';
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        });

        body.querySelector('.pt-tools').addEventListener('click', (e) => {
          const t = e.target.closest('[data-tool]');
          const s = e.target.closest('[data-size]');
          if (t) {
            tool = t.dataset.tool;
            body.querySelectorAll('.pt-tool').forEach((b) => b.classList.toggle('active', b === t));
          }
          if (s) {
            size = +s.dataset.size;
            body.querySelectorAll('.pt-sizes button').forEach((b) => b.classList.toggle('active', b === s));
          }
        });
        const colors = body.querySelector('.pt-colors');
        colors.addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) { fg = b.dataset.c; updateColors(); } });
        colors.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); const b = e.target.closest('[data-c]'); if (b) { bg = b.dataset.c; updateColors(); } });

        const pos = (e) => {
          const r = canvas.getBoundingClientRect();
          return [Math.floor(e.clientX - r.left), Math.floor(e.clientY - r.top)];
        };
        const hexToRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

        function floodFill(x, y, color) {
          const img = snapshot(), d = img.data, W = canvas.width, H = canvas.height;
          const idx = (x + y * W) * 4;
          const t = [d[idx], d[idx + 1], d[idx + 2]];
          const c = hexToRgb(color);
          if (t[0] === c[0] && t[1] === c[1] && t[2] === c[2]) return;
          const match = (i) => Math.abs(d[i] - t[0]) + Math.abs(d[i + 1] - t[1]) + Math.abs(d[i + 2] - t[2]) < 48;
          const stack = [[x, y]];
          while (stack.length) {
            let [cx, cy] = stack.pop();
            while (cy >= 0 && match((cx + cy * W) * 4)) cy--;
            cy++;
            let left = false, right = false;
            while (cy < H && match((cx + cy * W) * 4)) {
              const i = (cx + cy * W) * 4;
              d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255;
              if (cx > 0) { if (match(i - 4)) { if (!left) { stack.push([cx - 1, cy]); left = true; } } else left = false; }
              if (cx < W - 1) { if (match(i + 4)) { if (!right) { stack.push([cx + 1, cy]); right = true; } } else right = false; }
              cy++;
            }
          }
          ctx.putImageData(img, 0, 0);
        }

        let drawing = false, last = null, start = null, base = null, color = fg, sprayTimer = null;
        const stroke = (a, b, width, col, cap = 'round') => {
          ctx.strokeStyle = col;
          ctx.lineWidth = width;
          ctx.lineCap = cap;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(a[0] + 0.5, a[1] + 0.5);
          ctx.lineTo(b[0] + 0.5, b[1] + 0.5);
          ctx.stroke();
        };
        const spray = (p) => {
          ctx.fillStyle = color;
          const r = size * 4 + 4;
          for (let k = 0; k < 14; k++) {
            const a = Math.random() * Math.PI * 2, d = Math.random() * r;
            ctx.fillRect(p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d, 1, 1);
          }
        };
        const apply = (p) => {
          if (tool === 'pencil') stroke(last, p, 1, color, 'square');
          else if (tool === 'brush') stroke(last, p, size * 2, color);
          else if (tool === 'eraser') stroke(last, p, size * 4 + 4, bg, 'square');
          else if (tool === 'spray') spray(p);
          else if (tool === 'line' || tool === 'rect') {
            ctx.putImageData(base, 0, 0);
            if (tool === 'line') stroke(start, p, size, color);
            else {
              ctx.strokeStyle = color;
              ctx.lineWidth = size;
              ctx.strokeRect(Math.min(start[0], p[0]) + 0.5, Math.min(start[1], p[1]) + 0.5, Math.abs(p[0] - start[0]), Math.abs(p[1] - start[1]));
            }
          }
          last = p;
        };

        canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });
        canvas.addEventListener('pointerdown', (e) => {
          if (e.button !== 0 && e.button !== 2) return;
          e.preventDefault();
          const p = pos(e);
          color = e.button === 2 ? bg : fg;
          if (tool === 'picker') {
            const d = ctx.getImageData(p[0], p[1], 1, 1).data;
            const hex = '#' + [d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('');
            if (e.button === 2) bg = hex; else fg = hex;
            updateColors();
            return;
          }
          pushUndo();
          if (tool === 'fill') { floodFill(p[0], p[1], color); return; }
          drawing = true;
          canvas.setPointerCapture(e.pointerId);
          last = start = p;
          base = snapshot();
          apply(p);
          if (tool === 'spray') sprayTimer = setInterval(() => spray(last), 30);
        });
        canvas.addEventListener('pointermove', (e) => {
          const p = pos(e);
          posEl.textContent = `${p[0]},${p[1]}`;
          if (drawing) apply(p);
        });
        const end = () => { drawing = false; clearInterval(sprayTimer); };
        canvas.addEventListener('pointerup', end);
        canvas.addEventListener('pointercancel', end);
        canvas.addEventListener('pointerleave', () => (posEl.textContent = ''));
        w.el.addEventListener('keydown', (e) => { if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); doUndo(); } });
        wrapEl.tabIndex = 0;
      },
    });
  }

  /* ---------- Komut İstemi ---------- */
  const norm = (s) => s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/\.txt$/, '').replace(/["\s_]+/g, ' ').trim();
  const findFile = (q) => CV_FILES.find((f) => norm(f.name) === norm(q)) || CV_FILES.find((f) => norm(f.name).startsWith(norm(q)));

  const PROGRAMS = {
    notepad: () => notepad(), 'notepad.exe': () => notepad(),
    mspaint: () => paint(), 'mspaint.exe': () => paint(), paint: () => paint(),
    winmine: () => minesweeper(), 'winmine.exe': () => minesweeper(), minesweeper: () => minesweeper(), 'mayın tarlası': () => minesweeper(),
    cmd: () => cmd(), 'cmd.exe': () => cmd(), command: () => cmd(),
    iexplore: () => ie(), 'iexplore.exe': () => ie(), ie: () => ie(),
    // explorer.exe Görev Yöneticisi'nden sonlandırıldıysa yeniden başlatır
    explorer: () => (window.Extras?.explorerDead() ? Extras.restoreExplorer() : explorer('Belgelerim')),
    'explorer.exe': () => PROGRAMS.explorer(),
    taskmgr: () => Extras.taskmgr(), 'taskmgr.exe': () => Extras.taskmgr(),
    msn: () => Extras.msnMain(), msnmsgr: () => Extras.msnMain(), 'msnmsgr.exe': () => Extras.msnMain(), messenger: () => Extras.msnMain(),
    control: () => sysprops(), 'sysdm.cpl': () => sysprops(), winver: () => sysprops(),
    code: () => vscode(), 'code.exe': () => vscode(), vscode: () => vscode(), 'visual studio code': () => vscode(),
    cv: () => pdf(),
  };
  function launch(input) {
    const v = input.trim();
    const key = v.toLocaleLowerCase('tr');
    if (!v) return false;
    if (PROGRAMS[key]) { PROGRAMS[key](); return true; }
    if (/^(https?:\/\/|www\.)/i.test(v)) { openExternal(/^https?:/i.test(v) ? v : 'https://' + v); return true; }
    const f = findFile(v);
    if (f) { notepad(f); return true; }
    if (FS[v]) { explorer(v); return true; }
    const folder = Object.keys(FS).find((k) => k.toLocaleLowerCase('tr') === key);
    if (folder) { explorer(folder); return true; }
    return false;
  }

  function cmd() {
    return WM.open({
      title: 'C:\\WINDOWS\\system32\\cmd.exe',
      icon: ICONS.cmd,
      width: 680,
      height: 420,
      render(body, w) {
        const CWD = 'C:\\Documents and Settings\\Efe\\Masaüstü';
        body.innerHTML = `<div class="cmd xp-scroll"><div class="cmd-out"></div><div class="cmd-line"><span class="cmd-prompt"></span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Komut"></div></div>`;
        const root = body.querySelector('.cmd'), out = body.querySelector('.cmd-out'), input = body.querySelector('input');
        const promptEl = body.querySelector('.cmd-prompt');
        const prompt = CWD + '>';
        promptEl.textContent = prompt;
        const hist = [];
        let hi = 0;
        const print = (s = '', html = false) => {
          const d = document.createElement('div');
          if (html) d.innerHTML = s; else d.textContent = s;
          out.appendChild(d);
        };
        const COLORS = ['#000', '#000080', '#008000', '#008080', '#800000', '#800080', '#808000', '#c0c0c0', '#808080', '#0000ff', '#00ff00', '#00ffff', '#ff0000', '#ff00ff', '#ffff00', '#fff'];
        print('Microsoft Windows XP [Sürüm 5.1.2600]');
        print('(C) Telif Hakkı 1985-2001 Microsoft Corp.');
        print('');
        print('İpucu: Komutları görmek için "help" yazın.');
        print('');

        const commands = {
          help() {
            print(`Kullanılabilir komutlar:

  HELP          Bu listeyi gösterir
  DIR           Masaüstündeki dosyaları listeler
  TYPE dosya    Bir metin dosyasını gösterir  (ör. type hakkimda)
  WHOAMI        Kim olduğumu söyler
  CONTACT       İletişim bilgileri
  PROJECTS      Projeleri listeler
  SKILLS        Teknik yetkinlikler
  CV            CV'yi PDF olarak açar
  START prog    Program başlatır (notepad, mspaint, winmine, iexplore, explorer, code)
  COLOR xy      Renkleri değiştirir (ör. color 0a)
  CLS           Ekranı temizler
  VER, DATE, TIME, ECHO, EXIT`);
          },
          dir() {
            const total = CV_FILES.reduce((s, f) => s + byteSize(f.text), 0);
            const lines = CV_FILES.map((f) => `${f.date.slice(0, 10)}  ${f.date.slice(11)}    ${byteSize(f.text).toLocaleString('tr-TR').padStart(14)} ${f.name}`);
            print(` C sürücüsündeki birimin etiketi yok.
 Birim Seri Numarası: 2026-0923

 ${CWD} dizini

23.09.2026  09:00    <DIR>          .
23.09.2026  09:00    <DIR>          ..
${lines.join('\n')}
23.09.2026  09:10           269.854 Osman_Efe_Hamdioglu_CV.pdf
              ${CV_FILES.length + 1} Dosya     ${(total + 269854).toLocaleString('tr-TR')} bayt
               2 Dizin  13.370.000.000 bayt boş`);
          },
          type(arg) {
            if (!arg) return print('Komut sözdizimi yanlış.');
            const f = findFile(arg);
            if (!f) return print('Sistem belirtilen dosyayı bulamıyor.');
            print(linkify(f.text), true);
          },
          whoami() { print(`efe-pc\\efe\n\n${CV.name} — ${CV.title}\nAnkara, Türkiye`); },
          contact() { print(linkify(`E-posta  : ${CV.email}\nTelefon  : ${CV.phone}\nWeb      : ${CV.website}\nLinkedIn : ${CV.linkedin}\nGitHub   : ${CV.github}`), true); },
          projects() { print(linkify(PROJECTS.map((p, i) => `[${i + 1}] ${p.name}${p.url ? ' — ' + p.url : ''}\n    ${p.desc}\n    ${p.tech}`).join('\n\n')), true); },
          skills() { print(findFile('yetenekler').text); },
          cv() { print('CV açılıyor...'); pdf(); },
          start(arg) {
            if (!arg) return cmd();
            if (!launch(arg)) print(`Windows '${arg}' öğesini bulamıyor.`);
          },
          color(arg) {
            const m = /^([0-9a-f])?([0-9a-f])$/i.exec(arg || '');
            if (!arg) { root.style.background = ''; root.style.color = ''; return; }
            if (!m) return print('Geçersiz renk. Örnek: color 0a');
            if (m[1] && m[1].toLowerCase() === m[2].toLowerCase()) return print('Ön plan ve arka plan aynı olamaz.');
            if (m[1]) root.style.background = COLORS[parseInt(m[1], 16)];
            root.style.color = COLORS[parseInt(m[2], 16)];
          },
          cls() { out.innerHTML = ''; },
          ver() { print('\nMicrosoft Windows XP [Sürüm 5.1.2600]\nCV Edition — ' + CV.name + '\n'); },
          date() { print('Geçerli tarih: ' + new Date().toLocaleDateString('tr-TR', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })); },
          time() { print('Geçerli saat: ' + new Date().toLocaleTimeString('tr-TR')); },
          echo(arg) { print(arg || 'ECHO açık.'); },
          exit() { w.close(); },
          cd(arg) { print(arg ? 'Sistem belirtilen yolu bulamıyor.' : CWD); },
          sudo() { print("'sudo' iç ya da dış komut... bir dakika, burası Windows XP. :)"); },
          shutdown(arg) {
            if (/^[-/]a$/i.test(arg)) {
              return print(window.Extras?.abortShutdown() ? 'Sistem kapatma işlemi iptal edildi.' : 'Sistem kapatma işlemi devam etmediğinden iptal edilemedi.(1116)');
            }
            print('Sistem kapatılıyor...');
            setTimeout(() => window.XP?.shutdownDialog(), 400);
          },
          format(arg) {
            const m = /^([a-z]):?$/i.exec(arg || '');
            if (!m) return print('Gerekli parametre eksik -\nKullanım: FORMAT sürücü:');
            const d = m[1].toUpperCase();
            if (d !== 'C') return print(`${d}: sürücüsü hazır değil.`);
            print('Dosya sisteminin türü NTFS.\n\nUYARI, SABİT DİSK SÜRÜCÜSÜ C: ÜZERİNDEKİ TÜM VERİLER KAYBOLACAK!\nBiçimlendirmeye devam edilsin mi (E/H)?');
            pending = (ans) => {
              if (!/^e(vet)?$/i.test(ans)) return;
              input.disabled = true;
              const line = document.createElement('div');
              out.appendChild(line);
              let p = 0;
              const t = setInterval(() => {
                p += 3 + Math.floor(Math.random() * 5);
                line.textContent = `Biçimlendiriliyor... %${Math.min(p, 100)} tamamlandı.`;
                root.scrollTop = root.scrollHeight;
                if (p >= 64) { clearInterval(t); setTimeout(() => window.Extras?.bsod('hire'), 250); }
              }, 90);
            };
          },
        };
        let pending = null;
        commands['yardım'] = commands.help;
        commands['iletişim'] = commands.contact;
        commands.ls = commands.dir;
        commands.cat = commands.type;
        commands.clear = commands.cls;

        const run = (line) => {
          print(prompt + line);
          const trimmed = line.trim();
          if (pending) {
            const answer = pending;
            pending = null;
            answer(trimmed);
            return print('');
          }
          if (!trimmed) return;
          const sp = trimmed.search(/\s/);
          const name = (sp < 0 ? trimmed : trimmed.slice(0, sp)).toLocaleLowerCase('tr');
          const arg = sp < 0 ? '' : trimmed.slice(sp + 1).trim();
          if (commands[name]) commands[name](arg);
          else if (PROGRAMS[name]) PROGRAMS[name]();
          else if (findFile(trimmed)) commands.type(trimmed);
          else print(`'${sp < 0 ? trimmed : trimmed.slice(0, sp)}' iç ya da dış komut, çalıştırılabilir\nprogram ya da toplu iş dosyası olarak tanınmıyor.`);
          print('');
        };
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const v = input.value;
            input.value = '';
            if (v.trim()) hist.push(v);
            hi = hist.length;
            run(v);
            root.scrollTop = root.scrollHeight;
          } else if (e.key === 'ArrowUp') {
            if (hi > 0) input.value = hist[--hi];
            e.preventDefault();
          } else if (e.key === 'ArrowDown') {
            input.value = hi < hist.length - 1 ? hist[++hi] : ((hi = hist.length), '');
            e.preventDefault();
          }
        });
        root.addEventListener('click', () => { if (!String(getSelection())) input.focus(); });
        w.opts.onFocus = () => setTimeout(() => input.focus({ preventScroll: true }), 0);
        setTimeout(() => input.focus(), 50);
      },
    });
  }

  /* ---------- Çalıştır ---------- */
  function run() {
    return WM.open({
      id: 'run',
      title: 'Çalıştır',
      resizable: false,
      minimizable: false,
      taskbar: false,
      center: true,
      width: 370,
      help: () => WM.dialog({ title: 'Çalıştır', icon: 'info', message: 'Deneyebilecekleriniz:\nnotepad, mspaint, winmine, cmd, iexplore, explorer, control, cv\n\nveya bir dosya adı: hakkımda, projeler, iletişim...' }),
      render(body, w) {
        body.innerHTML = `
          <div class="dlg">
            <div class="dlg-row"><img src="${ICONS.run}" alt=""><div class="dlg-msg">Açmak istediğiniz programın, klasörün, belgenin veya Internet kaynağının adını yazın; Windows sizin için açacaktır.</div></div>
            <div class="run-row"><label>Aç:</label><input class="xp-input" type="text" spellcheck="false" autocomplete="off" value="notepad"></div>
            <div class="dlg-btns" style="justify-content:flex-end"><button class="xp-btn default" type="button">Tamam</button><button class="xp-btn" type="button">İptal</button><button class="xp-btn" type="button" disabled>Gözat...</button></div>
          </div>`;
        const input = body.querySelector('input');
        const [ok, cancel] = body.querySelectorAll('.xp-btn');
        const go = () => {
          const v = input.value;
          if (!v.trim()) return;
          w.close();
          if (!launch(v)) WM.dialog({ title: v, icon: 'error', message: `Windows '${v}' öğesini bulamıyor. Adın doğru yazıldığından emin olun ve yeniden deneyin. Bir öğe aramak için Başlat düğmesini, sonra da Ara'yı tıklatın.` });
        };
        ok.addEventListener('click', go);
        cancel.addEventListener('click', () => w.close());
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); if (e.key === 'Escape') w.close(); });
        setTimeout(() => { input.focus(); input.select(); }, 50);
      },
    });
  }

  /* ---------- Sistem Özellikleri ---------- */
  function sysprops() {
    return WM.open({
      id: 'sysprops',
      title: 'Sistem Özellikleri',
      icon: ICONS.computer,
      resizable: false,
      minimizable: false,
      center: true,
      width: 470,
      height: 470,
      help: () => notepad(CV_FILES[0]),
      render(body, w) {
        const skills = CV_FILES.find((f) => f.name === 'Yetenekler.txt').text
          .split('\n[').slice(1)
          .map((block) => {
            const [head, ...rest] = block.split('\n');
            return { head: head.replace(']', ''), items: rest.join(' ').split(',').map((s) => s.trim()).filter(Boolean) };
          });
        const tabs = {
          'Genel': `
            <div class="sp-general">
              <div class="sp-logo"><img src="${ICONS.flag}" alt=""><b>Windows<sup>xp</sup></b></div>
              <dl>
                <dt>Sistem:</dt>
                <dd>Microsoft Windows XP<br>Professional<br>Sürüm 2002 · CV Edition</dd>
                <dt>Kayıtlı kullanıcı:</dt>
                <dd>${esc(CV.name)}<br>Ostim Teknik Üniversitesi</dd>
                <dt>Bilgisayar:</dt>
                <dd>${esc(CV.title)}<br>C# · TypeScript · Python · Java<br>6 staj · 8+ proje<br>Ankara, Türkiye</dd>
              </dl>
            </div>`,
          'Bilgisayar Adı': `
            <p>Windows ağda bilgisayarınızı tanımlamak için aşağıdaki bilgileri kullanır.</p>
            <table style="border-spacing:0 8px">
              <tr><td style="padding-right:16px">Bilgisayar açıklaması:</td><td><input class="xp-input" value="Efe'nin CV'si" readonly style="width:200px"></td></tr>
              <tr><td>Tam bilgisayar adı:</td><td>efe-pc</td></tr>
              <tr><td>Çalışma grubu:</td><td>BZB-ILETISIM</td></tr>
              <tr><td>Web:</td><td><a href="${CV.website}" target="_blank" rel="noopener">efehamdioglu.com</a></td></tr>
            </table>`,
          'Donanım': `
            <p><b>Aygıt Yöneticisi</b> — bu bilgisayarda yüklü "donanımlar":</p>
            <ul class="sp-tree">
              <li><details open><summary>efe-pc</summary>
                <ul>${skills.map((s) => `<li><details><summary>${esc(s.head)}</summary><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></details></li>`).join('')}</ul>
              </details></li>
            </ul>`,
        };
        body.innerHTML = `
          <div class="sysprops">
            <div class="tabs">${Object.keys(tabs).map((t, i) => `<div class="tab${i === 0 ? ' active' : ''}" data-t="${t}">${t}</div>`).join('')}</div>
            <div class="tab-panel xp-scroll"></div>
            <div class="dlg-btns"><button class="xp-btn default" type="button">Tamam</button><button class="xp-btn" type="button">İptal</button><button class="xp-btn" type="button" disabled>Uygula</button></div>
          </div>`;
        const panelEl = body.querySelector('.tab-panel');
        const show = (t) => {
          panelEl.innerHTML = tabs[t];
          body.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x.dataset.t === t));
        };
        body.querySelector('.tabs').addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) show(t.dataset.t); });
        body.querySelectorAll('.xp-btn').forEach((b) => b.addEventListener('click', () => w.close()));
        show('Genel');
      },
    });
  }

  /* ---------- Visual Studio Code (kendi kendine yazan editör) ---------- */
  const VSC_KW = {
    ts: /^(import|from|export|const|let|type|interface|function|return|new|as|async|await|true|false|null|if|else)$/,
    cs: /^(var|new|async|await|return|public|class|void|string|int|true|false|null|using)$/,
    json: /^(true|false|null)$/,
  };
  const VSC_CTL = /^(return|if|else|await|import|from|export|using)$/;

  function vscHighlight(line, lang) {
    const re = /(\/\/.*$)|('(?:[^'\\]|\\.)*'?|"(?:[^"\\]|\\.)*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([^\w\s'"]+|\s+)/g;
    let out = '', m;
    while ((m = re.exec(line))) {
      const [t, com, str, num, word] = m;
      const rest = line.slice(re.lastIndex);
      let cls = '';
      if (com) cls = 'vt-com';
      else if (str) cls = lang === 'json' && /^\s*:/.test(rest) ? 'vt-prop' : 'vt-str';
      else if (num) cls = 'vt-num';
      else if (word) {
        if (VSC_KW[lang]?.test(word)) cls = VSC_CTL.test(word) ? 'vt-ctl' : 'vt-kw';
        else if (/^\s*[(<]/.test(rest) && !/^[A-Z]\w*$/.test(word)) cls = 'vt-fn';
        else if (/^[A-Z]/.test(word)) cls = 'vt-type';
        else cls = 'vt-var';
      }
      out += cls ? `<span class="${cls}">${esc(t)}</span>` : esc(t);
    }
    return out;
  }

  const vscFiles = () => [
    {
      name: 'efe.ts', dir: 'src', lang: 'ts', label: 'TypeScript', speed: 20, auto: true,
      code: `// efe.ts — kendimi koda dökmeye çalıştım
import { Developer, Coffee } from './types';

type Stack = 'frontend' | 'backend' | 'fullstack';

export const efe: Developer = {
  name: '${CV.name}',
  title: '${CV.title}',
  location: 'Ankara, TR',
  stack: 'fullstack' as Stack,
  languages: ['C#', 'TypeScript', 'Python', 'Java', 'SQL'],
  frameworks: ['ASP.NET Core', 'Next.js', 'React', 'Spring Boot'],
  openToWork: true,
};

export async function solve(problem: string) {
  const coffee = new Coffee({ sugar: 0 });
  const plan = await efe.think(problem, coffee);
  const code = await efe.build(plan);
  return efe.ship(code); // bugs: 0 (umarım)
}
`,
    },
    {
      name: 'Program.cs', dir: 'src', lang: 'cs', label: 'C#', speed: 17, auto: true,
      code: `// TTT World ERP — ASP.NET Core 8 Web API
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ErpContext>();
builder.Services.AddScoped<IImportService, ImportService>();

var app = builder.Build();

app.MapGet("/api/imports", async (IImportService svc) =>
    await svc.GetActiveAsync());

app.MapPost("/api/tasks", async (TaskDto dto, ErpContext db) =>
{
    var task = dto.ToEntity();
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.Run();
`,
    },
    {
      name: 'projects.json', dir: 'src', lang: 'json', label: 'JSON', speed: 5, auto: true,
      code: '[\n' + PROJECTS.map((p) => [
        '  {',
        `    "name": ${JSON.stringify(p.name)},`,
        ...(p.url ? [`    "url": ${JSON.stringify(p.url)},`] : []),
        `    "stack": [${p.tech.split(' · ').map((t) => JSON.stringify(t)).join(', ')}]`,
        '  }',
      ].join('\n')).join(',\n') + '\n]\n',
    },
    {
      name: 'package.json', dir: '', lang: 'json', label: 'JSON',
      code: JSON.stringify({ name: 'efe-cv', version: '1.0.0', private: true, scripts: { dev: 'next dev', build: 'next build', hire: 'node scripts/hire.js' }, author: CV.name }, null, 2) + '\n',
    },
    {
      name: 'README.md', dir: '', lang: 'md', label: 'Markdown',
      code: `# efe-cv\n\n${CV.name} — ${CV.title}\n\n- Web: ${CV.website}\n- GitHub: ${CV.github}\n- E-posta: ${CV.email}\n\nÇalıştırmak için: npm run hire\n`,
    },
  ];

  const VSC_BADGE = { ts: ['TS', '#3178c6'], cs: ['C#', '#a179dc'], json: ['{}', '#cbcb41'], md: ['M↓', '#519aba'] };
  const vscBadge = (lang) => `<span class="vsc-badge" style="color:${VSC_BADGE[lang][1]}">${VSC_BADGE[lang][0]}</span>`;
  const VSC_ACT = [
    '<path d="M14 3H6v18h13V8z M14 3v5h5" />',
    '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l6 6"/>',
    '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="8" r="2"/><path d="M6 7v10M18 10c0 4-6 3-11 8"/>',
    '<path d="M8 5l12 7-12 7z"/>',
    '<rect x="3" y="11" width="7" height="7"/><rect x="11" y="11" width="7" height="7"/><rect x="3" y="4" width="7" height="7"/><rect x="13" y="2" width="7" height="7" transform="rotate(12 16 6)"/>',
  ];

  function vscode() {
    return WM.open({
      id: 'vscode',
      title: 'efe.ts - efe-cv - Visual Studio Code',
      icon: ICONS.vscode,
      width: 900,
      height: 560,
      minWidth: 360,
      minHeight: 240,
      render(body, w) {
        body.classList.add('vsc-host');
        body.innerHTML = `
          <div class="vsc">
            <div class="vsc-menu"><img src="${ICONS.vscode}" alt="">${['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((m) => `<span>${m}</span>`).join('')}</div>
            <div class="vsc-main">
              <div class="vsc-act">${VSC_ACT.map((p, i) => `<span class="${i === 0 ? 'on' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${p}</svg></span>`).join('')}</div>
              <div class="vsc-side">
                <div class="vsc-side-h">EXPLORER</div>
                <div class="vsc-tree"></div>
              </div>
              <div class="vsc-editor">
                <div class="vsc-tabs"></div>
                <div class="vsc-crumbs"></div>
                <div class="vsc-code"></div>
                <div class="vsc-term" hidden>
                  <div class="vsc-term-h"><span>PROBLEMS</span><span>OUTPUT</span><span class="on">TERMINAL</span></div>
                  <div class="vsc-term-b"></div>
                </div>
              </div>
            </div>
            <div class="vsc-status">
              <span>⎇ main*</span><span>⊗ 0 ⚠ 0</span><span class="grow"></span>
              <span class="vsc-pos">Ln 1, Col 1</span><span>Spaces: 2</span><span>UTF-8</span><span class="vsc-lang"></span>
            </div>
          </div>`;
        const $ = (s) => body.querySelector(s);
        const tree = $('.vsc-tree'), tabs = $('.vsc-tabs'), crumbs = $('.vsc-crumbs'), codeEl = $('.vsc-code');
        const pos = $('.vsc-pos'), langEl = $('.vsc-lang'), term = $('.vsc-term'), termB = $('.vsc-term-b');
        const files = vscFiles();
        const state = files.map((f) => ({ typed: f.auto ? 0 : f.code.length, typo: '', open: false }));
        let active = -1, rows = [], timer = null, idleTimer = null, termDone = false;
        const alive = () => w.el.isConnected;

        tree.innerHTML = `
          <div class="vsc-ti root">⌄ EFE-CV</div>
          <div class="vsc-ti dir">› .vscode</div>
          <div class="vsc-ti dir">⌄ src</div>`;
        const addTreeItem = (f, i) => {
          const d = document.createElement('div');
          d.className = 'vsc-ti file' + (f.dir ? ' nested' : '');
          d.innerHTML = `${vscBadge(f.lang)}<span></span>`;
          d.querySelector('span:last-child').textContent = f.name;
          d.addEventListener('click', () => openFile(i));
          f.treeEl = d;
          tree.appendChild(d);
        };
        files.forEach((f, i) => f.dir && addTreeItem(f, i));
        files.forEach((f, i) => !f.dir && addTreeItem(f, i));

        function renderTabs() {
          tabs.innerHTML = '';
          files.forEach((f, i) => {
            if (!state[i].open) return;
            const t = document.createElement('div');
            t.className = 'vsc-tab' + (i === active ? ' on' : '');
            const dirty = state[i].typed < f.code.length;
            t.innerHTML = `${vscBadge(f.lang)}<span></span><b>${dirty ? '●' : '×'}</b>`;
            t.querySelector('span:last-of-type').textContent = f.name;
            t.addEventListener('click', () => openFile(i));
            tabs.appendChild(t);
          });
        }

        function text(i) {
          return files[i].code.slice(0, state[i].typed) + state[i].typo;
        }

        function paint(full) {
          const f = files[active];
          const lines = text(active).split('\n');
          if (full) { codeEl.innerHTML = ''; rows = []; }
          while (rows.length < lines.length) {
            const r = document.createElement('div');
            r.className = 'vl';
            r.innerHTML = `<span class="ln">${rows.length + 1}</span><span class="lc"></span>`;
            codeEl.appendChild(r);
            rows.push(r);
          }
          while (rows.length > lines.length) rows.pop().remove();
          const from = full ? 0 : Math.max(0, lines.length - 2);
          for (let k = from; k < lines.length; k++) {
            rows[k].lastChild.innerHTML = f.lang === 'md' ? esc(lines[k]) : vscHighlight(lines[k], f.lang);
            rows[k].classList.remove('cur');
          }
          const last = rows[lines.length - 1];
          last.classList.add('cur');
          last.lastChild.insertAdjacentHTML('beforeend', '<i class="vsc-caret"></i>');
          pos.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
          const lr = last.offsetTop + last.offsetHeight;
          if (lr > codeEl.scrollTop + codeEl.clientHeight - 20) codeEl.scrollTop = lr - codeEl.clientHeight + 40;
        }

        function openFile(i) {
          const f = files[i];
          active = i;
          state[i].open = true;
          files.forEach((o) => o.treeEl.classList.toggle('on', o === f));
          crumbs.innerHTML = `${f.dir ? `<span>${f.dir}</span> › ` : ''}${vscBadge(f.lang)} <span></span>`;
          crumbs.lastElementChild.textContent = f.name;
          langEl.textContent = f.label;
          w.setTitle(`${state[i].typed < f.code.length ? '● ' : ''}${f.name} - efe-cv - Visual Studio Code`);
          renderTabs();
          paint(true);
          if (state[i].typed < f.code.length) schedule(400);
        }

        function schedule(ms) {
          clearTimeout(timer);
          timer = setTimeout(step, ms);
        }

        function markTyping() {
          codeEl.classList.add('typing');
          clearTimeout(idleTimer);
          idleTimer = setTimeout(() => codeEl.classList.remove('typing'), 500);
        }

        function step() {
          if (!alive()) return;
          const f = files[active], st = state[active];
          if (st.typo) {
            st.typo = '';
            paint(false);
            return schedule(90 + Math.random() * 60);
          }
          if (st.typed >= f.code.length) return fileDone();
          const ch = f.code[st.typed];
          let delay = f.speed * (0.4 + Math.random() * 1.2);
          if (ch === '\n') {
            st.typed++;
            while (f.code[st.typed] === ' ') st.typed++; // otomatik girinti
            delay = f.speed * (3 + Math.random() * 5);
          } else if (/[a-zğüşöçı]/i.test(ch) && f.speed > 15 && Math.random() < 0.018) {
            st.typo = 'qwertyuiopasdfghjklzxcvbnm'[Math.floor(Math.random() * 26)];
            delay = 160 + Math.random() * 140;
          } else {
            st.typed++;
            if (/[,;{(]/.test(ch)) delay += 50;
            if (f.speed > 15 && Math.random() < 0.01) delay += 250 + Math.random() * 350; // düşünme payı
          }
          markTyping();
          paint(false);
          schedule(delay);
        }

        function fileDone() {
          renderTabs();
          w.setTitle(`${files[active].name} - efe-cv - Visual Studio Code`);
          const next = files.findIndex((f, i) => f.auto && state[i].typed < f.code.length);
          if (next >= 0) timer = setTimeout(() => alive() && openFile(next), 1100);
          else if (!termDone) { termDone = true; timer = setTimeout(runTerminal, 900); }
        }

        function termLine(html = '') {
          const d = document.createElement('div');
          d.innerHTML = html;
          termB.appendChild(d);
          termB.scrollTop = termB.scrollHeight;
          return d;
        }

        function runTerminal() {
          if (!alive()) return;
          term.hidden = false;
          const prompt = '<span class="t-ps">PS C:\\efe-cv&gt;</span> ';
          const cmdLine = termLine(prompt);
          const cmdText = 'npm run hire';
          let k = 0;
          const out = [
            [300, '<span class="t-dim">&gt; efe-cv@1.0.0 hire</span>'],
            [60, '<span class="t-dim">&gt; node scripts/hire.js</span>'],
            [500, ''],
            [700, `<span class="t-ok">✔</span> CV derlendi (${PROJECTS.length} proje, 0 hata)`],
            [600, '<span class="t-ok">✔</span> Testler geçti: merak, disiplin, takım çalışması'],
            [600, '<span class="t-ok">✔</span> Kahve seviyesi: yeterli ☕'],
            [800, ''],
            [100, `<span class="t-hi">✨ Aday işe alınmaya hazır.</span> İletişim: <a href="mailto:${esc(CV.email)}">${esc(CV.email)}</a>`],
            [300, ''],
          ];
          const typeCmd = () => {
            if (!alive()) return;
            if (k < cmdText.length) {
              cmdLine.innerHTML = prompt + esc(cmdText.slice(0, ++k)) + '<i class="vsc-caret"></i>';
              return (timer = setTimeout(typeCmd, 70 + Math.random() * 90));
            }
            cmdLine.innerHTML = prompt + esc(cmdText);
            let t = 0;
            out.forEach(([ms, html], j) => {
              t += ms;
              setTimeout(() => {
                if (!alive()) return;
                termLine(html);
                if (j === out.length - 1) {
                  termLine(prompt + '<i class="vsc-caret"></i>');
                  window.Extras?.unlock('vscode');
                }
              }, t);
            });
          };
          timer = setTimeout(typeCmd, 500);
        }

        openFile(0);
      },
    });
  }

  return { notepad, explorer, ie, pdf, minesweeper, paint, cmd, run, sysprops, vscode, launch, Items, setDesktopItems, openExternal, FS };
})();
