/* ============================================================
 * SIAKAD Mini FTI UNG — js/ui.js
 * Layout (sidebar + topbar), Toast, Modal, Ikon, dan Helper UI.
 * ============================================================ */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------
   * Ikon (heroicons outline, stroke 1.5)
   * ------------------------------------------------------------ */
  const ICON_PATHS = {
    grid: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
    clipboard: 'M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.03.75.057 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75',
    chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    usergroup: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    pencil: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    logout: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
    menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
    search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    plus: 'M12 4.5v15m7.5-7.5h-15',
    trash: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
    x: 'M6 18L18 6M6 6l12 12',
    cap: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    eye: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    eyeOff: 'M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243',
    shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    check: 'M4.5 12.75l6 6 9-13.5',
    refresh: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
    info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
    building: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21'
  };

  function icon(name, cls) {
    const d = ICON_PATHS[name] || ICON_PATHS.grid;
    return '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6" stroke="currentColor" class="' + (cls || 'h-5 w-5') + '" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="' + d + '"/></svg>';
  }

  /* ------------------------------------------------------------
   * Helper dasar
   * ------------------------------------------------------------ */
  const TONE = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    orange: 'bg-orange-50 text-orange-700 ring-orange-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    violet: 'bg-violet-50 text-violet-700 ring-violet-200'
  };

  const UI = {
    icon: icon,

    esc: function (val) {
      return String(val == null ? '' : val)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },

    fmt: function (n, digits) {
      const v = Number(n) || 0;
      return v.toFixed(digits == null ? 2 : digits);
    },

    tanggalPendek: function (iso) {
      try {
        const d = iso ? new Date(iso) : new Date();
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
      } catch (e) { return '-'; }
    },

    jamSekarang: function () {
      return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
    },

    inisial: function (nama) {
      const parts = String(nama || '?').trim().split(/\s+/);
      const a = parts[0] ? parts[0][0] : '';
      const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
      return (a + b).toUpperCase();
    },

    badge: function (text, tone) {
      return '<span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ' + (TONE[tone] || TONE.slate) + '">' + UI.esc(text) + '</span>';
    },

    gradeBadge: function (grade) {
      const map = { 'A': 'emerald', 'A-': 'blue', 'B+': 'sky', 'B': 'sky', 'C+': 'amber', 'C': 'amber', 'D': 'orange', 'E': 'red' };
      return '<span class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold ring-1 ' + (TONE[map[grade]] || TONE.slate) + '">' + UI.esc(grade || '-') + '</span>';
    },

    /* Kartu statistik */
    statCard: function (opts) {
      opts = opts || {};
      const tone = opts.tone || 'blue';
      const toneBg = {
        blue: 'from-blue-500 to-blue-700',
        emerald: 'from-emerald-500 to-emerald-700',
        violet: 'from-violet-500 to-violet-700',
        amber: 'from-amber-400 to-amber-600',
        sky: 'from-sky-500 to-sky-700',
        rose: 'from-rose-500 to-rose-700'
      }[tone] || 'from-blue-500 to-blue-700';
      return '' +
        '<div class="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70 transition hover:-translate-y-0.5 hover:shadow-pop">' +
        '  <div class="flex items-start justify-between gap-3">' +
        '    <div>' +
        '      <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">' + UI.esc(opts.label || '') + '</p>' +
        '      <p class="mt-2 text-2xl font-extrabold text-slate-800">' + (opts.valueHtml != null ? opts.valueHtml : UI.esc(opts.value)) + '</p>' +
        '      <p class="mt-1 text-xs text-slate-400">' + UI.esc(opts.sub || '') + '</p>' +
        '    </div>' +
        '    <div class="rounded-xl bg-gradient-to-br ' + toneBg + ' p-3 text-white shadow-lg transition group-hover:scale-105">' + icon(opts.icon || 'chart', 'h-6 w-6') + '</div>' +
        '  </div>' +
        '</div>';
    },

    /* Kartu / panel berjudul */
    card: function (title, rightHtml, bodyHtml, extraClass) {
      return '' +
        '<section class="rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70 ' + (extraClass || '') + '">' +
        (title ? '<div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">' +
          '<h2 class="text-base font-bold text-slate-800">' + title + '</h2>' +
          (rightHtml || '') + '</div>' : '') +
        '<div class="p-5">' + (bodyHtml || '') + '</div>' +
        '</section>';
    },

    empty: function (title, desc, iconName) {
      return '' +
        '<div class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">' +
        '  <div class="mb-3 rounded-2xl bg-white p-4 text-slate-300 shadow-sm ring-1 ring-slate-200">' + icon(iconName || 'clipboard', 'h-8 w-8') + '</div>' +
        '  <p class="text-sm font-bold text-slate-600">' + UI.esc(title) + '</p>' +
        (desc ? '<p class="mt-1 max-w-sm text-xs text-slate-400">' + UI.esc(desc) + '</p>' : '') +
        '</div>';
    },

    /* ------------------------------------------------------------
     * Toast
     * ------------------------------------------------------------ */
    toast: function (message, type, duration) {
      const root = document.getElementById('toast-root');
      if (!root) { console.log('[TOAST]', message); return; }
      const t = type || 'success';
      const cfg = {
        success: { wrap: 'border-emerald-500/60 bg-white', iconBg: 'bg-emerald-500', icon: 'check', title: 'Berhasil' },
        error: { wrap: 'border-red-500/60 bg-white', iconBg: 'bg-red-500', icon: 'x', title: 'Gagal' },
        warning: { wrap: 'border-amber-500/60 bg-white', iconBg: 'bg-amber-500', icon: 'info', title: 'Perhatian' },
        info: { wrap: 'border-blue-500/60 bg-white', iconBg: 'bg-blue-500', icon: 'info', title: 'Informasi' }
      }[t] || { wrap: 'border-slate-300 bg-white', iconBg: 'bg-slate-500', icon: 'info', title: 'Info' };

      const el = document.createElement('div');
      el.className = 'toast-item pointer-events-auto flex w-full items-start gap-3 rounded-xl border-l-4 p-4 shadow-pop ring-1 ring-slate-200 ' + cfg.wrap;
      el.setAttribute('role', 'status');
      el.innerHTML =
        '<span class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ' + cfg.iconBg + '">' + icon(cfg.icon, 'h-4 w-4') + '</span>' +
        '<div class="min-w-0 flex-1">' +
        '  <p class="text-sm font-bold text-slate-800">' + UI.esc(cfg.title) + '</p>' +
        '  <p class="mt-0.5 break-words text-xs font-medium text-slate-500">' + UI.esc(message) + '</p>' +
        '</div>' +
        '<button type="button" class="toast-close rounded-md p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500" aria-label="Tutup">' + icon('x', 'h-4 w-4') + '</button>';

      el.querySelector('.toast-close').addEventListener('click', function () { UI._dismissToast(el); });
      root.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('show'); });
      setTimeout(function () { UI._dismissToast(el); }, duration || 3600);
    },

    _dismissToast: function (el) {
      if (!el || !el.parentNode) return;
      el.classList.remove('show');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 280);
    },

    /* ------------------------------------------------------------
     * Modal
     * ------------------------------------------------------------ */
    modal: function (opts) {
      opts = opts || {};
      const root = document.getElementById('modal-root');
      if (!root) return null;
      const size = opts.size || 'max-w-lg';
      root.innerHTML =
        '<div class="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" data-modal-backdrop></div>' +
        '<div class="relative flex min-h-full items-center justify-center p-4">' +
        '  <div class="modal-card w-full ' + size + ' max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-pop">' +
        '    <div class="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">' +
        '      <h3 class="text-base font-bold text-slate-800">' + (opts.title || 'Dialog') + '</h3>' +
        '      <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" data-modal-close aria-label="Tutup">' + icon('x', 'h-5 w-5') + '</button>' +
        '    </div>' +
        '    <div class="max-h-[62vh] overflow-y-auto px-5 py-4">' + (opts.body || '') + '</div>' +
        (opts.footer ? '<div class="flex flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3">' + opts.footer + '</div>' : '') +
        '  </div>' +
        '</div>';
      root.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');

      root.querySelectorAll('[data-modal-close]').forEach(function (b) {
        b.addEventListener('click', function (e) { e.preventDefault(); UI.closeModal(); });
      });

      setTimeout(function () {
        const first = root.querySelector('input, select, textarea');
        if (first) { try { first.focus(); } catch (e) { /* abaikan */ } }
      }, 60);

      return root;
    },

    closeModal: function () {
      const root = document.getElementById('modal-root');
      if (!root) return;
      root.innerHTML = '';
      root.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    },

    /* Konfirmasi aksi destruktif */
    confirm: function (opts) {
      opts = opts || {};
      UI.modal({
        title: opts.title || 'Konfirmasi',
        size: 'max-w-md',
        body:
          '<div class="flex items-start gap-3">' +
          '  <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ' + (opts.danger === false ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600') + '">' + icon(opts.danger === false ? 'info' : 'trash', 'h-5 w-5') + '</span>' +
          '  <p class="text-sm leading-relaxed text-slate-600">' + (opts.message || 'Lanjutkan aksi ini?') + '</p>' +
          '</div>',
        footer:
          '<button type="button" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" data-modal-close>Batal</button>' +
          '<button type="button" id="btn-confirm-yes" class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition ' + (opts.danger === false ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700') + '">' + (opts.yaLabel || 'Ya, Lanjutkan') + '</button>'
      });
      const btn = document.getElementById('btn-confirm-yes');
      if (btn) {
        btn.addEventListener('click', function () {
          UI.closeModal();
          if (typeof opts.onYes === 'function') opts.onYes();
        });
      }
    },

    /* ------------------------------------------------------------
     * Layout: Sidebar + Topbar
     * ------------------------------------------------------------ */
    MENUS: {
      mahasiswa: [
        { route: '#mhs-dashboard', label: 'Dashboard', icon: 'grid' },
        { route: '#mhs-jadwal', label: 'Jadwal Kuliah', icon: 'calendar' },
        { route: '#mhs-krs', label: 'Kontrak KRS', icon: 'clipboard' },
        { route: '#mhs-khs', label: 'Transkrip Nilai', icon: 'chart' }
      ],
      dosen: [
        { route: '#dsn-dashboard', label: 'Dashboard', icon: 'grid' },
        { route: '#dsn-mahasiswa', label: 'Data Mahasiswa', icon: 'usergroup' },
        { route: '#dsn-nilai', label: 'Kelola & Input Nilai', icon: 'pencil' }
      ],
      admin: [
        { route: '#adm-dashboard', label: 'Dashboard', icon: 'grid' },
        { route: '#adm-mahasiswa', label: 'Data Mahasiswa', icon: 'usergroup' },
        { route: '#adm-dosen', label: 'Data Dosen', icon: 'users' },
        { route: '#adm-matakuliah', label: 'Data Mata Kuliah', icon: 'book' }
      ]
    },

    ROLE_LABEL: { mahasiswa: 'Mahasiswa', dosen: 'Dosen', admin: 'Administrator' },
    ROLE_TONE: { mahasiswa: 'bg-blue-50 text-blue-700 ring-blue-200', dosen: 'bg-emerald-50 text-emerald-700 ring-emerald-200', admin: 'bg-amber-50 text-amber-700 ring-amber-200' },

    renderLayout: function (session, activeRoute) {
      const sidebar = document.getElementById('sidebar');
      const topbar = document.getElementById('topbar');
      if (!sidebar || !topbar || !session) return;

      const menus = UI.MENUS[session.role] || [];
      const roleLabel = UI.ROLE_LABEL[session.role] || session.role;
      const tone = UI.ROLE_TONE[session.role] || UI.ROLE_TONE.mahasiswa;

      /* ----- Sidebar ----- */
      const navHtml = menus.map(function (m) {
        const active = m.route === activeRoute;
        return '<a href="' + m.route + '" data-nav="' + m.route + '" class="nav-link' + (active ? ' active' : '') + '">' +
          icon(m.icon, 'h-5 w-5 shrink-0') +
          '<span>' + UI.esc(m.label) + '</span>' +
          '</a>';
      }).join('');

      /* Sidebar bergaya TERANG: buang kelas latar gelap & teks putih dari <aside> */
      sidebar.classList.remove('bg-gradient-to-b', 'from-fti-950', 'via-fti-900', 'to-fti-800', 'bg-slate-900', 'text-white');
      sidebar.classList.add('bg-white', 'text-slate-800', 'border-r', 'border-slate-200');
      sidebar.innerHTML =
        '<div class="flex h-full flex-col bg-white">' +
        /* Brand */
        '  <div class="flex items-center gap-3 px-5 pb-5 pt-6">' +
        '    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-fti-950 shadow-lg">' + icon('cap', 'h-6 w-6') + '</div>' +
        '    <div class="min-w-0">' +
        '      <p class="truncate text-sm font-extrabold tracking-tight text-slate-900">SIAKAD Mini</p>' +
        '      <p class="truncate text-[11px] font-medium text-slate-500">FTI · Universitas Negeri Gorontalo</p>' +
        '    </div>' +
        '  </div>' +
        /* Profil */
        '  <div class="mx-4 mb-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">' +
        '    <div class="flex items-center gap-3">' +
        '      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fti-700 text-sm font-extrabold text-white ring-1 ring-fti-200">' + UI.esc(UI.inisial(session.nama)) + '</div>' +
        '      <div class="min-w-0">' +
        '        <p class="truncate text-sm font-bold text-slate-800">' + UI.esc(session.nama) + '</p>' +
        '        <span class="mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ' + tone + '">' + UI.esc(roleLabel) + ' · ' + UI.esc(session.id) + '</span>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        /* Nav */
        '  <nav class="flex-1 space-y-1 overflow-y-auto px-4 pb-4">' +
        '    <p class="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">Menu Utama</p>' +
        navHtml +
        '  </nav>' +
        /* Logout */
        '  <div class="border-t border-slate-200 p-4">' +
        '    <button type="button" data-action="logout" class="flex w-full items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-600 hover:text-white">' +
        icon('logout', 'h-5 w-5') + '<span>Logout</span>' +
        '    </button>' +
        '    <p class="mt-3 text-center text-[10px] text-slate-400">Tahun Akademik ' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</p>' +
        '  </div>' +
        '</div>';

      /* ----- Topbar ----- */
      const current = menus.find(function (m) { return m.route === activeRoute; });
      topbar.innerHTML =
        '<div class="flex items-center gap-3 px-4 py-3 md:px-6">' +
        '  <button type="button" data-action="toggle-sidebar" class="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden" aria-label="Buka menu">' + icon('menu', 'h-5 w-5') + '</button>' +
        '  <div class="min-w-0 flex-1">' +
        '    <p class="truncate text-base font-extrabold tracking-tight text-slate-800 md:text-lg">' + UI.esc(current ? current.label : 'SIAKAD Mini') + '</p>' +
        '    <p class="hidden truncate text-xs text-slate-400 sm:block">Selamat datang, ' + UI.esc(session.nama) + ' · ' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</p>' +
        '  </div>' +
        '  <span class="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">' +
        '<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span> Sistem Aktif' +
        '  </span>' +
        '  <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-fti-600 to-fti-800 text-xs font-extrabold text-white ring-2 ring-white shadow md:hidden">' + UI.esc(UI.inisial(session.nama)) + '</span>' +
        '</div>';
    },

    toggleSidebar: function (forceOpen) {
      const sidebar = document.getElementById('sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (!sidebar) return;
      const open = forceOpen != null ? forceOpen : sidebar.classList.contains('-translate-x-full');
      sidebar.classList.toggle('-translate-x-full', !open);
      if (backdrop) backdrop.classList.toggle('hidden', !open);
    },

    /* Kartu error halaman (mencegah layar putih) */
    errorPage: function (err) {
      const msg = (err && (err.stack || err.message)) || String(err);
      return '' +
        '<div class="page-enter mx-auto max-w-2xl">' +
        '  <div class="rounded-2xl border border-red-200 bg-white p-6 shadow-card">' +
        '    <div class="flex items-start gap-4">' +
        '      <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">' + icon('shield', 'h-6 w-6') + '</span>' +
        '      <div class="min-w-0">' +
        '        <h2 class="text-lg font-extrabold text-slate-800">Ups, terjadi kesalahan saat memuat halaman</h2>' +
        '        <p class="mt-1 text-sm text-slate-500">Aplikasi tetap berjalan. Coba muat ulang halaman atau kembali ke dashboard.</p>' +
        '        <pre class="mt-3 max-h-40 overflow-auto rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-red-600 ring-1 ring-slate-200">' + UI.esc(msg) + '</pre>' +
        '        <div class="mt-4 flex flex-wrap gap-2">' +
        '          <button type="button" onclick="location.reload()" class="rounded-xl bg-fti-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fti-700">Muat Ulang</button>' +
        '          <button type="button" data-action="logout" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Logout</button>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';
    }
  };

  global.UI = UI;

})(typeof window !== 'undefined' ? window : globalThis);
