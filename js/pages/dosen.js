/* ============================================================
 * SIAKAD Mini FTI UNG — js/pages/dosen.js
 * Dashboard Dosen, Akses Data Mahasiswa, dan Kelola/Input Nilai
 * (Tugas/UTS/UAS skala 0-100 ATAU input skala 4.0).
 *
 * ATURAN KONVERSI MUTLAK:
 *   - Nilai Akhir >= 85  -> Grade 'A'
 *   - Input skala 4.0    -> Grade 'A' (bukan 'E')
 * ============================================================ */
(function (global) {
  'use strict';

  function sessionDosen() {
    const s = Session.get();
    if (!s || s.role !== 'dosen') { App.navigate('#login'); return null; }
    /* Kompatibilitas: sesi lama hanya punya field `id` */
    if (!s.nip) s.nip = s.id;
    return s;
  }

  function mkDiampu(nip) {
    return DB.get().matakuliah.filter(function (mk) { return mk.dosenNip === nip; })
      .sort(function (a, b) { return a.kode.localeCompare(b.kode); });
  }

  function jumlahMahasiswaMk(kode) {
    return DB.getKrsByMk(kode, Akademik.TAHUN_AKADEMIK).length;
  }

  /* ============================================================
   * DASHBOARD DOSEN
   * ============================================================ */
  function dashboard(container) {
    const s = sessionDosen();
    if (!s) return;

    const db = DB.get();
    const dsn = DB.getDosen(s.nip) || { nama: s.nama, bidang: '-' };
    const listMk = mkDiampu(s.nip);

    /* Total mahasiswa unik dari semua MK yang diampu */
    const nimSet = {};
    listMk.forEach(function (mk) {
      DB.getKrsByMk(mk.kode, Akademik.TAHUN_AKADEMIK).forEach(function (k) { nimSet[k.nim] = true; });
    });
    const totalMhsAjar = Object.keys(nimSet).length;

    const nilaiDiinput = db.nilai.filter(function (n) { return n.updatedBy === s.nip; }).length;

    const rowsMk = listMk.map(function (mk) {
      const jml = jumlahMahasiswaMk(mk.kode);
      const jmlNilai = db.nilai.filter(function (n) {
        return n.kodeMk === mk.kode && nimSet[n.nim];
      }).length;
      const sudahLengkap = jml > 0 && jmlNilai >= jml;
      return '' +
        '<tr>' +
        '  <td><p class="font-mono text-xs font-bold text-fti-600">' + UI.esc(mk.kode) + '</p><p class="font-semibold text-slate-700">' + UI.esc(mk.nama) + '</p></td>' +
        '  <td class="text-center font-mono font-bold text-slate-600">' + mk.sks + '</td>' +
        '  <td class="text-sm text-slate-500">' + UI.esc(mk.hari) + '<br/><span class="font-mono text-xs">' + UI.esc(mk.jam) + '</span></td>' +
        '  <td class="text-xs text-slate-500">' + UI.esc(mk.ruang) + '</td>' +
        '  <td class="text-center font-mono font-bold text-slate-700">' + jml + '</td>' +
        '  <td class="text-center">' + (sudahLengkap ? UI.badge('Lengkap', 'emerald') : UI.badge('Belum Lengkap', 'amber')) + '</td>' +
        '  <td class="text-center">' +
        '<button type="button" class="rounded-lg bg-fti-50 px-3 py-1.5 text-xs font-bold text-fti-700 ring-1 ring-fti-200 transition hover:bg-fti-600 hover:text-white" data-action="input-nilai" data-kode="' + UI.esc(mk.kode) + '">Input Nilai</button>' +
        '  </td>' +
        '</tr>';
    }).join('');

    container.innerHTML =
      '<div class="page-enter space-y-6">' +
      '  <div class="relative overflow-hidden rounded-2xl bg-blue-800 bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-md md:p-7">' +
      '    <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>' +
      '    <div class="relative">' +
      '      <p class="text-xs font-bold uppercase tracking-[0.2em] text-white">DASHBOARD DOSEN</p>' +
      '      <h1 class="mt-1.5 text-2xl font-extrabold tracking-tight md:text-3xl text-white">Selamat Mengajar, ' + UI.esc(String(dsn.nama).split(',')[0]) + '! 🎓</h1>' +
      '      <p class="mt-1.5 text-sm text-white/90">Bidang: ' + UI.esc(dsn.bidang) + ' · NIP ' + UI.esc(s.nip) + ' · ' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</p>' +
      '    </div>' +
      '  </div>' +

      '  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      UI.statCard({ label: 'MK Diampu', value: String(listMk.length), sub: 'Mata kuliah semester ini', icon: 'book', tone: 'blue' }) +
      UI.statCard({ label: 'Mahasiswa Diajar', value: String(totalMhsAjar), sub: 'Mahasiswa unik dari KRS', icon: 'usergroup', tone: 'violet' }) +
      UI.statCard({ label: 'Nilai Diinput', value: String(nilaiDiinput), sub: 'Oleh Anda pada sistem', icon: 'pencil', tone: 'emerald' }) +
      UI.statCard({ label: 'Total Mahasiswa FTI', value: String(db.mahasiswa.length), sub: 'Seluruh prodi di FTI', icon: 'users', tone: 'amber' }) +
      '  </div>' +

      UI.card('Mata Kuliah yang Diampu',
        '<a href="#dsn-nilai" data-nav="#dsn-nilai" class="text-xs font-bold text-fti-600 hover:underline">Buka input nilai →</a>',
        (listMk.length
          ? '<div class="-mx-5 overflow-x-auto px-5"><table class="table-fancy">' +
          '<thead><tr><th>Mata Kuliah</th><th class="text-center">SKS</th><th>Waktu</th><th>Ruang</th><th class="text-center">Mahasiswa</th><th class="text-center">Nilai</th><th class="text-center">Aksi</th></tr></thead>' +
          '<tbody>' + rowsMk + '</tbody></table></div>'
          : UI.empty('Belum ada mata kuliah yang diampu', 'Minta admin menetapkan Anda sebagai dosen pengampu pada menu Data Mata Kuliah.', 'book'))) +
      '</div>';

    /* Tombol aksi cepat menuju input nilai */
    container.querySelectorAll('[data-action="input-nilai"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const kode = btn.getAttribute('data-kode');
        DosenPage._pilihMk = kode;
        App.navigate('#dsn-nilai');
      });
    });
  }

  /* ============================================================
   * DATA MAHASISWA (akses data)
   * ============================================================ */
  function mahasiswa(container) {
    const s = sessionDosen();
    if (!s) return;

    const db = DB.get();

    function baris(m) {
      const nilai = DB.getNilaiByNim(m.nim);
      const ipkInfo = Akademik.hitungIPK(nilai);
      const jmlKrs = db.krs.filter(function (k) { return k.nim === m.nim && k.tahunAkademik === Akademik.TAHUN_AKADEMIK; }).length;
      const statusTone = m.status === 'Aktif' ? 'emerald' : (m.status === 'Cuti' ? 'amber' : 'blue');
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
        '  <td class="text-center font-mono text-sm font-semibold text-slate-600">' + ipkInfo.totalSks + '</td>' +
        '  <td class="text-center font-mono text-sm font-semibold text-slate-600">' + jmlKrs + '</td>' +
        '  <td class="text-center">' + UI.badge(m.status, statusTone) + '</td>' +
        '  <td class="text-center">' +
        '<button type="button" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-fti-600 hover:text-white" data-detail-nim="' + UI.esc(m.nim) + '">Detail</button>' +
        '  </td>' +
        '</tr>';
    }

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div>' +
      '      <h1 class="text-xl font-extrabold tracking-tight text-slate-800">Data Mahasiswa FTI UNG</h1>' +
      '      <p class="text-sm text-slate-400">Total ' + db.mahasiswa.length + ' mahasiswa terdaftar pada sistem</p>' +
      '    </div>' +
      '    <div class="relative">' +
      '      <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">' + UI.icon('search', 'h-4 w-4') + '</span>' +
      '      <input id="cari-mhs" type="search" placeholder="Cari NIM / nama / prodi..." class="input w-72 pl-9" />' +
      '    </div>' +
      '  </div>' +

      '  <div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
      '    <div class="overflow-x-auto">' +
      '      <table class="table-fancy">' +
      '        <thead><tr><th>NIM</th><th>Nama</th><th>Prodi</th><th class="text-center">Sem</th><th class="text-center">Angkatan</th><th class="text-center">IPK</th><th class="text-center">SKS</th><th class="text-center">KRS</th><th class="text-center">Status</th><th class="text-center">Aksi</th></tr></thead>' +
      '        <tbody id="tbody-mhs">' + (db.mahasiswa.length ? db.mahasiswa.map(baris).join('') : '<tr><td colspan="10">' + UI.empty('Belum ada data mahasiswa', 'Data dikelola oleh admin sistem.', 'usergroup') + '</td></tr>') + '</tbody>' +
      '      </table>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    const inputCari = container.querySelector('#cari-mhs');
    const tbody = container.querySelector('#tbody-mhs');
    if (inputCari && tbody) {
      inputCari.addEventListener('input', function () {
        const q = inputCari.value.trim().toLowerCase();
        const hasil = db.mahasiswa.filter(function (m) {
          return !q || m.nim.toLowerCase().includes(q) || m.nama.toLowerCase().includes(q) || String(m.prodi).toLowerCase().includes(q);
        });
        tbody.innerHTML = hasil.length ? hasil.map(baris).join('')
          : '<tr><td colspan="10">' + UI.empty('Mahasiswa tidak ditemukan', 'Coba kata kunci lain.', 'search') + '</td></tr>';
        bindDetail();
      });
    }

    function bindDetail() {
      container.querySelectorAll('[data-detail-nim]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          lihatDetail(btn.getAttribute('data-detail-nim'));
        });
      });
    }
    bindDetail();

    function lihatDetail(nim) {
      const m = DB.getMahasiswa(nim);
      if (!m) return;
      const nilai = DB.getNilaiByNim(nim);
      const ipkInfo = Akademik.hitungIPK(nilai);
      const krs = DB.getKrsByNim(nim, Akademik.TAHUN_AKADEMIK);
      const db2 = DB.get();

      UI.modal({
        title: 'Detail Mahasiswa — ' + UI.esc(m.nama),
        size: 'max-w-2xl',
        body:
          '<div class="grid gap-4 sm:grid-cols-3">' +
          UI.statCard({ label: 'IPK', valueHtml: '<span class="font-mono">' + UI.fmt(ipkInfo.ipk) + '</span>', sub: Akademik.statusIPK(ipkInfo.ipk).label, icon: 'chart', tone: 'emerald' }) +
          UI.statCard({ label: 'Total SKS', value: String(ipkInfo.totalSks), sub: nilai.length + ' MK ber-nilai', icon: 'cap', tone: 'blue' }) +
          UI.statCard({ label: 'KRS Aktif', value: String(krs.length) + ' MK', sub: Akademik.TAHUN_AKADEMIK, icon: 'clipboard', tone: 'violet' }) +
          '</div>' +
          '<div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm ring-1 ring-slate-200">' +
          '<p><b class="text-slate-500">NIM:</b> <span class="font-mono">' + UI.esc(m.nim) + '</span></p>' +
          '<p class="mt-1"><b class="text-slate-500">Prodi:</b> ' + UI.esc(m.prodi) + ' · Semester ' + UI.esc(m.semesterAktif) + ' · Angkatan ' + UI.esc(m.angkatan) + '</p>' +
          '<p class="mt-1"><b class="text-slate-500">Email:</b> ' + UI.esc(m.email || '-') + ' · Status <b>' + UI.esc(m.status) + '</b></p>' +
          '</div>' +
          '<h4 class="mt-5 text-sm font-extrabold text-slate-700">Mata Kuliah KRS (' + krs.length + ')</h4>' +
          (krs.length
            ? '<ul class="mt-2 space-y-1.5">' + krs.map(function (k) {
              const mk = db2.matakuliah.find(function (x) { return x.kode === k.kodeMk; });
              return '<li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs ring-1 ring-slate-100">' +
                '<span><b class="font-mono text-fti-600">' + UI.esc(k.kodeMk) + '</b> · ' + UI.esc(mk ? mk.nama : '-') + '</span>' +
                '<span class="font-mono font-semibold text-slate-500">' + (mk ? mk.sks : 0) + ' SKS</span></li>';
            }).join('') + '</ul>'
            : '<p class="mt-2 text-xs text-slate-400">Belum mengontrak mata kuliah semester ini.</p>') +
          '<h4 class="mt-5 text-sm font-extrabold text-slate-700">Riwayat Nilai (' + nilai.length + ')</h4>' +
          (nilai.length
            ? '<div class="mt-2 overflow-hidden rounded-xl ring-1 ring-slate-200"><table class="table-fancy">' +
            '<thead><tr><th>Mata Kuliah</th><th class="text-center">NA</th><th class="text-center">Grade</th><th class="text-center">Bobot</th></tr></thead><tbody>' +
            nilai.map(function (n) {
              const mk = db2.matakuliah.find(function (x) { return x.kode === n.kodeMk; });
              return '<tr><td class="text-xs"><b class="font-mono text-fti-600">' + UI.esc(n.kodeMk) + '</b> · ' + UI.esc(mk ? mk.nama : '-') + '</td>' +
                '<td class="text-center font-mono font-bold text-slate-700">' + UI.fmt(n.nilaiAkhir) + '</td>' +
                '<td class="text-center">' + UI.gradeBadge(n.grade) + '</td>' +
                '<td class="text-center font-mono text-xs text-slate-500">' + UI.fmt(n.bobot) + '</td></tr>';
            }).join('') + '</tbody></table></div>'
            : '<p class="mt-2 text-xs text-slate-400">Belum ada nilai tercatat.</p>'),
        footer: '<button type="button" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50" data-modal-close>Tutup</button>'
      });
    }
  }

  /* ============================================================
   * KELOLA & INPUT NILAI
   * ============================================================ */
  function nilai(container) {
    const s = sessionDosen();
    if (!s) return;

    const db = DB.get();
    const listMk = mkDiampu(s.nip);

    if (!listMk.length) {
      container.innerHTML =
        '<div class="page-enter space-y-5">' +
        '  <div><h1 class="text-xl font-extrabold tracking-tight text-slate-800">Kelola & Input Nilai</h1>' +
        '  <p class="text-sm text-slate-400">Selamat mengajar, ' + UI.esc(s.nama) + '</p></div>' +
        UI.empty('Belum ada mata kuliah yang diampu', 'Minta admin menetapkan Anda sebagai dosen pengampu pada menu Data Mata Kuliah.', 'pencil') +
        '</div>';
      return;
    }

    /* State lokal halaman */
    const state = {
      kode: (DosenPage._pilihMk && listMk.some(function (m) { return m.kode === DosenPage._pilihMk; })) ? DosenPage._pilihMk : listMk[0].kode,
      mode: 'persen' /* 'persen' (Tugas/UTS/UAS) atau 'skala4' */
    };
    DosenPage._pilihMk = null;

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div>' +
      '      <h1 class="text-xl font-extrabold tracking-tight text-slate-800">Kelola & Input Nilai</h1>' +
      '      <p class="text-sm text-slate-400">Masukkan nilai Tugas, UTS, dan UAS — atau input langsung skala 4.0</p>' +
      '    </div>' +
      '  </div>' +

      '  <div class="rounded-2xl bg-white p-5 shadow-card ring-1 ring-slate-200/70">' +
      '    <div class="grid gap-4 md:grid-cols-2">' +
      '      <div>' +
      '        <label class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500" for="select-mk-nilai">Mata Kuliah Diampu</label>' +
      '        <select id="select-mk-nilai" class="input">' +
      listMk.map(function (mk) {
        return '<option value="' + UI.esc(mk.kode) + '"' + (mk.kode === state.kode ? ' selected' : '') + '>' + UI.esc(mk.kode) + ' — ' + UI.esc(mk.nama) + ' (' + mk.sks + ' SKS)</option>';
      }).join('') +
      '        </select>' +
      '      </div>' +
      '      <div>' +
      '        <span class="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">Mode Input Nilai</span>' +
      '        <div class="flex gap-2">' +
      '          <label class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-fti-200 bg-fti-50 px-3 py-2.5 text-sm font-semibold text-fti-800 ring-1 ring-fti-200 transition" data-mode-label="persen">' +
      '            <input type="radio" name="mode-nilai" value="persen" data-mode="persen" class="accent-fti-600" checked /> Skala 0–100 (Tugas/UTS/UAS)' +
      '          </label>' +
      '          <label class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition" data-mode-label="skala4">' +
      '            <input type="radio" name="mode-nilai" value="skala4" data-mode="skala4" class="accent-fti-600" /> Skala 4.0 (Mutlak)' +
      '          </label>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">' +
      '      <p id="mode-info" class="text-xs font-semibold text-slate-500"></p>' +
      '      <button type="button" id="btn-simpan-nilai" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 active:translate-y-0">' +
      UI.icon('check', 'h-4 w-4') + ' Simpan Semua Nilai</button>' +
      '    </div>' +
      '  </div>' +

      '  <div id="panel-tabel-nilai"></div>' +
      '</div>';

    const panelTabel = container.querySelector('#panel-tabel-nilai');
    const selectMk = container.querySelector('#select-mk-nilai');
    const modeInfo = container.querySelector('#mode-info');

    /* --- Render tabel nilai mahasiswa per MK --- */
    function renderTabel() {
      const dbSegar = DB.get(); /* baca ulang agar status & nilai terbaru tampil */
      const mk = DB.getMatakuliah(state.kode);
      const peserta = DB.getKrsByMk(state.kode, Akademik.TAHUN_AKADEMIK)
        .map(function (k) { return DB.getMahasiswa(k.nim); })
        .filter(Boolean)
        .sort(function (a, b) { return a.nim.localeCompare(b.nim); });
      const nilaiMap = {};
      dbSegar.nilai.forEach(function (n) { nilaiMap[n.nim + '|' + n.kodeMk] = n; });

      if (!mk) {
        panelTabel.innerHTML = UI.empty('Mata kuliah tidak ditemukan', 'Pilih mata kuliah lain dari daftar.', 'book');
        return;
      }

      if (!peserta.length) {
        panelTabel.innerHTML = UI.empty('Belum ada mahasiswa yang mengontrak ' + mk.nama,
          'Mahasiswa harus mengisi KRS terlebih dahulu agar muncul di tabel ini.', 'usergroup');
        return;
      }

      const isPersen = state.mode === 'persen';
      const rows = peserta.map(function (m) {
        const rec = nilaiMap[m.nim + '|' + state.kode] || {};
        const sudahAda = rec.id != null;
        let na, grade;
        if (isPersen) {
          const t = rec.skala4 != null ? null : rec.tugas;
          const u = rec.skala4 != null ? null : rec.uts;
          const a = rec.skala4 != null ? null : rec.uas;
          if (t != null && u != null && a != null) {
            const g = Akademik.gradeDariPersen(Akademik.hitungNilaiAkhir(t, u, a));
            na = UI.fmt(Akademik.hitungNilaiAkhir(t, u, a)); grade = g.huruf;
          } else { na = '-'; grade = null; }
        } else {
          const v = rec.skala4 != null ? rec.skala4 : null;
          if (v != null) { const g = Akademik.gradeDariSkala4(v); na = UI.fmt(v); grade = g.huruf; }
          else { na = '-'; grade = null; }
        }

        return '' +
          '<tr data-nim="' + UI.esc(m.nim) + '" data-row-nilai>' +
          '  <td class="font-mono text-xs font-bold text-fti-600">' + UI.esc(m.nim) + '</td>' +
          '  <td class="font-semibold text-slate-700">' + UI.esc(m.nama) + '<p class="text-xs font-normal text-slate-400">' + UI.esc(m.prodi) + ' · Sem ' + UI.esc(m.semesterAktif) + '</p></td>' +
          (isPersen
            ? '<td class="w-24"><input type="number" min="0" max="100" step="1" data-field="tugas" class="input input-num" placeholder="0" value="' + (rec.skala4 != null ? '' : (rec.tugas != null ? rec.tugas : '')) + '" /></td>' +
            '<td class="w-24"><input type="number" min="0" max="100" step="1" data-field="uts" class="input input-num" placeholder="0" value="' + (rec.skala4 != null ? '' : (rec.uts != null ? rec.uts : '')) + '" /></td>' +
            '<td class="w-24"><input type="number" min="0" max="100" step="1" data-field="uas" class="input input-num" placeholder="0" value="' + (rec.skala4 != null ? '' : (rec.uas != null ? rec.uas : '')) + '" /></td>'
            : '<td class="w-32" colspan="3"><input type="number" min="0" max="4" step="0.01" data-field="skala4" class="input input-num" placeholder="0.00" value="' + (rec.skala4 != null ? rec.skala4 : '') + '" /></td>') +
          '  <td class="text-center font-mono text-sm font-extrabold text-slate-700" data-cell="na">' + na + '</td>' +
          '  <td class="text-center" data-cell="grade">' + (grade ? UI.gradeBadge(grade) : '<span class="text-xs text-slate-300">—</span>') + '</td>' +
          '  <td class="text-center">' + (sudahAda ? UI.badge('Tersimpan', 'emerald') : UI.badge('Belum', 'slate')) + '</td>' +
          '</tr>';
      }).join('');

      panelTabel.innerHTML =
        '<div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
        '  <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">' +
        '    <h2 class="text-base font-bold text-slate-800">Daftar Peserta — ' + UI.esc(mk.nama) + ' <span class="font-mono text-xs font-semibold text-fti-600">(' + UI.esc(mk.kode) + ')</span></h2>' +
        '    <p class="text-xs font-semibold text-slate-400">' + peserta.length + ' mahasiswa · ' + mk.hari + ' ' + mk.jam + '</p>' +
        '  </div>' +
        '  <div class="max-h-[560px] overflow-auto"><table class="table-fancy" id="tabel-nilai">' +
        '    <thead><tr><th>NIM</th><th>Nama Mahasiswa</th>' +
        (isPersen ? '<th class="text-center">Tugas (30%)</th><th class="text-center">UTS (30%)</th><th class="text-center">UAS (40%)</th>' : '<th class="text-center">Nilai Skala 4.0</th>') +
        '    <th class="text-center">Nilai Akhir</th><th class="text-center">Grade</th><th class="text-center">Status</th></tr></thead>' +
        '    <tbody>' + rows + '</tbody>' +
        '  </table></div>' +
        '</div>';

      /* Pratinjau nilai akhir + grade secara langsung (konversi benar: >=85 -> A, 4.0 -> A) */
      const tabel = panelTabel.querySelector('#tabel-nilai');
      tabel.addEventListener('input', function (e) {
        const input = e.target.closest('input[data-field]');
        if (!input) return;
        const tr = input.closest('tr[data-nim]');
        const naCell = tr.querySelector('[data-cell="na"]');
        const gradeCell = tr.querySelector('[data-cell="grade"]');

        let hasil = null;
        if (state.mode === 'persen') {
          const t = parseFloat(tr.querySelector('[data-field="tugas"]').value);
          const u = parseFloat(tr.querySelector('[data-field="uts"]').value);
          const a = parseFloat(tr.querySelector('[data-field="uas"]').value);
          if (!isNaN(t) && !isNaN(u) && !isNaN(a)) {
            const na = Akademik.hitungNilaiAkhir(t, u, a);
            hasil = { na: na, g: Akademik.gradeDariPersen(na) };
          }
        } else {
          const v = parseFloat(input.value);
          if (!isNaN(v)) {
            const clamped = Math.min(4, Math.max(0, v));
            hasil = { na: clamped, g: Akademik.gradeDariSkala4(clamped) };
          }
        }

        if (hasil) {
          naCell.textContent = UI.fmt(hasil.na);
          gradeCell.innerHTML = UI.gradeBadge(hasil.g.huruf);
        } else {
          naCell.textContent = '-';
          gradeCell.innerHTML = '<span class="text-xs text-slate-300">—</span>';
        }
      });
    }

    /* --- Simpan semua nilai ke LocalStorage --- */
    function simpanNilai() {
      const rows = Array.prototype.slice.call(panelTabel.querySelectorAll('tr[data-nim]'));
      if (!rows.length) {
        UI.toast('Tidak ada mahasiswa untuk disimpan pada mata kuliah ini.', 'warning');
        return;
      }

      let tersimpan = 0;
      const dilewati = [];

      try {
        rows.forEach(function (tr) {
          const nim = tr.getAttribute('data-nim');
          const m = DB.getMahasiswa(nim);

          if (state.mode === 'persen') {
            const t = parseFloat(tr.querySelector('[data-field="tugas"]').value);
            const u = parseFloat(tr.querySelector('[data-field="uts"]').value);
            const a = parseFloat(tr.querySelector('[data-field="uas"]').value);
            if (isNaN(t) || isNaN(u) || isNaN(a)) { dilewati.push(m ? m.nama : nim); return; }
            if (t < 0 || t > 100 || u < 0 || u > 100 || a < 0 || a > 100) {
              UI.toast('Nilai ' + (m ? m.nama : nim) + ' di luar rentang 0–100.', 'error');
              dilewati.push(m ? m.nama : nim);
              return;
            }
            const na = Akademik.hitungNilaiAkhir(t, u, a);
            const g = Akademik.gradeDariPersen(na); /* >= 85 -> A */
            DB.upsertNilai({
              nim: nim, kodeMk: state.kode,
              tugas: t, uts: u, uas: a, skala4: null,
              nilaiAkhir: na, grade: g.huruf, bobot: g.bobot,
              updatedBy: s.nip
            });
            tersimpan++;
          } else {
            const v = parseFloat(tr.querySelector('[data-field="skala4"]').value);
            if (isNaN(v)) { dilewati.push(m ? m.nama : nim); return; }
            if (v < 0 || v > 4) {
              UI.toast('Nilai ' + (m ? m.nama : nim) + ' di luar rentang skala 0.00–4.00.', 'error');
              dilewati.push(m ? m.nama : nim);
              return;
            }
            const g = Akademik.gradeDariSkala4(v); /* 4.0 -> A (mutlak) */
            DB.upsertNilai({
              nim: nim, kodeMk: state.kode,
              tugas: null, uts: null, uas: null, skala4: v,
              nilaiAkhir: v, grade: g.huruf, bobot: g.bobot,
              updatedBy: s.nip
            });
            tersimpan++;
          }
        });

        if (tersimpan > 0) {
          UI.toast('Nilai berhasil disimpan untuk ' + tersimpan + ' mahasiswa!' + (dilewati.length ? ' (' + dilewati.length + ' baris dilewati)' : ''), 'success');
          renderTabel(); /* refresh status "Tersimpan" */
        } else {
          UI.toast('Tidak ada nilai yang tersimpan. Lengkapi input nilai terlebih dahulu.', 'warning');
        }
      } catch (err) {
        console.error('[SIAKAD] Gagal simpan nilai:', err);
        UI.toast('Gagal menyimpan nilai: ' + (err.message || err), 'error');
      }
    }

    /* --- Binding --- */
    function updateModeInfo() {
      if (!modeInfo) return;
      modeInfo.innerHTML = state.mode === 'persen'
        ? 'Nilai Akhir = Tugas 30% + UTS 30% + UAS 40%. <b class="text-emerald-600">Nilai Akhir ≥ 85 otomatis menjadi Grade A (bobot 4.00).</b>'
        : 'Masukkan nilai akhir langsung dalam skala 0.00–4.00. <b class="text-emerald-600">Nilai 4.00 MUTLAK menjadi Grade A (bobot 4.00).</b>';
    }

    selectMk.addEventListener('change', function () {
      state.kode = selectMk.value;
      renderTabel();
    });

    container.querySelectorAll('input[data-mode]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        state.mode = radio.value;
        container.querySelectorAll('[data-mode-label]').forEach(function (lbl) {
          const aktif = lbl.getAttribute('data-mode-label') === state.mode;
          lbl.className = 'flex flex-1 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ' +
            (aktif ? 'border-fti-200 bg-fti-50 text-fti-800 ring-1 ring-fti-200' : 'border-slate-200 bg-white text-slate-600 ring-1 ring-slate-200');
        });
        updateModeInfo();
        renderTabel();
      });
    });

    container.querySelector('#btn-simpan-nilai').addEventListener('click', simpanNilai);

    updateModeInfo();
    renderTabel();
  }

  const DosenPage = {
    dashboard: dashboard,
    mahasiswa: mahasiswa,
    nilai: nilai,
    _pilihMk: null
  };

  global.DosenPage = DosenPage;

})(typeof window !== 'undefined' ? window : globalThis);
