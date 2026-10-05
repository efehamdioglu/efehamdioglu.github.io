/* Simgeler: gerçek Windows XP simgeleri (assets/icons — kaynak: softwarehistorysociety/XPIcons ve ShizukuIchi/winXP).
   XP'de karşılığı olmayanlar (PDF, GitHub, LinkedIn, VS Code) kendi kapsamlı SVG'leri olan data URI. */
const ICONS = (() => {
  const wrap = (body) =>
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${body}</svg>`);

  const real = [
    'txt', 'doc', 'computer', 'folder', 'mydocs', 'recycle', 'recycleFull', 'ie', 'notepad', 'mine', 'paint', 'cmd',
    'drive', 'cd', 'info', 'error', 'warning', 'question', 'help', 'search', 'run', 'control', 'pictures', 'music',
    'email', 'logoff', 'power', 'standby', 'restart', 'switchUser', 'arrowGreen', 'back', 'forward', 'up', 'views',
    'refresh', 'stop', 'home', 'favorites', 'speaker', 'network', 'shield', 'desktopShow', 'flag', 'user',
  ];
  const icons = Object.fromEntries(real.map((n) => [n, `assets/icons/${n}.png`]));
  icons.flagTile = 'assets/icons/flag-tile.png';

  icons.pdf = wrap(`
    <defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#dde4ef"/></linearGradient></defs>
    <path d="M9 3.5h21.5l9 9v32H9z" fill="url(#p)" stroke="#7d8ba0"/>
    <path d="M30.5 3.5v9h9" fill="#eef2f8" stroke="#7d8ba0" stroke-linejoin="round"/>
    <path d="M14 14h19M14 18h19" stroke="#b0b8c6" stroke-width="1.5"/>
    <rect x="5" y="24" width="30" height="13" rx="1.5" fill="#d8231c"/>
    <text x="20" y="34" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="10" fill="#fff">PDF</text>`);

  icons.github = wrap(`
    <circle cx="24" cy="24" r="20" fill="#24292f"/>
    <path fill="#fff" d="M24 11c-7.2 0-13 5.8-13 13 0 5.7 3.7 10.6 8.9 12.3.7.1.9-.3.9-.6v-2.3c-3.6.8-4.4-1.6-4.4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3.1 1.4 3.8 1.1.1-.8.5-1.4.8-1.8-2.9-.3-5.9-1.4-5.9-6.4 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.6.1-3.4 0 0 1.1-.3 3.6 1.3a12.4 12.4 0 0 1 6.5 0c2.5-1.7 3.6-1.3 3.6-1.3.7 1.8.3 3.1.1 3.4.8.9 1.3 2.1 1.3 3.5 0 5-3 6.1-5.9 6.4.5.4.9 1.2.9 2.4v3.6c0 .3.2.7.9.6A13 13 0 0 0 37 24c0-7.2-5.8-13-13-13z"/>`);

  icons.linkedin = wrap(`
    <rect x="4" y="4" width="40" height="40" rx="6" fill="#0a66c2"/>
    <rect x="11" y="19" width="6" height="18" fill="#fff"/>
    <circle cx="14" cy="13" r="3.5" fill="#fff"/>
    <path d="M21 19h5.5v2.6c1-1.7 3-3 5.8-3 5 0 5.7 3.3 5.7 7.5V37h-6v-9.3c0-2.2-.1-4.3-2.8-4.3-2.6 0-3 2-3 4.2V37H21z" fill="#fff"/>`);

  icons.vscode = wrap(`
    <defs>
      <linearGradient id="va" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a7fd6"/><stop offset="1" stop-color="#005ba1"/></linearGradient>
      <linearGradient id="vb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3ab0f7"/><stop offset="1" stop-color="#0a7fd0"/></linearGradient>
    </defs>
    <g transform="translate(2.5 2.6) scale(.43)">
      <path fill-rule="evenodd" fill="url(#va)" d="M70.9 99.3a6.2 6.2 0 0 0 5-.2l20.6-9.9a6.2 6.2 0 0 0 3.5-5.6V16.4a6.2 6.2 0 0 0-3.5-5.6L75.9.9a6.2 6.2 0 0 0-7.1 1.2L29.4 38 12.2 25a4.2 4.2 0 0 0-5.3.2l-5.5 5a4.2 4.2 0 0 0 0 6.2L16.2 50 1.4 63.6a4.2 4.2 0 0 0 0 6.2l5.5 5a4.2 4.2 0 0 0 5.3.2l17.2-13 39.4 35.9a6.2 6.2 0 0 0 2.1 1.4zM75 27.3 45.1 50 75 72.7z"/>
      <path fill="url(#vb)" d="M75 .7l21.5 10.1a6.2 6.2 0 0 1 3.5 5.6v67.2a6.2 6.2 0 0 1-3.5 5.6L75 99.3z"/>
    </g>`);

  icons.trophy = wrap(`
    <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".45" stop-color="#f5c518"/><stop offset="1" stop-color="#b8860b"/></linearGradient></defs>
    <path d="M13 8h22v8c0 7-4.5 12-11 12S13 23 13 16z" fill="url(#tg)" stroke="#8a6508"/>
    <path d="M13 11H7c0 6 3 9 7 9M35 11h6c0 6-3 9-7 9" fill="none" stroke="#b8860b" stroke-width="2.5"/>
    <path d="M21 28h6v6h-6z" fill="#d9a514" stroke="#8a6508"/>
    <path d="M15 34h18v6H15z" fill="url(#tg)" stroke="#8a6508"/>
    <path d="M17 11c0 5 1 9 4 11" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`);

  icons.taskmgr = wrap(`
    <rect x="4" y="6" width="40" height="29" rx="2" fill="#dfe6f1" stroke="#5b6b82"/>
    <rect x="7.5" y="9.5" width="33" height="22" fill="#000"/>
    <path d="M7.5 20.5h33M18.5 9.5v22M29.5 9.5v22" stroke="#006a2c"/>
    <path d="M8 27l5-6 4 3 5-9 5 7 4-11 4 6 5-4" fill="none" stroke="#2cff4c" stroke-width="2" stroke-linejoin="round"/>
    <path d="M18 35h12l2 6H16z" fill="#b9c4d4" stroke="#5b6b82"/>
    <rect x="12" y="41" width="24" height="3" rx="1" fill="#8e9bb0"/>`);

  icons.msn = wrap(`
    <circle cx="18" cy="13" r="7" fill="#37b44a" stroke="#1d7a2c"/>
    <path d="M5 38c0-9 6-15 13-15s13 6 13 15z" fill="#37b44a" stroke="#1d7a2c"/>
    <circle cx="31" cy="16" r="7" fill="#2f86e0" stroke="#1b5aa6"/>
    <path d="M18 42c0-9 6-15 13-15s13 6 13 15z" fill="#2f86e0" stroke="#1b5aa6"/>
    <circle cx="16" cy="11" r="2" fill="#fff" opacity=".6"/><circle cx="29" cy="14" r="2" fill="#fff" opacity=".6"/>`);

  icons.hardware = wrap(`
    <rect x="15" y="4" width="18" height="12" rx="1" fill="#c9d1dc" stroke="#6b7789"/>
    <rect x="19" y="7" width="3" height="4" fill="#6b7789"/><rect x="26" y="7" width="3" height="4" fill="#6b7789"/>
    <rect x="11" y="15" width="26" height="28" rx="3" fill="#3b73c7" stroke="#1f4a8a"/>
    <path d="M14 18h20" stroke="#8fb4ec" stroke-width="2"/>
    <circle cx="36" cy="36" r="9" fill="#2fa84f" stroke="#1d7a36"/>
    <path d="M31.5 36.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`);

  icons.visitor = wrap(`
    <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc3ff"/><stop offset="1" stop-color="#2b73d6"/></linearGradient></defs>
    <rect x="1" y="1" width="46" height="46" rx="4" fill="url(#vg)"/>
    <circle cx="24" cy="18" r="8" fill="#fff" opacity=".92"/>
    <path d="M9 44c1-10 7-16 15-16s14 6 15 16z" fill="#fff" opacity=".92"/>`);

  return icons;
})();
