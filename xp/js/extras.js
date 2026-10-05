/* Sürprizler: başarımlar, Görev Yöneticisi, mavi ekran, Blaster kapanışı, MSN Messenger,
   IE indirme penceresi ve küçük dokunuşlar (gece Bliss, ağ durumu, sekme başlığı, yazdırma, konsol, Konami). */
const Extras = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = WM.escapeHtml;
  const desk = () => $('#desktop');
  const onDesktop = () => !desk().hidden && !$('#bsod');
  const busyCorner = () => document.querySelector('.balloon, .msn-toast');
  const local = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* yok say */ } },
    remove(k) { try { localStorage.removeItem(k); } catch { /* yok say */ } },
  };
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* yok say */ } },
  };
  const hhmm = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  let explorerDead = false;

  /* ================= Başarımlar ================= */
  const ACH = [
    { id: 'readAll', name: 'Kitap Kurdu', desc: 'CV\'deki tüm .txt dosyalarını okudun.', hint: 'Masaüstündeki her belgeyi aç.' },
    { id: 'pdf', name: 'İndirme Tamamlandı', desc: 'CV\'yi PDF olarak indirdin.', hint: 'Belki kâğıt hâli de lazımdır.' },
    { id: 'drag', name: 'İç Mimar', desc: 'Masaüstünü yeniden düzenledin.', hint: 'Simgeler yerinde durmak zorunda değil.' },
    { id: 'mineWin', name: 'Mayın Temizleyici', desc: 'Mayın Tarlası\'nı kazandın.', hint: 'Klasik bir oyunu bitir.' },
    { id: 'xyzzy', name: 'xyzzy', desc: 'Mayın Tarlası\'nın gizli hilesini buldun. Sol üst köşedeki piksele dikkat!', hint: 'Colossal Cave\'in sihirli kelimesi ve Shift+Enter.' },
    { id: 'vscode', name: 'npm run hire', desc: 'VS Code\'daki kodu sonuna kadar izledin.', hint: 'Kod kendi kendine yazılırken sabırlı ol.' },
    { id: 'msn', name: 'Çevrimiçi', desc: 'Efe ile MSN\'de sohbet ettin.', hint: 'Tepside tanıdık yeşil-mavi biri var.' },
    { id: 'nudge', name: 'Titreşim!', desc: 'Titreşim gönderdin (ve karşılığını aldın).', hint: 'MSN\'in en sinir bozucu düğmesi.' },
    { id: 'explorer', name: 'explorer.exe Yanıt Vermiyor', desc: 'Masaüstünü sonlandırdın.', hint: 'Görev Yöneticisi\'nde sonlandırılmaması gereken bir işlem var.' },
    { id: 'explorerBack', name: 'Hayata Döndür', desc: 'explorer.exe\'yi yeniden başlattın.', hint: 'Kaybolan bir şeyi Dosya menüsünden geri getir.' },
    { id: 'bsod', name: 'Mavi Ekran', desc: 'Sistemi çökerttin. Tebrikler(?)', hint: 'Bazı işlemler (ve bazı komutlar) sistemin kalbidir.' },
    { id: 'rpc', name: 'Blaster Kurtarıcısı', desc: 'RPC kapanış geri sayımını durdurdun.', hint: 'svchost.exe çökerse komut isteminde iptal parametresini hatırla.' },
    { id: 'konami', name: '↑↑↓↓←→←→BA', desc: 'Windows Klasik temayı açtın.', hint: 'Oyuncuların en ünlü kodu.' },
    { id: 'print', name: 'Kâğıt İsrafı', desc: 'CV\'yi yazdırmayı denedin; kâğıtta sade hâli çıkar.', hint: 'Ctrl+P ne yapar?' },
    { id: 'console', name: 'Geliştirici', desc: 'Konsoldan efe.hire() çağırdın.', hint: 'F12\'ye bir göz at.' },
    { id: 'offline', name: 'Kablo Çıktı', desc: 'İnternet bağlantın koptu (umarım bilerek).', hint: 'Ağ kablosunu çek ya da uçak modunu aç.' },
    { id: 'tabAway', name: 'Yanıt Vermiyor', desc: 'Başka bir sekmeye gidip geri döndün.', hint: 'Biraz uzaklaş, sonra dön.' },
    { id: 'night', name: 'Gece Kuşu', desc: 'Siteyi gece ziyaret ettin; Bliss\'e yıldızlar düştü.', hint: 'Güneş battıktan sonra gel.' },
    { id: 'lost', name: 'Kayıp', desc: 'Var olmayan bir sayfaya gittin.', hint: 'Adres çubuğuna uydurma bir yol yaz.' },
  ];
  const ACH_KEY = 'xpcv-achievements';
  let got = local.get(ACH_KEY) || {};
  const queue = [];
  let nextAt = 0;
  const count = () => ACH.filter((a) => got[a.id]).length;

  function unlock(id) {
    if (got[id] || !ACH.some((a) => a.id === id)) return;
    got[id] = Date.now();
    local.set(ACH_KEY, got);
    queue.push(id);
    WM.get('achievements')?.refresh?.();
  }

  setInterval(() => {
    if (!queue.length || !onDesktop() || explorerDead || busyCorner() || Date.now() < nextAt || !window.XP) return;
    const id = queue.shift();
    const a = ACH.find((x) => x.id === id);
    const n = count();
    XP.balloon(`Başarım açıldı: ${a.name}`, `${a.desc}\n(${n}/${ACH.length} · tümünü görmek için tıklayın)`, 6500, 'trophy', achievements);
    nextAt = Date.now() + 7000;
    if (n === ACH.length && !queue.length) setTimeout(allDone, 7200);
  }, 700);

  function allDone() {
    WM.dialog({
      title: 'Tüm başarımlar açıldı!',
      icon: 'trophy',
      message: `${ACH.length}/${ACH.length}. Bu siteyi en az benim kadar detaylı inceledin.\n\nBu kadar detaycı biriyle çalışmak isterim:\n${CV.email}`,
    });
  }

  function achievements() {
    return WM.open({
      id: 'achievements',
      title: 'Başarımlar',
      icon: ICONS.trophy,
      width: 470,
      height: 540,
      minWidth: 300,
      render(body, w) {
        body.innerHTML = `
          <div class="ach-head">
            <img src="${ICONS.trophy}" alt="">
            <div class="ach-sum"><b>Başarımlar</b><span class="ach-count"></span><div class="ach-bar"><i></i></div></div>
            <button class="xp-btn ach-reset" type="button">Sıfırla</button>
          </div>
          <div class="ach-list xp-scroll"></div>`;
        const list = $('.ach-list', body);
        w.refresh = () => {
          const n = count();
          $('.ach-count', body).textContent = `${n} / ${ACH.length} açıldı`;
          $('.ach-bar i', body).style.width = (n / ACH.length) * 100 + '%';
          list.innerHTML = [...ACH].sort((a, b) => !!got[b.id] - !!got[a.id]).map((a) => {
            const done = !!got[a.id];
            const when = done ? new Date(got[a.id]).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '';
            return `<div class="ach-item${done ? ' done' : ''}">
              <img src="${ICONS.trophy}" alt="">
              <div><b>${done ? esc(a.name) : '???'}</b><span>${esc(done ? a.desc : 'İpucu: ' + a.hint)}</span>${done ? `<small>${esc(when)}</small>` : ''}</div>
            </div>`;
          }).join('');
        };
        $('.ach-reset', body).addEventListener('click', () => WM.dialog({
          title: 'Başarımları Sıfırla',
          icon: 'question',
          message: 'Tüm başarımlar silinsin mi? Sürprizleri yeniden keşfedebilirsiniz.',
          buttons: ['Evet', 'Hayır'],
          onButton: (b) => { if (b === 'Evet') { got = {}; local.set(ACH_KEY, got); w.refresh(); } },
        }));
        w.refresh();
      },
    });
  }

  const readFiles = new Set(local.get('xpcv-read') || []);
  function read(name) {
    readFiles.add(name);
    local.set('xpcv-read', [...readFiles]);
    if (CV_FILES.every((f) => readFiles.has(f.name))) unlock('readAll');
  }

  /* ================= Mavi ekran ================= */
  let bsodTimer = null;
  function bsod(kind = 'hire') {
    if ($('#bsod')) return;
    const info = kind === 'critical'
      ? { name: 'CRITICAL_OBJECT_TERMINATION', code: '0x000000F4', args: '(0x00000003, 0x8A5C2D98, 0x8A5C2F0C, 0x805D1204)' }
      : { name: 'HIRE_ME_EXCEPTION', code: '0x00000EFE', args: '(0xC0FFEE00, 0x00000001, 0x0000CAFE, 0x00002026)' };
    WM.closeAll();
    XP.closeStart?.();
    stopRpc();
    document.querySelector('.msn-toast')?.remove();
    const el = document.createElement('div');
    el.id = 'bsod';
    el.innerHTML = `<pre>Bir sorun algılandı ve bilgisayarınıza zarar gelmemesi için Windows
kapatıldı.

${info.name}

Bu durdurma hatası ekranını ilk kez görüyorsanız bilgisayarınızı
yeniden başlatın. Bu ekran yeniden görünürse şu adımları izleyin:

Adayın CV'sinin gereğinden fazla etkileyici olup olmadığını denetleyin.
Sorun sürerse işe alım sürecini hızlandırın veya adayla doğrudan
iletişime geçin: ${esc(CV.email)}

Teknik bilgiler:

*** STOP: ${info.code} ${info.args}

***      efe.sys - Address DEADBEEF base at 20260923, DateStamp 3f5a2c1e

Fiziksel belleğin dökümü başlatılıyor
<span class="bsod-dump">Fiziksel bellek dökümü:   0</span></pre>`;
    document.body.appendChild(el);
    unlock('bsod');
    const dump = $('.bsod-dump', el);
    let p = 0, ready = false;
    const reboot = () => {
      if (!ready) return;
      clearTimeout(bsodTimer);
      el.remove();
      document.removeEventListener('keydown', reboot);
      reset();
      XP.boot();
    };
    const t = setInterval(() => {
      p = Math.min(100, p + 3 + Math.floor(Math.random() * 6));
      dump.textContent = 'Fiziksel bellek dökümü: ' + String(p).padStart(3, ' ');
      if (p < 100) return;
      clearInterval(t);
      dump.textContent = 'Fiziksel bellek dökümü tamamlandı.\nDaha fazla yardım için sistem yöneticinize ya da teknik destek grubunuza başvurun.';
      ready = true;
      bsodTimer = setTimeout(reboot, 4000);
    }, 110);
    el.addEventListener('click', reboot);
    document.addEventListener('keydown', reboot);
  }

  /* ================= Blaster: RPC kapanış geri sayımı ================= */
  let rpcWin = null, rpcTimer = null, rpcAllow = false;
  function stopRpc() {
    clearInterval(rpcTimer);
    if (rpcWin) { rpcAllow = true; rpcWin.close(); }
    rpcWin = null;
  }
  function blaster() {
    if (rpcWin) return;
    let left = 60;
    rpcAllow = false;
    rpcWin = WM.open({
      id: 'rpc',
      title: 'Sistem Kapatılıyor',
      resizable: false,
      minimizable: false,
      taskbar: false,
      center: true,
      width: 410,
      className: 'topmost',
      onClose: () => rpcAllow,
      render(body) {
        body.innerHTML = `
          <div class="rpc">
            <div class="rpc-row"><img src="${ICONS.warning}" alt=""><p>Bu sistem kapanıyor. Lütfen devam eden tüm çalışmaları kaydedin ve oturumu kapatın. Kaydedilmemiş değişiklikler kaybolacak. Bu kapatma NT AUTHORITY\\SYSTEM tarafından başlatıldı</p></div>
            <p>Kapatılmaya kalan süre: <b class="rpc-left">00:01:00</b></p>
            <fieldset><legend>İleti</legend>Uzak Yordam Çağrısı (RPC) hizmeti beklenmedik şekilde sonlandırıldı; Windows şimdi yeniden başlatılmalıdır.</fieldset>
          </div>`;
      },
    });
    const leftEl = $('.rpc-left', rpcWin.body);
    rpcTimer = setInterval(() => {
      if (!WM.get('rpc')) { clearInterval(rpcTimer); rpcWin = null; return; }
      left--;
      leftEl.textContent = '00:00:' + String(left).padStart(2, '0');
      if (left <= 0) { stopRpc(); XP.restart(); }
    }, 1000);
  }
  // Komut İstemi: shutdown -a
  function abortShutdown() {
    if (!rpcWin) return false;
    stopRpc();
    unlock('rpc');
    return true;
  }

  /* ================= explorer.exe ================= */
  let hintTimer = null;
  function killExplorer() {
    explorerDead = true;
    XP.closeStart?.();
    WM.closeMenus();
    desk().classList.add('no-explorer');
    unlock('explorer');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      if (!explorerDead || $('.explorer-hint')) return;
      const h = document.createElement('button');
      h.type = 'button';
      h.className = 'explorer-hint';
      h.textContent = 'explorer.exe çalışmıyor. Görev Yöneticisi\'ni açmak için Ctrl+Alt+Del\'e basın ya da buraya tıklayın.';
      h.addEventListener('click', () => taskmgr());
      desk().appendChild(h);
    }, 6000);
  }
  function restoreExplorer() {
    if (!explorerDead) return;
    explorerDead = false;
    clearTimeout(hintTimer);
    $('.explorer-hint')?.remove();
    desk().classList.remove('no-explorer');
    unlock('explorerBack');
  }

  function reset() {
    explorerDead = false;
    clearTimeout(hintTimer);
    $('.explorer-hint')?.remove();
    desk().classList.remove('no-explorer');
    stopRpc();
  }

  /* ================= Görev Yöneticisi ================= */
  const EXE = [
    [ICONS.notepad, 'notepad.exe', 3120], [ICONS.paint, 'mspaint.exe', 9840], [ICONS.mine, 'winmine.exe', 1980],
    [ICONS.cmd, 'cmd.exe', 1460], [ICONS.ie, 'iexplore.exe', 18432], [ICONS.vscode, 'Code.exe', 412672],
    [ICONS.msn, 'msnmsgr.exe', 14336], [ICONS.trophy, 'basarim.exe', 2210], [ICONS.taskmgr, 'taskmgr.exe', 4096],
  ];
  let pidSeq = 3000;
  const P = (n, u, mem, cpu, kind, msg) => ({ pid: (pidSeq += 44 + Math.floor(Math.random() * 300)), n, u, mem, cpu, kind, msg, cur: 0 });
  const procs = [
    P('System Idle Process', 'SYSTEM', 16, null, 'deny'),
    P('System', 'SYSTEM', 236, [0, 1], 'deny'),
    P('smss.exe', 'SYSTEM', 388, [0, 0], 'deny'),
    P('csrss.exe', 'SYSTEM', 3412, [0, 2], 'bsod'),
    P('winlogon.exe', 'SYSTEM', 5120, [0, 0], 'bsod'),
    P('services.exe', 'SYSTEM', 3380, [0, 1], 'deny'),
    P('lsass.exe', 'SYSTEM', 1204, [0, 0], 'deny'),
    P('svchost.exe', 'SYSTEM', 4876, [0, 1], 'rpc'),
    P('svchost.exe', 'AĞ HİZMETİ', 3920, [0, 0], 'rpc'),
    P('explorer.exe', 'Efe', 21448, [0, 3], 'explorer'),
    P('motivasyon.exe', 'Efe', 131072, [48, 76], 'msg', 'İşlem tamamlanamadı: motivasyon.exe kritik bir işlemdir.\n\nBu işlem olmadan Efe çalışamaz.'),
    P('kahve.exe', 'Efe', 2048, [3, 9], 'coffee'),
    P('merak.exe', 'Efe', 65536, [4, 12], 'msg', 'merak.exe sonlandırılamadı.\n\nİşlem her sonlandırma girişiminde yeni bir soru soruyor: "Peki bu nasıl çalışıyor?"'),
    P('imposter_syndrome.exe', 'Efe', 512, [0, 2], 'msg', 'İşlem yanıt vermiyor.\n\nEndişelenmeyin: zararsızdır, arka planda sessizce çalışıp daha çok öğrenmeye iter.'),
    P('prokrastinasyon.exe', 'Efe', 4, [0, 0], 'ok', 'prokrastinasyon.exe sonlandırıldı.\n\nKeşke gerçek hayatta da bu kadar kolay olsaydı.'),
    P('stackoverflow.exe', 'Efe', 1310720, [1, 6], 'respawn'),
    P('node.exe', 'Efe', 2097152, [0, 4], 'ok', 'node.exe sonlandırıldı. 2 GB bellek serbest bırakıldı.\n\nnode_modules hâlâ diskte duruyor.'),
  ];
  const visibleProcs = () => procs.filter((p) => !(p.kind === 'explorer' && explorerDead));
  const rand = ([a, b]) => a + Math.floor(Math.random() * (b - a + 1));
  const fmtK = (k) => k.toLocaleString('tr-TR') + ' K';
  const cpuHist = [], kahveHist = [], netHist = [];
  let cpuTotal = 0;

  function appProcs() {
    const seen = new Map();
    WM.wins.forEach((w) => {
      if (w.opts.taskbar === false) return;
      const idx = EXE.findIndex((x) => x[0] === w.opts.icon);
      if (idx < 0) return;
      const e = EXE[idx];
      if (!seen.has(e[1])) seen.set(e[1], { pid: 1204 + idx * 212, n: e[1], u: 'Efe', mem: e[2], cpu: [0, e[1] === 'Code.exe' ? 6 : 1], kind: 'app', wins: [] });
      seen.get(e[1]).cur = rand(seen.get(e[1]).cpu);
      seen.get(e[1]).wins.push(w);
    });
    return [...seen.values()];
  }

  function tickProcs() {
    let sum = 0;
    procs.forEach((p) => { if (p.cpu) { p.cur = rand(p.cpu); sum += p.cur; } });
    const apps = appProcs();
    apps.forEach((p) => { sum += p.cur; });
    sum = Math.min(99, sum);
    procs[0].cur = 100 - sum;
    cpuTotal = sum;
    cpuHist.push(sum); kahveHist.push(55 + Math.sin(Date.now() / 9000) * 10 + Math.random() * 6); netHist.push(Math.random() < 0.15 ? Math.random() * 30 : Math.random() * 2);
    [cpuHist, kahveHist, netHist].forEach((h) => h.length > 120 && h.shift());
    return apps;
  }

  function graph(canvas, hist, color) {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr; canvas.height = r.height * dpr;
    const c = canvas.getContext('2d');
    c.scale(dpr, dpr);
    c.fillStyle = '#000'; c.fillRect(0, 0, r.width, r.height);
    c.strokeStyle = '#008040'; c.lineWidth = 1;
    const off = (hist.length * 3) % 12;
    for (let x = r.width - off; x > 0; x -= 12) { c.beginPath(); c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, r.height); c.stroke(); }
    for (let y = 12; y < r.height; y += 12) { c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(r.width, y + 0.5); c.stroke(); }
    c.strokeStyle = color; c.lineWidth = 1.5; c.beginPath();
    hist.forEach((v, i) => {
      const x = r.width - (hist.length - 1 - i) * 3, y = r.height - (v / 100) * (r.height - 2) - 1;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    });
    c.stroke();
  }

  function meter(el, v, label) {
    const bars = 20, lit = Math.round((v / 100) * bars);
    el.innerHTML = `<div class="tm-meter">${Array.from({ length: bars }, (_, i) => `<i class="${bars - i <= lit ? 'on' : ''}"></i>`).join('')}</div><span>${label}</span>`;
  }

  function taskmgr() {
    return WM.open({
      id: 'taskmgr',
      title: 'Windows Görev Yöneticisi',
      icon: ICONS.taskmgr,
      width: 430,
      height: 480,
      minWidth: 320,
      minHeight: 360,
      render(body, w) {
        let tab = 'İşlemler', sel = null, timer = null;
        WM.menubar(body, [
          { label: 'Dosya', items: [{ label: 'Yeni Görev (Çalıştır...)', action: newTask }, '-', { label: 'Görev Yöneticisi\'nden Çık', action: () => w.close() }] },
          { label: 'Seçenekler', items: [{ label: 'Her Zaman Üstte', checked: true, disabled: true }, { label: 'Kullanımda Simge Durumuna Küçült', checked: true, disabled: true }] },
          { label: 'Görünüm', items: [{ label: 'Şimdi Yenile', key: 'F5', action: () => tick() }] },
          { label: 'Kapat', items: [{ label: 'Oturumu Kapat', action: () => XP.logoffDialog() }, { label: 'Bilgisayarı Kapat', action: () => XP.shutdownDialog() }] },
          { label: 'Yardım', items: [{ label: 'Görev Yöneticisi Hakkında', action: () => WM.dialog({ title: 'Görev Yöneticisi Hakkında', icon: 'info', message: 'Windows Görev Yöneticisi\nSürüm 5.1 (CV Edition)\n\nİpucu: bazı işlemleri sonlandırmak gerçekten kötü bir fikir.' }) }] },
        ]);
        const TABS = ['Uygulamalar', 'İşlemler', 'Performans', 'Ağ', 'Kullanıcılar'];
        body.insertAdjacentHTML('beforeend', `
          <div class="tm">
            <div class="tabs">${TABS.map((t) => `<div class="tab" data-t="${t}">${t}</div>`).join('')}</div>
            <div class="tab-panel tm-panel"></div>
          </div>
          <div class="statusbar"><span class="tm-s1"></span><span class="tm-s2"></span><span class="tm-s3"></span></div>`);
        const panel = $('.tm-panel', body);

        const table = (cols, rows) => `
          <div class="tm-table xp-scroll"><table>
            <thead><tr>${cols.map((c) => `<th class="${c.num ? 'num' : ''}">${c.t}</th>`).join('')}</tr></thead>
            <tbody>${rows.join('')}</tbody>
          </table></div>`;

        // Her saniyelik yenilemede düğmeler yeniden çizilmez (tıklama kaybolmasın), yalnızca satırlar güncellenir
        function rowsOnly(cols, rows, actions, full) {
          const tbody = $('tbody', panel);
          if (!full && tbody) tbody.innerHTML = rows.join('');
          else panel.innerHTML = table(cols, rows) + actions;
        }
        function renderTab(full) {
          const apps = appProcs();
          if (tab === 'İşlemler') {
            const list = [...visibleProcs(), ...apps];
            rowsOnly(
              [{ t: 'Görüntü Adı' }, { t: 'Kullanıcı Adı' }, { t: 'CPU', num: 1 }, { t: 'Bellek Kullanımı', num: 1 }],
              list.map((p) => `<tr data-pid="${p.pid}" class="${sel === p.pid ? 'sel' : ''}"><td>${esc(p.n)}</td><td>${esc(p.u)}</td><td class="num">${String(p.cur).padStart(2, '0')}</td><td class="num">${fmtK(p.mem)}</td></tr>`),
              `<div class="tm-actions"><label><input type="checkbox" checked disabled> Tüm kullanıcıların işlemlerini göster</label><button class="xp-btn tm-kill" type="button">İşlemi Sonlandır</button></div>`,
              full
            );
          } else if (tab === 'Uygulamalar') {
            const wins = [...WM.wins.values()].filter((x) => x.opts.taskbar !== false);
            if (sel && !wins.some((x) => x.id === sel)) sel = null;
            rowsOnly([{ t: 'Görev' }, { t: 'Durum' }],
              wins.map((x) => `<tr data-wid="${esc(x.id)}" class="${sel === x.id ? 'sel' : ''}"><td><img src="${x.opts.icon || ICONS.flag}" alt="">${esc(x.title)}</td><td>Çalışıyor</td></tr>`),
              `<div class="tm-actions"><button class="xp-btn tm-endtask" type="button">Görevi Sona Erdir</button><button class="xp-btn tm-switch" type="button">Geçiş Yap</button><button class="xp-btn tm-new" type="button">Yeni Görev...</button></div>`,
              full
            );
          } else if (tab === 'Performans') {
            if (full || !$('.tm-perf', panel)) {
              panel.innerHTML = `
                <div class="tm-perf">
                  <fieldset><legend>CPU Kullanımı</legend><div class="tm-gauge tm-g1"></div></fieldset>
                  <fieldset><legend>CPU Kullanımı Geçmişi</legend><canvas class="tm-c1"></canvas></fieldset>
                  <fieldset><legend>Kahve Kullanımı</legend><div class="tm-gauge tm-g2"></div></fieldset>
                  <fieldset><legend>Kahve Kullanım Geçmişi</legend><canvas class="tm-c2"></canvas></fieldset>
                </div>
                <div class="tm-totals">
                  <fieldset><legend>Toplamlar</legend><dl><dt>Commit'ler</dt><dd>1.337</dd><dt>Çözülen hatalar</dt><dd>404</dd><dt>Açık sekmeler</dt><dd>42</dd></dl></fieldset>
                  <fieldset><legend>Fiziksel Bellek (K)</legend><dl><dt>Toplam</dt><dd>2.097.152</dd><dt>Kullanılabilir</dt><dd>öğrenmeye açık</dd><dt>Önbellek</dt><dd>Stack Overflow</dd></dl></fieldset>
                </div>`;
            }
            meter($('.tm-g1', panel), cpuTotal, cpuTotal + ' %');
            const k = kahveHist[kahveHist.length - 1] || 55;
            meter($('.tm-g2', panel), k, (k / 20).toFixed(1).replace('.', ',') + ' fincan');
            graph($('.tm-c1', panel), cpuHist, '#00ff00');
            graph($('.tm-c2', panel), kahveHist, '#ffff00');
          } else if (tab === 'Ağ') {
            if (full || !$('.tm-net', panel)) {
              panel.innerHTML = `<div class="tm-net"><fieldset><legend>Yerel Ağ Bağlantısı</legend><canvas class="tm-c3"></canvas></fieldset></div>` +
                table([{ t: 'Bağdaştırıcı Adı' }, { t: 'Ağ Kullanımı', num: 1 }, { t: 'Bağlantı Hızı', num: 1 }, { t: 'Durum' }], [
                  `<tr><td>Yerel Ağ Bağlantısı</td><td class="num tm-netuse">0 %</td><td class="num">100 Mb/sn</td><td>${navigator.onLine ? 'Bağlandı' : 'Ağ kablosu çıkarıldı'}</td></tr>`,
                  `<tr><td>LinkedIn</td><td class="num">—</td><td class="num">1. derece</td><td>Bağlantı bekleniyor</td></tr>`,
                ]);
            }
            graph($('.tm-c3', panel), netHist, '#00ff00');
            const n = $('.tm-netuse', panel);
            if (n) n.textContent = (netHist[netHist.length - 1] || 0).toFixed(2).replace('.', ',') + ' %';
          } else if (tab === 'Kullanıcılar' && full) {
            panel.innerHTML = table([{ t: 'Kullanıcı' }, { t: 'Kimlik', num: 1 }, { t: 'Durum' }, { t: 'Oturum' }], [
              '<tr><td><img src="' + ICONS.user + '" alt="">Efe</td><td class="num">0</td><td>Etkin</td><td>Konsol</td></tr>',
              '<tr><td><img src="' + ICONS.visitor + '" alt="">Ziyaretçi (siz)</td><td class="num">1</td><td>Etkin</td><td>Tarayıcı</td></tr>',
            ]) + `<div class="tm-actions"><button class="xp-btn" type="button" disabled>Bağlantıyı Kes</button><button class="xp-btn tm-logoff" type="button">Oturumu Kapat</button><button class="xp-btn tm-msg" type="button">İleti Gönder...</button></div>`;
          }
          const count = visibleProcs().length + apps.length;
          $('.tm-s1', body).textContent = `İşlemler: ${count}`;
          $('.tm-s2', body).textContent = `CPU Kullanımı: ${cpuTotal}%`;
          $('.tm-s3', body).textContent = 'Ayrılan Bellek: 1337M / 2048M';
        }

        function show(t) {
          tab = t;
          sel = null;
          body.querySelectorAll('.tm .tab').forEach((x) => x.classList.toggle('active', x.dataset.t === t));
          renderTab(true);
        }
        function tick() {
          if (!w.el.isConnected) return clearInterval(timer);
          tickProcs();
          renderTab(false);
        }

        panel.addEventListener('pointerdown', (e) => {
          const tr = e.target.closest('tbody tr');
          if (!tr) return;
          sel = tr.dataset.pid ? +tr.dataset.pid : tr.dataset.wid || null;
          panel.querySelectorAll('tbody tr').forEach((r) => r.classList.toggle('sel', r === tr));
        });
        panel.addEventListener('click', (e) => {
          const b = e.target.closest('button');
          if (!b || b.disabled) return;
          if (b.classList.contains('tm-kill')) {
            const p = [...visibleProcs(), ...appProcs()].find((x) => x.pid === sel);
            if (p) confirmKill(p, () => renderTab(true));
          } else if (b.classList.contains('tm-endtask')) {
            WM.get(sel)?.close();
            renderTab(true);
          } else if (b.classList.contains('tm-switch')) {
            const t = WM.get(sel);
            if (t) WM.restore(t);
          } else if (b.classList.contains('tm-new')) newTask();
          else if (b.classList.contains('tm-logoff')) XP.logoffDialog();
          else if (b.classList.contains('tm-msg')) msnChat();
        });
        $('.tm .tabs', body).addEventListener('click', (e) => { const t = e.target.closest('.tab'); if (t) show(t.dataset.t); });
        tickProcs();
        show('İşlemler');
        timer = setInterval(tick, 1000);
        w.onClose = () => clearInterval(timer);
      },
    });
  }

  function confirmKill(p, after) {
    WM.dialog({
      title: 'Görev Yöneticisi Uyarısı',
      icon: 'warning',
      message: 'UYARI: Bir işlemi sonlandırmak, veri kaybı ve sistem kararsızlığı gibi istenmeyen sonuçlara yol açabilir. İşleme, sonlandırılmadan önce durumunu veya verilerini kaydetme şansı verilmez. Bu işlemi sonlandırmak istediğinizden emin misiniz?',
      buttons: ['Evet', 'Hayır'],
      onButton: (b) => { if (b === 'Evet') { kill(p); after?.(); } },
    });
  }

  function removeProc(p) {
    const i = procs.indexOf(p);
    if (i >= 0) procs.splice(i, 1);
    return i;
  }

  function kill(p) {
    const denied = (msg) => WM.dialog({ title: 'İşlem Sonlandırılamıyor', icon: 'error', message: msg });
    switch (p.kind) {
      case 'deny': return denied('İşlem tamamlanamadı.\n\nErişim engellendi.');
      case 'msg': return denied(p.msg);
      case 'bsod': return setTimeout(() => bsod('critical'), 350);
      case 'rpc': return setTimeout(blaster, 600);
      case 'explorer': return killExplorer();
      case 'app': return p.wins.forEach((x) => x.close());
      case 'ok':
        removeProc(p);
        if (p.msg) WM.dialog({ title: 'Görev Yöneticisi', icon: 'info', message: p.msg });
        return;
      case 'coffee': {
        const i = removeProc(p);
        WM.dialog({ title: 'Görev Yöneticisi', icon: 'warning', message: 'kahve.exe sonlandırıldı.\n\nÜretkenlik %80 düştü. Otomatik demleme başlatılıyor... ☕' });
        setTimeout(() => { p.pid += 17; procs.splice(i, 0, p); }, 4000);
        return;
      }
      case 'respawn': {
        const i = removeProc(p);
        setTimeout(() => {
          p.pid += 23;
          procs.splice(i, 0, p);
          WM.dialog({ title: 'Görev Yöneticisi', icon: 'info', message: 'stackoverflow.exe yeniden başlatıldı.\n\nNeden: Ctrl+C / Ctrl+V bağımlılığı.' });
        }, 1500);
        return;
      }
    }
  }

  function newTask() {
    return WM.open({
      id: 'newtask',
      title: 'Yeni Görev Oluştur',
      resizable: false,
      minimizable: false,
      taskbar: false,
      center: true,
      width: 370,
      className: 'topmost',
      render(body, w) {
        body.innerHTML = `
          <div class="dlg">
            <div class="dlg-row"><img src="${ICONS.run}" alt=""><div class="dlg-msg">Açmak istediğiniz programın, klasörün, belgenin veya Internet kaynağının adını yazın; Windows sizin için açacaktır.</div></div>
            <div class="run-row"><label>Aç:</label><input class="xp-input" type="text" spellcheck="false" autocomplete="off" autocapitalize="off" value=""></div>
            <div class="dlg-btns" style="justify-content:flex-end"><button class="xp-btn default" type="button">Tamam</button><button class="xp-btn" type="button">İptal</button></div>
          </div>`;
        const input = $('input', body);
        const [ok, cancel] = body.querySelectorAll('.xp-btn');
        const go = () => {
          const v = input.value.trim();
          if (!v) return;
          w.close();
          if (!Apps.launch(v)) WM.dialog({ title: v, icon: 'error', message: `Windows '${v}' öğesini bulamıyor. Adın doğru yazıldığından emin olun ve yeniden deneyin.` });
        };
        ok.addEventListener('click', go);
        cancel.addEventListener('click', () => w.close());
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); if (e.key === 'Escape') w.close(); });
        setTimeout(() => input.focus(), 50);
      },
    });
  }

  /* ================= MSN Messenger ================= */
  const norm = (s) => s.toLocaleLowerCase('tr').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
  const fileLink = (name) => `<a href="#" data-act="file:${esc(name)}">${esc(name)}</a>`;
  const mailLink = (label = CV.email) => `<a href="#" data-act="mail">${esc(label)}</a>`;
  const REPLIES = {
    greet: ['selaam 👋', 'CV\'me hoş geldin! aşağıdaki hazır sorulardan birine tıklayabilir ya da istediğini yazabilirsin 🙂'],
    howru: ['iyiyim, kod yazıyorum 😄 sen nasılsın?'],
    who: ['ben Efe, Ankara\'da yazılım geliştiriciyim 💻', 'Ostim Teknik Üniversitesi Bilgisayar Mühendisliği mezunuyum. veri modelinden arayüzün son detayına kadar uçtan uca ürün geliştiriyorum.', 'şu an BZB İletişim\'de kurumsal ERP çözümleri geliştiriyorum; paralelde SaaS ürünleri ve yapay zekâ ajanları üzerinde çalışıyorum 🤖'],
    proud: ['TTT World ERP 💪', 'legacy bir ASP.NET Web Forms sistemini ASP.NET Core 8 + React mimarisine taşıdım; şu an üretimde çalışıyor.', `ayrıntılar: ${fileLink('Projeler.txt')}`],
    projects: ['öne çıkanlar:', '• <b>Dermapi</b>: klinikler için yönetim SaaS\'ı<br>• <b>WavLock</b>: prodüktörler için beat pazarı<br>• <b>TTT World ERP</b>: üretimde çalışan kurumsal ERP<br>• <b>AI Sales Orchestrator</b>: otonom satış ajanı', `8 projenin hepsi burada: ${fileLink('Projeler.txt')} 📂`],
    skills: ['diller: C#, TypeScript, Python, Java, SQL', 'backend: ASP.NET Core, Spring Boot · frontend: React, Next.js · mobil: React Native', `bir de yapay zekâ tarafı: çoklu ajan, tool calling, RAG 🤖 tam liste: ${fileLink('Yetenekler.txt')}`],
    exp: ['Haziran 2026\'dan beri BZB İletişim\'de yazılım geliştiriciyim; müşteri şirketler için ERP çözümleri geliştirip teslim ediyorum.', 'öncesinde 6 staj yaptım: ERP geliştirme, siber güvenlik, ağ güvenliği, yazılım ve test otomasyonu 🔧', `hepsi ${fileLink('Stajlar.txt')} dosyasında`],
    edu: ['Ostim Teknik Üniversitesi, Bilgisayar Mühendisliği (2022–2026) 🎓', 'İngilizcem C1 seviyesinde, YDS 76.25'],
    security: ['stajlarımda sızma testi, zafiyet analizi ve ağ güvenliği yaptım: Wireshark, Nmap, Metasploit, IDS/IPS 🛡️', 'CTF yarışmaları da ilgi alanlarım arasında 🏴'],
    ai: ['çoklu ajan orkestrasyonu, tool calling, RAG, guardrail tasarımı… Ollama ile yerel LLM, Claude ve Gemini API entegrasyonları 🤖', 'mesela STUDIOBASE: ajanların birbirine veri aktararak albüm konsepti ürettiği açık kaynak bir proje'],
    why: ['kısaca: uçtan uca düşünürüm 🙂', 'veri modelinden arayüzün son detayına kadar işi sahiplenirim; güvenliği ve altyapıyı sonradan değil, tasarımın parçası olarak ele alırım.', 'bir de… bu siteyi yaptım 😎'],
    contact: [`e-posta: ${mailLink()}`, `LinkedIn: <a href="#" data-act="url:${CV.linkedin}">linkedin.com/in/efehamd</a> · GitHub: <a href="#" data-act="url:${CV.github}">efehamdioglu</a>`, 'yeni fırsatlar ve iş birlikleri için her zaman ulaşabilirsin 📬'],
    money: ['bu tarz detayları en iyisi e-postada konuşalım 🙂', mailLink()],
    hobby: ['yapay zekâ, ofansif güvenlik, CTF, blokzincir ve müzik prodüksiyonu 🎧', fileLink('İlgi Alanları.txt')],
    site: ['saf HTML, CSS ve JavaScript; framework yok, build yok 😄', 'ipucu: bu sitede başka sürprizler de var 😉 Başlat menüsündeki "Başarımlar"a bir bak'],
    thanks: ['rica ederim 🙂 başka bir şey sormak istersen buradayım'],
    bye: ['görüşmek üzere! 👋', `yazmak istersen: ${mailLink()}`],
    fallback: ['hmm, bunu tam anlayamadım 🙈 (otomatik yanıt modundayım)', `hazır sorulardan birini seçebilir ya da bana doğrudan yazabilirsin: ${mailLink('e-posta gönder')}`],
  };
  const INTENTS = [
    ['nudge', /titres|nudge|salla/],
    ['proud', /gurur|en iyi proje|favori/],
    ['why', /neden|niye|ise al|seni secel|farkin/],
    ['money', /maas|ucret|ne zaman|musait|baslayabil|uzaktan|remote/],
    ['cv', /\bcv|ozgecmis|pdf|dosya/],
    ['projects', /proje/],
    ['ai', /yapay zeka|\bai\b|llm|ajan|agent|\brag\b/],
    ['security', /guvenlik|hack|ctf|pentest|siber|sizma/],
    ['skills', /yetenek|teknoloji|stack|\bdil|framework|beceri/],
    ['exp', /deneyim|tecrube|calis|pozisyon|staj|\bis yeri/],
    ['edu', /egitim|okul|universite|mezun|bolum|ingilizce/],
    ['contact', /iletisim|mail|e-posta|eposta|telefon|numara|ulas|linkedin|github/],
    ['hobby', /hobi|ilgi|muzik|bos zaman/],
    ['site', /bu site|siteyi|nasil yaptin/],
    ['who', /kimsin|kendini|tanit|hakkinda|sen kim/],
    ['howru', /nasilsin|naber|ne haber/],
    ['thanks', /tesekkur|sagol|eyvallah|thanks/],
    ['bye', /gorusuruz|hosca kal|\bbye\b|bay bay/],
    ['greet', /merhaba|selam|\bslm\b|\bmrb\b|\bhey\b|\bhi\b|hello|^sa$/],
  ];
  const QUICK = [['Kimsin?', 'who'], ['Projelerin?', 'projects'], ['Hangi teknolojiler?', 'skills'], ['Deneyimin?', 'exp'], ['Neden seni işe alalım?', 'why'], ['CV\'ni gönderir misin?', 'cv'], ['İletişim', 'contact']];

  function msnToast(html, onClick) {
    document.querySelector('.msn-toast')?.remove();
    const t = document.createElement('div');
    t.className = 'msn-toast';
    t.innerHTML = `
      <div class="msn-toast-h"><img src="${ICONS.msn}" alt=""><span>MSN Messenger</span><button type="button" class="msn-toast-x" aria-label="Kapat">×</button></div>
      <div class="msn-toast-b"><img src="${ICONS.user}" alt=""><div>${html}</div></div>`;
    t.querySelector('.msn-toast-x').addEventListener('click', (e) => { e.stopPropagation(); t.remove(); });
    t.addEventListener('click', () => { t.remove(); onClick?.(); });
    desk().appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 8000);
  }

  function signIn() {
    if (session.get('xpcv-msn-toast') || WM.get('msn-chat')) return;
    if (!onDesktop() || explorerDead || busyCorner()) return setTimeout(signIn, 3000);
    session.set('xpcv-msn-toast', '1');
    msnToast('<b>Efe Hamdioğlu</b> oturum açtı.', msnChat);
  }

  function msnMain() {
    return WM.open({
      id: 'msn',
      title: 'MSN Messenger',
      icon: ICONS.msn,
      width: 280,
      height: 470,
      minWidth: 230,
      minHeight: 300,
      render(body) {
        body.innerHTML = `
          <div class="msn">
            <div class="msn-me"><img src="${ICONS.visitor}" alt=""><div><b>Ziyaretçi</b> <span>(Çevrimiçi)</span><small>&lt;Kişisel bir ileti yazın&gt;</small></div></div>
            <div class="msn-list xp-scroll">
              <div class="msn-group">▾ Çevrimiçi (1)</div>
              <button type="button" class="msn-contact" data-c="efe"><i class="dot on"></i><span><b>Efe Hamdioğlu</b> <small>- 💻 kod yazıyor (otomatik yanıt açık)</small></span></button>
              <div class="msn-group">▾ Çevrimdışı (3)</div>
              <button type="button" class="msn-contact" data-c="so"><i class="dot"></i><span>Stack Overflow</span></button>
              <button type="button" class="msn-contact" data-c="clippy"><i class="dot"></i><span>Clippy</span></button>
              <button type="button" class="msn-contact" data-c="kahve"><i class="dot"></i><span>Kahve Makinesi</span></button>
            </div>
            <div class="msn-ad"><b>msn</b> Bugün: Aday işe alınmaya hazır. <a href="#" data-act="chat">Ayrıntılar »</a></div>
          </div>`;
        const OFF = {
          so: 'Stack Overflow şu anda çevrimdışı.\n\nSorunuz "duplicate" olarak işaretlendi. 🙃',
          clippy: 'Clippy 2007\'den beri çevrimdışı.\n\nAnısına saygıyla. 📎',
          kahve: 'Kahve Makinesi şu anda çevrimdışı.\n\nSu haznesi boş. ☕',
        };
        const open = (c) => (c === 'efe' ? msnChat() : WM.dialog({ title: 'MSN Messenger', icon: 'info', message: OFF[c] }));
        body.querySelectorAll('.msn-contact').forEach((b) => {
          b.addEventListener('dblclick', () => open(b.dataset.c));
          b.addEventListener('click', (e) => { if (e.pointerType && e.pointerType !== 'mouse') open(b.dataset.c); });
        });
        $('[data-act="chat"]', body).addEventListener('click', (e) => { e.preventDefault(); msnChat(); });
      },
    });
  }

  let lastNudge = 0;
  function msnChat() {
    document.querySelector('.msn-toast')?.remove();
    return WM.open({
      id: 'msn-chat',
      title: 'Efe Hamdioğlu - Konuşma',
      icon: ICONS.msn,
      width: 540,
      height: 480,
      minWidth: 320,
      minHeight: 340,
      render(body, w) {
        const TOOLS = [['👥', 'Davet Et'], ['📁', 'Dosya Gönder'], ['📹', 'Video'], ['🎤', 'Sesli'], ['🎨', 'Etkinlikler'], ['🎮', 'Oyunlar']];
        body.innerHTML = `
          <div class="msn-chat">
            <div class="msn-tools">${TOOLS.map(([i, t]) => `<button type="button" data-t="${t}"><span>${i}</span><em>${t}</em></button>`).join('')}</div>
            <div class="msn-to">Kime: <b>Efe Hamdioğlu</b> &lt;${esc(CV.email)}&gt;</div>
            <div class="msn-main">
              <div class="msn-left">
                <div class="msn-log xp-scroll"></div>
                <div class="msn-quick"></div>
                <div class="msn-fmt"><button type="button" class="msn-font" title="Yazı tipi">A</button><button type="button" class="msn-emo" title="İfade">😊</button><button type="button" class="msn-nudge" title="Titreşim gönder">📳 Titreşim gönder</button></div>
                <div class="msn-input"><textarea rows="2" spellcheck="false" aria-label="İleti"></textarea><button type="button" class="xp-btn msn-send">Gönder</button></div>
              </div>
              <div class="msn-pics"><img src="${ICONS.user}" alt="Efe"><img src="${ICONS.visitor}" alt="Siz"></div>
            </div>
            <div class="msn-status"></div>
          </div>`;
        const log = $('.msn-log', body), status = $('.msn-status', body), input = $('textarea', body);
        let talk = Promise.resolve();
        const scroll = () => (log.scrollTop = log.scrollHeight);
        const addMsg = (who, html) => {
          log.insertAdjacentHTML('beforeend', `<div class="msn-msg ${who}"><div class="msn-from">${who === 'efe' ? 'Efe Hamdioğlu' : 'Ziyaretçi'} diyor ki:</div><div class="msn-text">${html}</div></div>`);
          scroll();
        };
        const addSys = (html) => { log.insertAdjacentHTML('beforeend', `<div class="msn-sys">${html}</div>`); scroll(); };
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        const efeSay = (parts, then) => {
          talk = talk.then(async () => {
            for (const html of parts) {
              if (!w.el.isConnected) return;
              status.textContent = 'Efe Hamdioğlu bir ileti yazıyor...';
              await wait(Math.min(2200, 500 + html.replace(/<[^>]+>/g, '').length * 18));
              if (!w.el.isConnected) return;
              addMsg('efe', html);
              status.textContent = `Son ileti alma zamanı: ${hhmm()}.`;
            }
            then?.();
          });
        };
        const shake = (el) => { el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 800); };
        function nudge(fromEfe) {
          const now = Date.now();
          if (!fromEfe && now - lastNudge < 5000) return addSys('Çok sık titreşim gönderemezsiniz.');
          if (!fromEfe) lastNudge = now;
          addSys(fromEfe ? '<b>Efe Hamdioğlu size bir titreşim gönderdi!</b>' : 'Titreşim gönderdiniz.');
          shake(fromEfe ? desk() : w.el);
          if (!fromEfe) {
            unlock('nudge');
            setTimeout(() => efeSay(['hey! 😄 titreşime titreşimle cevap veririm'], () => nudge(true)), 900);
          }
        }
        function offerFile() {
          efeSay(['tabii, gönderiyorum 📄'], () => {
            addSys(`<div class="msn-ft"><b>Efe Hamdioğlu</b> size "<b>Osman_Efe_Hamdioglu_CV.pdf</b>" (264 KB) dosyasını göndermek istiyor.<br><a href="#" data-act="ft-accept">Kabul Et</a> (Alt+C) &nbsp; <a href="#" data-act="ft-decline">Reddet</a> (Alt+D)</div>`);
          });
        }
        function reply(key) {
          if (key === 'nudge') return nudge(false);
          if (key === 'cv') return offerFile();
          efeSay(REPLIES[key] || REPLIES.fallback);
        }
        function send(text, key) {
          text = text.trim();
          if (!text) return;
          addMsg('me', esc(text).replace(/\n/g, '<br>'));
          unlock('msn');
          if (!key) {
            const n = norm(text);
            key = (INTENTS.find(([, re]) => re.test(n)) || ['fallback'])[0];
          }
          reply(key);
        }

        $('.msn-quick', body).innerHTML = QUICK.map(([t, k]) => `<button type="button" data-k="${k}">${esc(t)}</button>`).join('');
        $('.msn-quick', body).addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) send(b.textContent, b.dataset.k); });
        $('.msn-send', body).addEventListener('click', () => { send(input.value); input.value = ''; input.focus(); });
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); input.value = ''; } });
        $('.msn-nudge', body).addEventListener('click', () => nudge(false));
        $('.msn-emo', body).addEventListener('click', () => { input.value += '😊'; input.focus(); });
        $('.msn-font', body).addEventListener('click', () => WM.dialog({ title: 'Yazı Tipi', icon: 'info', message: 'Yazı tipi: Tahoma, 10 pt.\n\nLütfen Comic Sans seçmeyin. 🙏' }));
        $('.msn-tools', body).addEventListener('click', (e) => {
          const t = e.target.closest('button')?.dataset.t;
          if (t === 'Oyunlar') return Apps.minesweeper();
          if (t === 'Etkinlikler') return Apps.paint();
          if (t === 'Dosya Gönder') return addSys('Dosya göndermek için önce Efe\'yi işe almanız gerekiyor. 😄');
          if (t === 'Davet Et') return addSys('Birini davet etmek için bu sayfanın adresini paylaşın. 😉');
          if (t) addSys(`Efe'nin ${t === 'Video' ? 'web kamerası' : 'mikrofonu'} şu anda kapalı. Görüşme ayarlamak için: ${mailLink()}`);
        });
        log.addEventListener('click', (e) => {
          const a = e.target.closest('a[data-act]');
          if (!a) return;
          e.preventDefault();
          const act = a.dataset.act;
          if (act === 'mail') location.href = 'mailto:' + CV.email;
          else if (act.startsWith('url:')) Apps.openExternal(act.slice(4));
          else if (act.startsWith('file:')) { const f = CV_FILES.find((x) => x.name === act.slice(5)); if (f) Apps.notepad(f); }
          else if (act === 'ft-accept' || act === 'ft-decline') {
            const box = a.closest('.msn-ft');
            if (act === 'ft-decline') {
              box.innerHTML = '"Osman_Efe_Hamdioglu_CV.pdf" dosyasının aktarımını reddettiniz.';
              return efeSay(['tamam 🙂 fikrin değişirse CV masaüstünde duruyor']);
            }
            box.innerHTML = 'Aktarılıyor: Osman_Efe_Hamdioglu_CV.pdf <div class="msn-ftbar"><i></i></div>';
            requestAnimationFrame(() => box.querySelector('i').style.width = '100%');
            setTimeout(() => {
              box.innerHTML = '"Osman_Efe_Hamdioglu_CV.pdf" dosyasının aktarımı tamamlandı. <a href="#" data-act="ft-open">Aç</a>';
              unlock('pdf');
            }, 1700);
          } else if (act === 'ft-open') Apps.pdf({ direct: true });
        });

        addSys(`Efe Hamdioğlu şu anda <b>otomatik yanıt</b> modunda: cevaplar CV'den geliyor. Gerçek bir mesaj için ${mailLink('e-posta gönderin')}.`);
        efeSay(['selam! 👋 ben Efe.', 'CV sitemi gezdiğin için teşekkürler. merak ettiğini sor ya da aşağıdan bir soru seç 🙂']);
        setTimeout(() => input.focus({ preventScroll: true }), 60);
      },
    });
  }

  /* ================= IE indirme penceresi ================= */
  function download() {
    const file = 'Osman_Efe_Hamdioglu_CV.pdf';
    const host = location.host || 'windowscv.vercel.app';
    return WM.open({
      id: 'download',
      title: `%0 / ${file} Tamamlandı`,
      icon: ICONS.ie,
      resizable: false,
      center: true,
      width: 420,
      render(body, w) {
        body.innerHTML = `
          <div class="dl">
            <div class="dl-anim"><img src="${ICONS.ie}" alt=""><div class="dl-fly"><i></i><i></i><i></i></div><img src="${ICONS.folder}" alt=""></div>
            <div class="dl-title">Kaydediliyor:</div>
            <div>${file}, ${esc(host)} adresinden</div>
            <div class="dl-bar"><i></i></div>
            <dl>
              <dt>Tahmini kalan süre:</dt><dd class="dl-left">Hesaplanıyor...</dd>
              <dt>Karşıdan yükleme hedefi:</dt><dd>C:\\Documents and Settings\\Ziyaretçi\\Masaüstü</dd>
              <dt>Aktarım hızı:</dt><dd class="dl-rate">—</dd>
            </dl>
            <label class="dl-check"><input type="checkbox"> Karşıdan yükleme tamamlandığında bu iletişim kutusunu kapat</label>
            <div class="dlg-btns" style="justify-content:flex-end"><button class="xp-btn dl-open" type="button" disabled>Aç</button><button class="xp-btn dl-folder" type="button" disabled>Klasörü Aç</button><button class="xp-btn dl-cancel" type="button">İptal</button></div>
          </div>`;
        const bar = $('.dl-bar i', body), leftEl = $('.dl-left', body), rateEl = $('.dl-rate', body), cancel = $('.dl-cancel', body);
        const STEPS = [
          [8, '3 gün 4 saat (12 bayt / 264 KB kopyalandı)', '0,1 KB/sn'],
          [21, '14 saniye (56 KB / 264 KB kopyalandı)', '88,2 KB/sn'],
          [34, '2 saat 17 dakika (90 KB / 264 KB kopyalandı)', '0,4 KB/sn'],
          [58, '4 saniye (153 KB / 264 KB kopyalandı)', '412 KB/sn'],
          [71, '1 yıl 3 ay (188 KB / 264 KB kopyalandı)', '0,0 KB/sn'],
          [93, '1 saniye (246 KB / 264 KB kopyalandı)', '1,2 MB/sn'],
        ];
        let i = 0, done = false;
        const timer = setInterval(() => {
          if (!w.el.isConnected) return clearInterval(timer);
          if (i < STEPS.length) {
            const [p, left, rate] = STEPS[i++];
            bar.style.width = p + '%';
            leftEl.textContent = left;
            rateEl.textContent = rate;
            w.setTitle(`%${p} / ${file} Tamamlandı`);
            return;
          }
          clearInterval(timer);
          done = true;
          bar.style.width = '100%';
          body.classList.add('dl-done');
          w.setTitle('Karşıdan Yükleme Tamamlandı');
          $('.dl-title', body).textContent = 'Karşıdan Yükleme Tamamlandı';
          leftEl.textContent = '264 KB, 3 sn içinde karşıdan yüklendi';
          rateEl.textContent = '88,0 KB/sn';
          cancel.textContent = 'Kapat';
          $('.dl-open', body).disabled = $('.dl-folder', body).disabled = false;
          const a = document.createElement('a');
          a.href = CV.pdf;
          a.download = file;
          document.body.appendChild(a);
          a.click();
          a.remove();
          unlock('pdf');
          if ($('.dl-check input', body).checked) w.close();
        }, 520);
        cancel.addEventListener('click', () => w.close());
        $('.dl-open', body).addEventListener('click', () => { Apps.openExternal(CV.pdf); w.close(); });
        $('.dl-folder', body).addEventListener('click', () => { Apps.explorer('Masaüstü'); w.close(); });
        w.onClose = () => { clearInterval(timer); return true; };
        void done;
      },
    });
  }

  /* ================= Gece Bliss ================= */
  function sky() {
    let el = $('#sky');
    if (!el) {
      el = document.createElement('div');
      el.id = 'sky';
      const stars = Array.from({ length: 140 }, () => {
        const x = (Math.random() * 100).toFixed(2), y = (Math.random() * 52).toFixed(2), a = (0.35 + Math.random() * 0.65).toFixed(2);
        return `${x}vw ${y}vh 0 ${Math.random() < 0.15 ? 1 : 0}px rgba(255,255,255,${a})`;
      }).join(',');
      el.innerHTML = `<div class="stars" style="box-shadow:${stars}"></div><div class="moon"></div>`;
      desk().insertBefore(el, $('#icons'));
    }
    const d = new Date(), m = d.getHours() * 60 + d.getMinutes();
    const phase = m < 330 || m >= 1170 ? 'night' : m < 450 ? 'dawn' : m >= 1050 ? 'dusk' : 'day';
    desk().dataset.sky = phase;
    if (phase === 'night') unlock('night');
  }
  setInterval(() => $('#sky') && sky(), 5 * 60 * 1000);

  /* ================= Masaüstü açılınca ================= */
  let scheduled = false;
  function desktopShown() {
    sky();
    if (local.get('xpcv-lost')) { local.remove('xpcv-lost'); unlock('lost'); }
    if (scheduled) return;
    scheduled = true;
    setTimeout(signIn, 40000);
    setTimeout(newHardware, 95000);
  }

  function newHardware() {
    if (session.get('xpcv-hw')) return;
    if (!onDesktop() || explorerDead || busyCorner()) return setTimeout(newHardware, 4000);
    session.set('xpcv-hw', '1');
    XP.balloon('Yeni donanım bulundu', 'İşe Alım Uzmanı (İK)', 4500, 'hardware');
    setTimeout(() => {
      if (onDesktop() && !busyCorner()) XP.balloon('Yeni donanım bulundu', 'Yeni donanımınız yüklendi ve kullanıma hazır. 🙂', 6500, 'hardware');
    }, 5200);
  }

  /* ================= Küçük dokunuşlar ================= */
  // Ağ kablosu
  function netChanged() {
    const off = !navigator.onLine;
    $('.tray-net')?.classList.toggle('off', off);
    $('#tray-network')?.setAttribute('title', off ? 'Yerel Ağ Bağlantısı: Ağ kablosu çıkarıldı' : 'Yerel Ağ Bağlantısı: Bağlandı — 100 Mb/sn');
  }
  window.addEventListener('offline', () => {
    netChanged();
    unlock('offline');
    if (onDesktop() && window.XP) XP.balloon('Yerel Ağ Bağlantısı', 'Ağ kablosu çıkarıldı.', 9000, 'network');
  });
  window.addEventListener('online', () => {
    netChanged();
    if (onDesktop() && window.XP) XP.balloon('Yerel Ağ Bağlantısı artık bağlı', 'Hız: 100,0 Mb/sn', 6000, 'network');
  });
  netChanged();

  // Sekme başlığı
  const baseTitle = document.title;
  let hiddenAt = 0, titleTimer = null;
  document.addEventListener('visibilitychange', () => {
    clearTimeout(titleTimer);
    if (document.hidden) {
      hiddenAt = Date.now();
      document.title = baseTitle + ' (Yanıt Vermiyor)';
    } else if (Date.now() - hiddenAt > 1500 && onDesktop()) {
      document.title = 'Tekrar hoş geldiniz! 👋';
      unlock('tabAway');
      titleTimer = setTimeout(() => (document.title = baseTitle), 2500);
    } else document.title = baseTitle;
  });

  // Yazdırma: XP masaüstü yerine sade CV
  function buildPrint() {
    const el = document.createElement('div');
    el.id = 'print-cv';
    const block = (text) => {
      const out = [];
      let para = [], list = [];
      // Çok satırlı bloğun ilk satırı (pozisyon, proje, okul adı) kalın
      const paraHtml = () => para.map((l, i) => (i === 0 && para.length > 1 && !l.includes(' : ') ? `<b>${esc(l)}</b>` : esc(l))).join('<br>');
      const flush = () => {
        if (para.length) out.push(`<p>${paraHtml()}</p>`);
        if (list.length) out.push(`<ul>${list.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`);
        para = []; list = [];
      };
      const lines = text.split('\n');
      lines.forEach((line, i) => {
        const next = lines[i + 1] || '';
        if (/^[=-]{3,}$/.test(line.trim())) return;
        if (/^-{3,}$/.test(next.trim())) { flush(); out.push(`<h3>${esc(line.trim())}</h3>`); return; }
        const sub = /^\[(.+)\]$/.exec(line.trim());
        if (sub) { flush(); out.push(`<h4>${esc(sub[1])}</h4>`); return; }
        const li = /^\s*\*\s+(.*)$/.exec(line);
        if (li) { if (para.length) { out.push(`<p>${paraHtml()}</p>`); para = []; } list.push(li[1]); return; }
        if (!line.trim()) return flush();
        if (list.length) flush();
        para.push(line.trim());
      });
      flush();
      return out.join('');
    };
    const body = (name) => CV_FILES.find((f) => f.name === name)?.text || '';
    const about = (body('Hakkımda.txt').split(/HAKKIMDA\s*\n-+\s*\n/)[1] || '').split('Diğer bölümler')[0];
    const section = (title, text) => `<section><h2>${esc(title)}</h2>${block(text)}</section>`;
    const strip = (name) => body(name).split('\n').slice(2).join('\n');
    el.innerHTML = `
      <header>
        <h1>${esc(CV.name)}</h1>
        <div class="pc-title">${esc(CV.title)} · Ankara, Türkiye</div>
        <div class="pc-contact">${esc(CV.email)} · ${esc(CV.phone)} · ${esc(CV.website.replace('https://', ''))} · ${esc(CV.linkedin.replace('https://', ''))} · ${esc(CV.github.replace('https://', ''))}</div>
      </header>
      ${section('Hakkımda', about)}
      ${section('İş Deneyimi', strip('İş Deneyimi.txt').split('(Stajlarım')[0])}
      ${section('Stajlar', strip('Stajlar.txt'))}
      ${section('Seçilmiş Projeler', strip('Projeler.txt'))}
      ${section('Teknik Yetkinlikler', strip('Yetenekler.txt'))}
      ${section('Eğitim', strip('Eğitim.txt'))}
      ${section('İlgi Alanları', strip('İlgi Alanları.txt'))}
      <footer>Bu CV, ${esc(location.host || 'windowscv.vercel.app')} adresindeki interaktif Windows XP masaüstünden yazdırıldı.</footer>`;
    document.body.appendChild(el);
  }
  buildPrint();
  window.addEventListener('beforeprint', () => unlock('print'));

  // Geliştirici konsolu
  window.efe = {
    hire() {
      unlock('console');
      return `📬 Harika seçim! ${CV.email} · ${CV.linkedin}`;
    },
    cv() { Apps.pdf({ direct: true }); return 'CV yeni sekmede açılıyor...'; },
    toString() { return 'efe.hire() yazmayı dene 😉'; },
  };
  setTimeout(() => {
    const b = (c) => `background:${c};color:${c};font-size:14px;line-height:1.1`;
    console.log('%c██%c██\n%c██%c██', b('#f25022'), b('#7fba00'), b('#00a4ef'), b('#ffb900'));
    console.log('%cWindows XP — CV Edition', 'font:bold 20px "Trebuchet MS",sans-serif;color:#245edb');
    console.log(`%cKonsolu açtıysan sen de bir geliştiricisin 👋\nBirlikte bir şeyler yapalım: ${CV.email}\n\nİpucu: efe.hire() yazmayı dene.`, 'font:13px Tahoma,sans-serif;color:#333');
  }, 1200);

  // Konami kodu → Windows Klasik
  const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  let kpos = 0;
  document.addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, [contenteditable="true"]')) return;
    const k = e.key.toLowerCase();
    kpos = k === KONAMI[kpos] ? kpos + 1 : k === KONAMI[0] ? 1 : 0;
    if (kpos < KONAMI.length) return;
    kpos = 0;
    const on = document.body.classList.toggle('classic');
    unlock('konami');
    if (onDesktop()) XP.balloon('Görünüm değiştirildi', on ? 'Tema: Windows Klasik.\nLuna\'ya dönmek için kodu yeniden girin.' : 'Tema: Windows XP (Luna).', 6000, 'control');
  });

  // Ctrl+Alt+Del / Ctrl+Shift+Esc (işletim sisteminin yakalamadığı yerlerde)
  document.addEventListener('keydown', (e) => {
    if (!onDesktop()) return;
    if ((e.ctrlKey && e.altKey && (e.key === 'Delete' || e.key === 'Backspace')) || (e.ctrlKey && e.shiftKey && e.key === 'Escape')) {
      e.preventDefault();
      taskmgr();
    }
  });

  // Görev çubuğu sağ tık menüsü
  $('#taskbar').addEventListener('contextmenu', (e) => {
    if (e.target.closest('.task-btn, #start-btn')) return;
    e.preventDefault();
    e.stopPropagation();
    WM.contextMenu(e.clientX, e.clientY, [
      { label: 'Araç Çubukları', disabled: true },
      '-',
      { label: 'Pencereleri Basamakla', disabled: true },
      { label: 'Pencereleri Yatay Döşe', disabled: true },
      { label: 'Masaüstünü Göster', action: () => WM.minimizeAll() },
      '-',
      { label: 'Görev Yöneticisi', action: taskmgr },
      '-',
      { label: 'Görev Çubuğunu Kilitle', checked: true, disabled: true },
      { label: 'Özellikler', disabled: true },
    ]);
  });

  // Tepsideki MSN simgesi
  const trayMsn = $('#tray-msn');
  if (trayMsn) {
    trayMsn.src = ICONS.msn;
    trayMsn.addEventListener('click', () => msnMain());
  }

  return {
    unlock, read, achievements, taskmgr, bsod, blaster, abortShutdown, msnMain, msnChat, download,
    desktopShown, reset, restoreExplorer, explorerDead: () => explorerDead,
  };
})();

// Diğer dosyalar window.Extras?.… ile güvenle çağırabilsin (const global, window üzerinde değildir)
window.Extras = Extras;
