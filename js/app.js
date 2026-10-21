/* ============================================================
 * SIAKAD Mini FTI UNG — js/app.js
 * Router (hash), Session, State global, dan Proteksi Error.
 *
 * Kunci LocalStorage:
 *   - Sesi  : siakad_fti_ung_session_v1
 *   - Basis : siakad_fti_ung_db_v1 (lihat js/data.js)
 * ============================================================ */
(function (global) {
  'use strict';

  const SESSION_KEY = 'siakad_fti_ung_session_v1';

  /* ------------------------------------------------------------
   * Session
   * ------------------------------------------------------------ */
  const Session = {
    key: SESSION_KEY,

    get: function () {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const s = JSON.parse(raw);
        return (s && s.role && s.id) ? s : null;
      } catch (e) {
        console.error('[SIAKAD] Gagal membaca sesi:', e);
        return null;
      }
    },

    set: function (session) {
      try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
      catch (e) { console.error('[SIAKAD] Gagal menyimpan sesi:', e); }
      return session;
    },

    destroy: function () {
      try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* abaikan */ }
    }
  };

  /* ------------------------------------------------------------
   * Peta Rute
   * ------------------------------------------------------------ */
  const ROUTES = {
    '#login': { roles: ['*'], title: 'Login', render: null }, /* ditangani khusus (full-screen) */
    '#mhs-dashboard': { roles: ['mahasiswa'], render: function (c) { MahasiswaPage.dashboard(c); } },
    '#mhs-jadwal': { roles: ['mahasiswa'], render: function (c) { MahasiswaPage.jadwal(c); } },
    '#mhs-krs': { roles: ['mahasiswa'], render: function (c) { MahasiswaPage.krs(c); } },
    '#mhs-khs': { roles: ['mahasiswa'], render: function (c) { MahasiswaPage.khs(c); } },
    '#dsn-dashboard': { roles: ['dosen'], render: function (c) { DosenPage.dashboard(c); } },
    '#dsn-mahasiswa': { roles: ['dosen'], render: function (c) { DosenPage.mahasiswa(c); } },
    '#dsn-nilai': { roles: ['dosen'], render: function (c) { DosenPage.nilai(c); } },
    '#adm-dashboard': { roles: ['admin'], render: function (c) { AdminPage.dashboard(c); } },
    '#adm-mahasiswa': { roles: ['admin'], render: function (c) { AdminPage.mahasiswa(c); } },
    '#adm-dosen': { roles: ['admin'], render: function (c) { AdminPage.dosen(c); } },
    '#adm-matakuliah': { roles: ['admin'], render: function (c) { AdminPage.matakuliah(c); } }
  };

  const DEFAULT_ROUTE = {
    mahasiswa: '#mhs-dashboard',
    dosen: '#dsn-dashboard',
    admin: '#adm-dashboard'
  };

  /* ------------------------------------------------------------
   * App — state, router, render
   * ------------------------------------------------------------ */
  const App = {
    state: { session: null, route: '#login' },

    defaultRoute: function (role) {
      return DEFAULT_ROUTE[role] || '#login';
    },

    init: function () {
      if (this._inited) { this.render(); return; }
      this._inited = true;

      try {
        DB.init(); /* siapkan & seed LocalStorage */
      } catch (e) {
        console.error('[SIAKAD] Gagal inisialisasi database:', e);
      }

      window.addEventListener('hashchange', function () { App.render(); });

      /* Delegasi klik global: navigasi, logout, toggle sidebar, backdrop */
      document.addEventListener('click', function (e) {
        const nav = e.target.closest('[data-nav]');
        if (nav) {
          e.preventDefault();
          App.navigate(nav.getAttribute('data-nav'));
          return;
        }
        const logoutBtn = e.target.closest('[data-action="logout"]');
        if (logoutBtn) {
          e.preventDefault();
          App.logout();
          return;
        }
        const toggleBtn = e.target.closest('[data-action="toggle-sidebar"]');
        if (toggleBtn) {
          e.preventDefault();
          UI.toggleSidebar();
          return;
        }
        const backdrop = e.target.closest('#sidebar-backdrop');
        if (backdrop) {
          UI.toggleSidebar(false);
        }
      });

      /* Escape menutup modal */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') UI.closeModal();
      });

      this.render();
    },

    navigate: function (route) {
      if (!route) return;
      if (location.hash === route) {
        this.render(); /* hash tidak berubah — render manual */
      } else {
        location.hash = route; /* memicu hashchange -> render */
      }
    },

    /* Render utama — dibungkus try-catch agar tidak pernah layar putih */
    render: function () {
      try {
        const session = Session.get();
        this.state.session = session;

        let route = location.hash || (session ? this.defaultRoute(session.role) : '#login');
        if (!ROUTES[route]) route = session ? this.defaultRoute(session.role) : '#login';

        /* Guard: belum login -> paksa halaman login (full-screen, sidebar tersembunyi) */
        if (!session) {
          if (route !== '#login') { location.hash = '#login'; return; }
          this.showLogin();
          return;
        }

        /* Guard: sudah login tapi membuka #login -> alihkan ke dashboard */
        if (route === '#login') { location.hash = this.defaultRoute(session.role); return; }

        /* Guard: rute bukan milik peran -> alihkan ke dashboard peran */
        const def = ROUTES[route];
        if (def.roles[0] !== '*' && def.roles.indexOf(session.role) === -1) {
          location.hash = this.defaultRoute(session.role);
          return;
        }

        this.showPage(route, session);
      } catch (err) {
        console.error('[SIAKAD] Error render:', err);
        this.renderError(err);
      }
    },

    /* Tampilan login full-screen: sembunyikan sidebar & app root */
    showLogin: function () {
      const appRoot = document.getElementById('app-root');
      const loginRoot = document.getElementById('login-root');
      if (appRoot) appRoot.classList.add('hidden');
      if (loginRoot) {
        loginRoot.classList.remove('hidden');
        LoginPage.mount(loginRoot);
      }
      this.state.route = '#login';
      document.title = 'Masuk — SIAKAD Mini FTI UNG';
    },

    /* Tampilan halaman aplikasi: tampilkan sidebar & kontainer */
    showPage: function (route, session) {
      const appRoot = document.getElementById('app-root');
      const loginRoot = document.getElementById('login-root');
      const container = document.getElementById('page-container');

      if (loginRoot) { loginRoot.innerHTML = ''; loginRoot.classList.add('hidden'); }
      if (appRoot) appRoot.classList.remove('hidden');
      if (!container) throw new Error('Kontainer #page-container tidak ditemukan.');

      /* Sidebar + topbar sesuai peran */
      UI.renderLayout(session, route);
      UI.toggleSidebar(false); /* tutup sidebar mobile saat pindah halaman */

      /* Render halaman (dibungkus try-catch per halaman) */
      container.innerHTML = '';
      try {
        const def = ROUTES[route];
        def.render(container);
      } catch (pageErr) {
        console.error('[SIAKAD] Error halaman ' + route + ':', pageErr);
        container.innerHTML = UI.errorPage(pageErr);
      }

      this.state.route = route;
      document.title = 'SIAKAD Mini FTI UNG';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /* Logout: hapus sesi, bersihkan kontainer UI, arahkan ke #login */
    logout: function () {
      try {
        Session.destroy(); /* hapus siakad_fti_ung_session_v1 */
        const container = document.getElementById('page-container');
        if (container) container.innerHTML = '';
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.innerHTML = '';
        const topbar = document.getElementById('topbar');
        if (topbar) topbar.innerHTML = '';
        UI.closeModal();
        UI.toast('Anda berhasil logout. Sampai jumpa! 👋', 'info');
      } catch (e) {
        console.error('[SIAKAD] Error saat logout:', e);
      } finally {
        this.navigate('#login');
      }
    },

    /* Halaman error ramah (anti layar putih) */
    renderError: function (err) {
      const appRoot = document.getElementById('app-root');
      const loginRoot = document.getElementById('login-root');
      const container = document.getElementById('page-container');
      if (appRoot) appRoot.classList.remove('hidden');
      if (loginRoot) { loginRoot.innerHTML = ''; loginRoot.classList.add('hidden'); }
      if (container) container.innerHTML = UI.errorPage(err);
    },

    getSession: function () {
      return Session.get();
    }
  };

  /* ------------------------------------------------------------
   * Export & bootstrap
   * ------------------------------------------------------------ */
  global.Session = Session;
  global.App = App;
  global.SIAKAD_ROUTES = ROUTES;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { App.init(); });
  } else {
    App.init();
  }

})(typeof window !== 'undefined' ? window : globalThis);
