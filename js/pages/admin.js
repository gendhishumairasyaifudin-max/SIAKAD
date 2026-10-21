/* ============================================================
 * SIAKAD Mini FTI UNG — js/pages/admin.js
 * Dashboard Admin + CRUD Data Master:
 *   - Mahasiswa  - Dosen  - Mata Kuliah
 * ============================================================ */
(function (global) {
  'use strict';

  function sessionAdmin() {
    const s = Session.get();
    if (!s || s.role !== 'admin') { App.navigate('#login'); return null; }
    return s;
  }

  const PRODI = ['Teknik Informatika', 'Sistem Informasi', 'Pendidikan Teknik Informatika'];
  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function field(opts) {
    opts = opts || {};
    const id = opts.name;
    const tipe = opts.type || 'text';
    let inner;
    if (tipe === 'select') {
      inner = '<select id="f-' + id + '" name="' + id + '" class="input">' +
        (opts.options || []).map(function (o) {
          const val = typeof o === 'object' ? o.value : o;
          const label = typeof o === 'object' ? o.label : o;
          return '<option value="' + UI.esc(val) + '"' + (String(val) === String(opts.value) ? ' selected' : '') + '>' + UI.esc(label) + '</option>';
        }).join('') + '</select>';
    } else {
      inner = '<input id="f-' + id + '" name="' + id + '" type="' + tipe + '" class="input" value="' + UI.esc(opts.value == null ? '' : opts.value) + '" placeholder="' + UI.esc(opts.placeholder || '') + '"' + (opts.required === false ? '' : ' required') + ' />';
    }
    return '<div>' +
      '<label class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500" for="f-' + id + '">' + UI.esc(opts.label || id) + (opts.required === false ? ' <span class="font-normal normal-case text-slate-400">(opsional)</span>' : '') + '</label>' +
      inner +
      (opts.hint ? '<p class="mt-1 text-[11px] text-slate-400">' + UI.esc(opts.hint) + '</p>' : '') +
      '</div>';
  }

  function formData(form) {
    const data = {};
    Array.prototype.slice.call(form.elements).forEach(function (el) {
      if (el.name) data[el.name] = typeof el.value === 'string' ? el.value.trim() : el.value;
    });
    return data;
  }

  /* ============================================================
   * DASHBOARD ADMIN
   * ============================================================ */
  function dashboard(container) {
    const s = sessionAdmin();
    if (!s) return;

    const db = DB.get();

    /* Sebaran mahasiswa per semester */
    const perSem = {};
    db.mahasiswa.forEach(function (m) {
      const key = Number(m.semesterAktif) || 0;
      perSem[key] = (perSem[key] || 0) + 1;
    });
    const maxSem = Math.max.apply(null, Object.keys(perSem).map(Number).concat([1]));
    const sebaran = [];
    for (let i = 1; i <= maxSem; i++) {
      const jml = perSem[i] || 0;
      const pct = db.mahasiswa.length ? Math.round((jml / db.mahasiswa.length) * 100) : 0;
      sebaran.push(
        '<div class="flex items-center gap-3">' +
        '  <span class="w-20 shrink-0 text-xs font-bold text-slate-500">Semester ' + i + '</span>' +
        '  <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">' +
        '    <div class="h-full rounded-full bg-gradient-to-r from-fti-500 to-fti-700 transition-all" style="width:' + pct + '%"></div>' +
        '  </div>' +
        '  <span class="w-14 shrink-0 text-right font-mono text-xs font-bold text-slate-600">' + jml + ' mhs</span>' +
        '</div>'
      );
    }

    const mkPerSem = {};
    db.matakuliah.forEach(function (mk) {
      const key = Number(mk.semester) || 0;
      mkPerSem[key] = (mkPerSem[key] || 0) + 1;
    });

    container.innerHTML =
      '<div class="page-enter space-y-6">' +
      '  <div class="relative overflow-hidden rounded-2xl bg-blue-800 bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-md md:p-7">' +
      '    <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>' +
      '    <div class="relative flex flex-wrap items-center justify-between gap-4">' +
      '      <div>' +
      '        <p class="text-xs font-bold uppercase tracking-[0.2em] text-white">PANEL ADMINISTRATOR</p>' +
      '        <h1 class="mt-1.5 text-2xl font-extrabold tracking-tight md:text-3xl text-white">Selamat Datang, ' + UI.esc(s.nama) + ' 🛠️</h1>' +
      '        <p class="mt-1.5 text-sm text-white/90">Kelola data master akademik FTI UNG · ' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</p>' +
      '      </div>' +
      '      <button type="button" data-action="reset-demo" class="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20">' + UI.icon('refresh', 'h-4 w-4') + ' Reset Data Demo</button>' +
      '    </div>' +
      '  </div>' +

      '  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      UI.statCard({ label: 'Mahasiswa', value: String(db.mahasiswa.length), sub: 'Terdaftar di sistem', icon: 'usergroup', tone: 'blue' }) +
      UI.statCard({ label: 'Dosen', value: String(db.dosen.length), sub: 'Dosen pengampu', icon: 'users', tone: 'emerald' }) +
      UI.statCard({ label: 'Mata Kuliah', value: String(db.matakuliah.length), sub: 'Seluruh semester', icon: 'book', tone: 'violet' }) +
      UI.statCard({ label: 'KRS / Nilai', value: String(db.krs.length) + ' / ' + String(db.nilai.length), sub: 'Kontrak & nilai tersimpan', icon: 'chart', tone: 'amber' }) +
      '  </div>' +

      '  <div class="grid gap-6 lg:grid-cols-2">' +
      UI.card('Sebaran Mahasiswa per Semester', '', '<div class="space-y-3">' + sebaran.join('') + '</div>') +
      UI.card('Mata Kuliah per Semester', '',
        '<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">' +
        Object.keys(mkPerSem).map(Number).sort(function (a, b) { return a - b; }).map(function (sem) {
          return '<div class="rounded-xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">' +
            '<p class="font-mono text-2xl font-extrabold text-fti-700">' + mkPerSem[sem] + '</p>' +
            '<p class="mt-1 text-xs font-bold text-slate-500">Semester ' + sem + '</p></div>';
        }).join('') +
        '</div>') +
      '  </div>' +

      UI.card('Jalan Pintas Kelola Data', '',
        '<div class="grid gap-3 sm:grid-cols-3">' +
        [
          { route: '#adm-mahasiswa', label: 'Kelola Mahasiswa', icon: 'usergroup', tone: 'from-blue-500 to-blue-700' },
          { route: '#adm-dosen', label: 'Kelola Dosen', icon: 'users', tone: 'from-emerald-500 to-emerald-700' },
          { route: '#adm-matakuliah', label: 'Kelola Mata Kuliah', icon: 'book', tone: 'from-violet-500 to-violet-700' }
        ].map(function (x) {
          return '<a href="' + x.route + '" data-nav="' + x.route + '" class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-fti-300 hover:shadow-md">' +
            '<span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ' + x.tone + ' text-white shadow">' + UI.icon(x.icon, 'h-5 w-5') + '</span>' +
            UI.esc(x.label) + '</a>';
        }).join('') +
        '</div>') +
      '</div>';

    const btnReset = container.querySelector('[data-action="reset-demo"]');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        UI.confirm({
          title: 'Reset Data Demo?',
          message: 'Seluruh data pada sistem akan dikembalikan ke kondisi awal (seed data dummy). Semua perubahan, KRS, dan nilai yang Anda buat akan <b>hilang</b>. Lanjutkan?',
          yaLabel: 'Ya, Reset Sekarang',
          onYes: function () {
            DB.reset();
            UI.toast('Data demo berhasil direset ke kondisi awal.', 'success');
            dashboard(container);
          }
        });
      });
    }
  }

  /* ============================================================
   * KELOLA MAHASISWA
   * ============================================================ */
  function mahasiswa(container) {
    const s = sessionAdmin();
    if (!s) return;

    function baris(m) {
      const ipkInfo = Akademik.hitungIPK(DB.getNilaiByNim(m.nim));
      return '' +
        '<tr>' +
        '  <td class="font-mono text-xs font-bold text-fti-600">' + UI.esc(m.nim) + '</td>' +
        '  <td>' +
        '    <div class="flex items-center gap-3">' +
        '      <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fti-500 to-fti-700 text-xs font-extrabold text-white">' + UI.esc(UI.inisial(m.nama)) + '</span>' +
        '      <div class="min-w-0"><p class="truncate font-semibold text-slate-700">' + UI.esc(m.nama) + '</p><p class="truncate text-xs text-slate-400">' + UI.esc(m.email || '-') + '</p></div>' +
        '    </div>' +
        '  </td>' +
        '  <td class="text-sm text-slate-500">' + UI.esc(m.prodi) + '</td>' +
        '  <td class="text-center font-mono font-bold text-slate-600">' + UI.esc(m.semesterAktif) + '</td>' +
        '  <td class="text-center font-mono text-xs text-slate-500">' + UI.esc(m.angkatan) + '</td>' +
        '  <td class="text-center font-mono text-sm font-bold text-slate-700">' + UI.fmt(ipkInfo.ipk) + '</td>' +
        '  <td class="text-center">' + UI.badge(m.status, m.status === 'Aktif' ? 'emerald' : (m.status === 'Cuti' ? 'amber' : 'blue')) + '</td>' +
        '  <td class="text-center whitespace-nowrap">' +
        '    <button type="button" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-fti-600 hover:text-white" data-edit-nim="' + UI.esc(m.nim) + '">Edit</button>' +
        '    <button type="button" class="ml-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white" data-delete-nim="' + UI.esc(m.nim) + '">Hapus</button>' +
        '  </td>' +
        '</tr>';
    }

    function renderList() {
      const db = DB.get();
      const tbody = container.querySelector('#tbody-adm-mhs');
      if (!tbody) return;
      const q = (container.querySelector('#cari-adm-mhs').value || '').trim().toLowerCase();
      const hasil = db.mahasiswa.filter(function (m) {
        return !q || m.nim.toLowerCase().includes(q) || m.nama.toLowerCase().includes(q) || String(m.prodi).toLowerCase().includes(q);
      });
      tbody.innerHTML = hasil.length ? hasil.map(baris).join('')
        : '<tr><td colspan="8">' + UI.empty('Data tidak ditemukan', 'Coba kata kunci lain atau tambah mahasiswa baru.', 'search') + '</td></tr>';
      bindAksi();
    }

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div><h1 class="text-xl font-extrabold tracking-tight text-slate-800">Kelola Data Mahasiswa</h1>' +
      '    <p class="text-sm text-slate-400">Tambah, ubah, dan hapus data mahasiswa FTI UNG</p></div>' +
      '    <div class="flex flex-wrap gap-2">' +
      '      <div class="relative">' +
      '        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + UI.icon('search', 'h-4 w-4') + '</span>' +
      '        <input id="cari-adm-mhs" type="search" placeholder="Cari NIM / nama..." class="input w-64 pl-9" />' +
      '      </div>' +
      '      <button type="button" id="btn-tambah-mhs" class="inline-flex items-center gap-2 rounded-xl bg-fti-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-fti-700">' + UI.icon('plus', 'h-4 w-4') + ' Tambah Mahasiswa</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
      '    <div class="overflow-x-auto"><table class="table-fancy">' +
      '      <thead><tr><th>NIM</th><th>Nama</th><th>Prodi</th><th class="text-center">Sem</th><th class="text-center">Angkatan</th><th class="text-center">IPK</th><th class="text-center">Status</th><th class="text-center">Aksi</th></tr></thead>' +
      '      <tbody id="tbody-adm-mhs"></tbody>' +
      '    </table></div>' +
      '  </div>' +
      '</div>';

    container.querySelector('#cari-adm-mhs').addEventListener('input', renderList);
    container.querySelector('#btn-tambah-mhs').addEventListener('click', function () { formMahasiswa(null); });
    renderList();

    function bindAksi() {
      container.querySelectorAll('[data-edit-nim]').forEach(function (b) {
        b.addEventListener('click', function () { formMahasiswa(b.getAttribute('data-edit-nim')); });
      });
      container.querySelectorAll('[data-delete-nim]').forEach(function (b) {
        b.addEventListener('click', function () { hapusMahasiswa(b.getAttribute('data-delete-nim')); });
      });
    }

    function formMahasiswa(nim) {
      const db = DB.get();
      const m = nim ? db.mahasiswa.find(function (x) { return x.nim === nim; }) : null;
      UI.modal({
        title: m ? 'Edit Mahasiswa — ' + UI.esc(m.nama) : 'Tambah Mahasiswa Baru',
        size: 'max-w-2xl',
        body:
          '<form id="form-mahasiswa" class="grid gap-4 sm:grid-cols-2">' +
          field({ name: 'nim', label: 'NIM', value: m ? m.nim : '', placeholder: 'cth. 531423999', hint: '10 digit, unik' }) +
          field({ name: 'nama', label: 'Nama Lengkap', value: m ? m.nama : '', placeholder: 'Nama lengkap mahasiswa' }) +
          field({ name: 'password', label: 'Password', type: 'text', value: m ? m.password : '123', hint: 'Default: 123' }) +
          field({ name: 'email', label: 'Email', type: 'email', value: m ? m.email : '', placeholder: 'nama@student.ung.ac.id', required: false }) +
          field({ name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI, value: m ? m.prodi : PRODI[0] }) +
          field({ name: 'semesterAktif', label: 'Semester Aktif', type: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8].map(String), value: m ? String(m.semesterAktif) : '1' }) +
          field({ name: 'angkatan', label: 'Tahun Angkatan', value: m ? m.angkatan : String(new Date().getFullYear()), placeholder: 'cth. 2024' }) +
          field({ name: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Cuti', 'Lulus', 'Keluar'], value: m ? m.status : 'Aktif' }) +
          '</form>',
        footer:
          '<button type="button" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" data-modal-close>Batal</button>' +
          '<button type="submit" form="form-mahasiswa" class="rounded-xl bg-fti-600 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-fti-700">Simpan</button>'
      });

      const form = document.getElementById('form-mahasiswa');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const d = formData(form);
        if (!d.nim || !d.nama || !d.password) { UI.toast('NIM, nama, dan password wajib diisi.', 'warning'); return; }
        if (!/^\d{6,12}$/.test(d.nim)) { UI.toast('NIM harus 6–12 digit angka.', 'error'); return; }
        if (nim && d.nim !== nim) { UI.toast('NIM tidak boleh diubah saat mode edit.', 'error'); return; }
        if (!nim && db.mahasiswa.some(function (x) { return x.nim === d.nim; })) { UI.toast('NIM ' + d.nim + ' sudah terdaftar.', 'error'); return; }

        const fresh = DB.get();
        if (m) {
          const idx = fresh.mahasiswa.findIndex(function (x) { return x.nim === nim; });
          fresh.mahasiswa[idx] = Object.assign({}, m, {
            nama: d.nama, password: d.password, email: d.email, prodi: d.prodi,
            semesterAktif: Number(d.semesterAktif) || 1, angkatan: d.angkatan, status: d.status
          });
        } else {
          fresh.mahasiswa.push({
            nim: d.nim, nama: d.nama, password: d.password, email: d.email, prodi: d.prodi,
            semesterAktif: Number(d.semesterAktif) || 1, angkatan: d.angkatan, status: d.status
          });
        }
        DB.save(fresh);
        UI.closeModal();
        UI.toast('Data mahasiswa ' + d.nama + ' berhasil ' + (m ? 'diperbarui' : 'ditambahkan') + '.', 'success');
        renderList();
      });
    }

    function hapusMahasiswa(nim) {
      const m = DB.getMahasiswa(nim);
      if (!m) return;
      UI.confirm({
        title: 'Hapus Mahasiswa?',
        message: 'Data mahasiswa <b>' + UI.esc(m.nama) + '</b> (' + UI.esc(nim) + ') beserta seluruh <b>KRS</b> dan <b>nilai</b> miliknya akan dihapus permanen. Lanjutkan?',
        yaLabel: 'Ya, Hapus',
        onYes: function () {
          const db = DB.get();
          db.mahasiswa = db.mahasiswa.filter(function (x) { return x.nim !== nim; });
          db.krs = db.krs.filter(function (k) { return k.nim !== nim; });
          db.nilai = db.nilai.filter(function (n) { return n.nim !== nim; });
          DB.save(db);
          UI.toast('Mahasiswa ' + m.nama + ' beserta data terkait berhasil dihapus.', 'success');
          renderList();
        }
      });
    }
  }

  /* ============================================================
   * KELOLA DOSEN
   * ============================================================ */
  function dosen(container) {
    const s = sessionAdmin();
    if (!s) return;

    function baris(d) {
      const jmlMk = DB.get().matakuliah.filter(function (mk) { return mk.dosenNip === d.nip; }).length;
      return '' +
        '<tr>' +
        '  <td class="font-mono text-xs font-bold text-emerald-700">' + UI.esc(d.nip) + '</td>' +
        '  <td>' +
        '    <div class="flex items-center gap-3">' +
        '      <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-extrabold text-white">' + UI.esc(UI.inisial(d.nama)) + '</span>' +
        '      <div class="min-w-0"><p class="truncate font-semibold text-slate-700">' + UI.esc(d.nama) + '</p><p class="truncate text-xs text-slate-400">' + UI.esc(d.email || '-') + '</p></div>' +
        '    </div>' +
        '  </td>' +
        '  <td class="text-sm text-slate-500">' + UI.esc(d.bidang || '-') + '</td>' +
        '  <td class="text-center font-mono text-sm font-bold text-slate-600">' + jmlMk + '</td>' +
        '  <td class="text-center whitespace-nowrap">' +
        '    <button type="button" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-emerald-600 hover:text-white" data-edit-nip="' + UI.esc(d.nip) + '">Edit</button>' +
        '    <button type="button" class="ml-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white" data-delete-nip="' + UI.esc(d.nip) + '">Hapus</button>' +
        '  </td>' +
        '</tr>';
    }

    function renderList() {
      const db = DB.get();
      const tbody = container.querySelector('#tbody-adm-dsn');
      if (!tbody) return;
      const q = (container.querySelector('#cari-adm-dsn').value || '').trim().toLowerCase();
      const hasil = db.dosen.filter(function (d) {
        return !q || d.nip.toLowerCase().includes(q) || d.nama.toLowerCase().includes(q) || String(d.bidang).toLowerCase().includes(q);
      });
      tbody.innerHTML = hasil.length ? hasil.map(baris).join('')
        : '<tr><td colspan="5">' + UI.empty('Data tidak ditemukan', 'Coba kata kunci lain atau tambah dosen baru.', 'search') + '</td></tr>';
      bindAksi();
    }

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div><h1 class="text-xl font-extrabold tracking-tight text-slate-800">Kelola Data Dosen</h1>' +
      '    <p class="text-sm text-slate-400">Tambah, ubah, dan hapus data dosen FTI UNG</p></div>' +
      '    <div class="flex flex-wrap gap-2">' +
      '      <div class="relative">' +
      '        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + UI.icon('search', 'h-4 w-4') + '</span>' +
      '        <input id="cari-adm-dsn" type="search" placeholder="Cari NIP / nama / bidang..." class="input w-64 pl-9" />' +
      '      </div>' +
      '      <button type="button" id="btn-tambah-dsn" class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-emerald-700">' + UI.icon('plus', 'h-4 w-4') + ' Tambah Dosen</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
      '    <div class="overflow-x-auto"><table class="table-fancy">' +
      '      <thead><tr><th>NIP</th><th>Nama</th><th>Bidang</th><th class="text-center">MK Diampu</th><th class="text-center">Aksi</th></tr></thead>' +
      '      <tbody id="tbody-adm-dsn"></tbody>' +
      '    </table></div>' +
      '  </div>' +
      '</div>';

    container.querySelector('#cari-adm-dsn').addEventListener('input', renderList);
    container.querySelector('#btn-tambah-dsn').addEventListener('click', function () { formDosen(null); });
    renderList();

    function bindAksi() {
      container.querySelectorAll('[data-edit-nip]').forEach(function (b) {
        b.addEventListener('click', function () { formDosen(b.getAttribute('data-edit-nip')); });
      });
      container.querySelectorAll('[data-delete-nip]').forEach(function (b) {
        b.addEventListener('click', function () { hapusDosen(b.getAttribute('data-delete-nip')); });
      });
    }

    function formDosen(nip) {
      const db = DB.get();
      const d = nip ? db.dosen.find(function (x) { return x.nip === nip; }) : null;
      UI.modal({
        title: d ? 'Edit Dosen — ' + UI.esc(d.nama) : 'Tambah Dosen Baru',
        size: 'max-w-xl',
        body:
          '<form id="form-dosen" class="grid gap-4 sm:grid-cols-2">' +
          field({ name: 'nip', label: 'NIP', value: d ? d.nip : '', placeholder: 'cth. 19901234', hint: '4–18 digit, unik' }) +
          field({ name: 'password', label: 'Password', value: d ? d.password : '123', hint: 'Default: 123' }) +
          '<div class="sm:col-span-2">' + field({ name: 'nama', label: 'Nama Lengkap (Gelar)', value: d ? d.nama : '', placeholder: 'cth. Dr. Nama, S.Kom., M.T.' }) + '</div>' +
          field({ name: 'bidang', label: 'Bidang Keahlian', value: d ? d.bidang : '', placeholder: 'cth. Basis Data', required: false }) +
          field({ name: 'email', label: 'Email', type: 'email', value: d ? d.email : '', placeholder: 'nama@ung.ac.id', required: false }) +
          '</form>',
        footer:
          '<button type="button" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" data-modal-close>Batal</button>' +
          '<button type="submit" form="form-dosen" class="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-emerald-700">Simpan</button>'
      });

      const form = document.getElementById('form-dosen');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = formData(form);
        if (!data.nip || !data.nama || !data.password) { UI.toast('NIP, nama, dan password wajib diisi.', 'warning'); return; }
        if (!/^\d{4,18}$/.test(data.nip)) { UI.toast('NIP harus 4–18 digit angka.', 'error'); return; }
        if (nip && data.nip !== nip) { UI.toast('NIP tidak boleh diubah saat mode edit.', 'error'); return; }
        if (!nip && db.dosen.some(function (x) { return x.nip === data.nip; })) { UI.toast('NIP ' + data.nip + ' sudah terdaftar.', 'error'); return; }

        const fresh = DB.get();
        if (d) {
          const idx = fresh.dosen.findIndex(function (x) { return x.nip === nip; });
          fresh.dosen[idx] = Object.assign({}, d, {
            nama: data.nama, password: data.password, bidang: data.bidang, email: data.email
          });
        } else {
          fresh.dosen.push({
            nip: data.nip, nama: data.nama, password: data.password, bidang: data.bidang, email: data.email
          });
        }
        DB.save(fresh);
        UI.closeModal();
        UI.toast('Data dosen ' + data.nama + ' berhasil ' + (d ? 'diperbarui' : 'ditambahkan') + '.', 'success');
        renderList();
      });
    }

    function hapusDosen(nip) {
      const d = DB.getDosen(nip);
      if (!d) return;
      UI.confirm({
        title: 'Hapus Dosen?',
        message: 'Data dosen <b>' + UI.esc(d.nama) + '</b> (' + UI.esc(nip) + ') akan dihapus. Mata kuliah yang diampunya menjadi <b>tanpa dosen</b>. Lanjutkan?',
        yaLabel: 'Ya, Hapus',
        onYes: function () {
          const db = DB.get();
          db.dosen = db.dosen.filter(function (x) { return x.nip !== nip; });
          db.matakuliah.forEach(function (mk) { if (mk.dosenNip === nip) mk.dosenNip = ''; });
          DB.save(db);
          UI.toast('Dosen ' + d.nama + ' berhasil dihapus.', 'success');
          renderList();
        }
      });
    }
  }

  /* ============================================================
   * KELOLA MATA KULIAH
   * ============================================================ */
  function matakuliah(container) {
    const s = sessionAdmin();
    if (!s) return;

    function namaDosen(nip) {
      const d = DB.getDosen(nip);
      return d ? d.nama : '—';
    }

    function baris(mk) {
      return '' +
        '<tr>' +
        '  <td class="font-mono text-xs font-bold text-violet-700">' + UI.esc(mk.kode) + '</td>' +
        '  <td class="font-semibold text-slate-700">' + UI.esc(mk.nama) + '</td>' +
        '  <td class="text-center font-mono font-bold text-slate-600">' + UI.esc(mk.sks) + '</td>' +
        '  <td class="text-center font-mono text-xs text-slate-500">' + UI.esc(mk.semester) + '</td>' +
        '  <td class="text-sm text-slate-500">' + UI.esc(mk.hari) + '<br/><span class="font-mono text-xs">' + UI.esc(mk.jam) + '</span></td>' +
        '  <td class="text-xs text-slate-500">' + UI.esc(mk.ruang) + '</td>' +
        '  <td class="text-xs ' + (mk.dosenNip ? 'text-slate-600' : 'text-slate-300') + '">' + UI.esc(namaDosen(mk.dosenNip)) + '</td>' +
        '  <td class="text-center whitespace-nowrap">' +
        '    <button type="button" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-violet-600 hover:text-white" data-edit-kode="' + UI.esc(mk.kode) + '">Edit</button>' +
        '    <button type="button" class="ml-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white" data-delete-kode="' + UI.esc(mk.kode) + '">Hapus</button>' +
        '  </td>' +
        '</tr>';
    }

    function renderList() {
      const db = DB.get();
      const tbody = container.querySelector('#tbody-adm-mk');
      if (!tbody) return;
      const q = (container.querySelector('#cari-adm-mk').value || '').trim().toLowerCase();
      const hasil = db.matakuliah.filter(function (mk) {
        return !q || mk.kode.toLowerCase().includes(q) || mk.nama.toLowerCase().includes(q) || String(mk.ruang).toLowerCase().includes(q);
      }).sort(function (a, b) { return a.kode.localeCompare(b.kode); });
      tbody.innerHTML = hasil.length ? hasil.map(baris).join('')
        : '<tr><td colspan="8">' + UI.empty('Data tidak ditemukan', 'Coba kata kunci lain atau tambah mata kuliah baru.', 'search') + '</td></tr>';
      bindAksi();
    }

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div><h1 class="text-xl font-extrabold tracking-tight text-slate-800">Kelola Data Mata Kuliah</h1>' +
      '    <p class="text-sm text-slate-400">Tambah, ubah, dan hapus mata kuliah beserta jadwal & dosen pengampu</p></div>' +
      '    <div class="flex flex-wrap gap-2">' +
      '      <div class="relative">' +
      '        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + UI.icon('search', 'h-4 w-4') + '</span>' +
      '        <input id="cari-adm-mk" type="search" placeholder="Cari kode / nama MK..." class="input w-64 pl-9" />' +
      '      </div>' +
      '      <button type="button" id="btn-tambah-mk" class="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-violet-700">' + UI.icon('plus', 'h-4 w-4') + ' Tambah Mata Kuliah</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
      '    <div class="overflow-x-auto"><table class="table-fancy">' +
      '      <thead><tr><th>Kode</th><th>Nama MK</th><th class="text-center">SKS</th><th class="text-center">Semester</th><th>Waktu</th><th>Ruang</th><th>Dosen Pengampu</th><th class="text-center">Aksi</th></tr></thead>' +
      '      <tbody id="tbody-adm-mk"></tbody>' +
      '    </table></div>' +
      '  </div>' +
      '</div>';

    container.querySelector('#cari-adm-mk').addEventListener('input', renderList);
    container.querySelector('#btn-tambah-mk').addEventListener('click', function () { formMk(null); });
    renderList();

    function bindAksi() {
      container.querySelectorAll('[data-edit-kode]').forEach(function (b) {
        b.addEventListener('click', function () { formMk(b.getAttribute('data-edit-kode')); });
      });
      container.querySelectorAll('[data-delete-kode]').forEach(function (b) {
        b.addEventListener('click', function () { hapusMk(b.getAttribute('data-delete-kode')); });
      });
    }

    function formMk(kode) {
      const db = DB.get();
      const mk = kode ? db.matakuliah.find(function (x) { return x.kode === kode; }) : null;
      const dosenOptions = [{ value: '', label: '— Tanpa dosen —' }].concat(
        db.dosen.map(function (d) { return { value: d.nip, label: d.nip + ' — ' + d.nama }; })
      );

      UI.modal({
        title: mk ? 'Edit Mata Kuliah — ' + UI.esc(mk.nama) : 'Tambah Mata Kuliah Baru',
        size: 'max-w-2xl',
        body:
          '<form id="form-mk" class="grid gap-4 sm:grid-cols-2">' +
          field({ name: 'kode', label: 'Kode Mata Kuliah', value: mk ? mk.kode : '', placeholder: 'cth. IF305', hint: 'Unik, huruf + angka' }) +
          '<div class="sm:col-span-2">' + field({ name: 'nama', label: 'Nama Mata Kuliah', value: mk ? mk.nama : '', placeholder: 'cth. Pemrograman Berbasis Komponen' }) + '</div>' +
          field({ name: 'sks', label: 'SKS', type: 'select', options: ['1', '2', '3', '4', '5', '6'], value: mk ? String(mk.sks) : '3' }) +
          field({ name: 'semester', label: 'Semester', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7', '8'], value: mk ? String(mk.semester) : '1' }) +
          field({ name: 'hari', label: 'Hari', type: 'select', options: HARI, value: mk ? mk.hari : HARI[0] }) +
          field({ name: 'jam', label: 'Jam Kuliah', value: mk ? mk.jam : '08:00 - 10:00', placeholder: 'cth. 08:00 - 10:00' }) +
          field({ name: 'ruang', label: 'Ruang / Lab', value: mk ? mk.ruang : '', placeholder: 'cth. Lab Komputer 1' }) +
          field({ name: 'dosenNip', label: 'Dosen Pengampu', type: 'select', options: dosenOptions, value: mk ? mk.dosenNip : '' }) +
          '</form>',
        footer:
          '<button type="button" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" data-modal-close>Batal</button>' +
          '<button type="submit" form="form-mk" class="rounded-xl bg-violet-600 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-violet-700">Simpan</button>'
      });

      const form = document.getElementById('form-mk');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const d = formData(form);
        if (!d.kode || !d.nama || !d.ruang || !d.jam) { UI.toast('Kode, nama, ruang, dan jam wajib diisi.', 'warning'); return; }
        if (!/^[A-Za-z0-9-]{3,12}$/.test(d.kode)) { UI.toast('Kode MK harus 3–12 karakter (huruf/angka/garis).', 'error'); return; }
        d.kode = d.kode.toUpperCase();
        if (kode && d.kode !== kode) { UI.toast('Kode mata kuliah tidak boleh diubah saat mode edit.', 'error'); return; }
        if (!kode && db.matakuliah.some(function (x) { return x.kode === d.kode; })) { UI.toast('Kode ' + d.kode + ' sudah terdaftar.', 'error'); return; }

        const fresh = DB.get();
        if (mk) {
          const idx = fresh.matakuliah.findIndex(function (x) { return x.kode === kode; });
          fresh.matakuliah[idx] = Object.assign({}, mk, {
            nama: d.nama, sks: Number(d.sks) || 3, semester: Number(d.semester) || 1,
            hari: d.hari, jam: d.jam, ruang: d.ruang, dosenNip: d.dosenNip
          });
        } else {
          fresh.matakuliah.push({
            kode: d.kode, nama: d.nama, sks: Number(d.sks) || 3, semester: Number(d.semester) || 1,
            hari: d.hari, jam: d.jam, ruang: d.ruang, dosenNip: d.dosenNip
          });
        }
        DB.save(fresh);
        UI.closeModal();
        UI.toast('Mata kuliah ' + d.nama + ' berhasil ' + (mk ? 'diperbarui' : 'ditambahkan') + '.', 'success');
        renderList();
      });
    }

    function hapusMk(kode) {
      const mk = DB.getMatakuliah(kode);
      if (!mk) return;
      UI.confirm({
        title: 'Hapus Mata Kuliah?',
        message: 'Mata kuliah <b>' + UI.esc(mk.nama) + '</b> (' + UI.esc(kode) + ') beserta seluruh <b>KRS</b> dan <b>nilai</b> mahasiswa pada mata kuliah ini akan dihapus permanen. Lanjutkan?',
        yaLabel: 'Ya, Hapus',
        onYes: function () {
          const db = DB.get();
          db.matakuliah = db.matakuliah.filter(function (x) { return x.kode !== kode; });
          db.krs = db.krs.filter(function (k) { return k.kodeMk !== kode; });
          db.nilai = db.nilai.filter(function (n) { return n.kodeMk !== kode; });
          DB.save(db);
          UI.toast('Mata kuliah ' + mk.nama + ' berhasil dihapus.', 'success');
          renderList();
        }
      });
    }
  }

  global.AdminPage = {
    dashboard: dashboard,
    mahasiswa: mahasiswa,
    dosen: dosen,
    matakuliah: matakuliah
  };

})(typeof window !== 'undefined' ? window : globalThis);
