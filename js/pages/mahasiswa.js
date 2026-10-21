/* ============================================================
 * SIAKAD Mini FTI UNG — js/pages/mahasiswa.js
 * Dashboard (IPK & SKS), Jadwal Kuliah, Kontrak KRS Online,
 * dan Transkrip Nilai (KHS).
 * ============================================================ */
(function (global) {
  'use strict';

  const HARI = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  function sessionMahasiswa() {
    const s = Session.get();
    if (!s || s.role !== 'mahasiswa') { App.navigate('#login'); return null; }
    /* Kompatibilitas: sesi lama hanya punya field `id` */
    if (!s.nim) s.nim = s.id;
    return s;
  }

  function sksKrs(nim, db) {
    return db.krs
      .filter(function (k) { return k.nim === nim && k.tahunAkademik === Akademik.TAHUN_AKADEMIK; })
      .reduce(function (sum, k) {
        const mk = db.matakuliah.find(function (m) { return m.kode === k.kodeMk; });
        return sum + (mk ? Number(mk.sks) || 0 : 0);
      }, 0);
  }

  function hariIni() {
    const idx = new Date().getDay(); /* 0=Minggu */
    return HARI[idx - 1] || null;
  }

  /* ============================================================
   * DASHBOARD
   * ============================================================ */
  function dashboard(container) {
    const s = sessionMahasiswa();
    if (!s) return;

    const db = DB.get();
    const mhs = DB.getMahasiswa(s.nim) || { nim: s.nim, nama: s.nama, prodi: '-', semesterAktif: '-', status: '-' };
    const nilai = DB.getNilaiByNim(s.nim);
    const ipkInfo = Akademik.hitungIPK(nilai);
    const status = Akademik.statusIPK(ipkInfo.ipk);
    const totalKrs = sksKrs(s.nim, db);
    const jumlahMkKrs = db.krs.filter(function (k) { return k.nim === s.nim && k.tahunAkademik === Akademik.TAHUN_AKADEMIK; }).length;

    /* Jadwal hari ini dari KRS */
    const hari = hariIni();
    const jadwalHariIni = db.krs
      .filter(function (k) { return k.nim === s.nim && k.tahunAkademik === Akademik.TAHUN_AKADEMIK; })
      .map(function (k) { return db.matakuliah.find(function (m) { return m.kode === k.kodeMk; }); })
      .filter(function (mk) { return mk && (!hari || mk.hari === hari); })
      .sort(function (a, b) { return a.jam.localeCompare(b.jam); });

    /* Nilai terakhir */
    const nilaiTerakhir = nilai.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); }).slice(0, 5);

    const jadwalHtml = jadwalHariIni.length
      ? jadwalHariIni.map(function (mk) {
        return '' +
          '<li class="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">' +
          '  <span class="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-fti-600 ring-1 ring-slate-200">' + UI.icon('calendar', 'h-4.5 w-4.5 h-5 w-5') + '</span>' +
          '  <div class="min-w-0 flex-1">' +
          '    <p class="truncate text-sm font-bold text-slate-700">' + UI.esc(mk.nama) + '</p>' +
          '    <p class="mt-0.5 text-xs text-slate-500">' + UI.esc(mk.kode) + ' · ' + UI.esc(mk.hari) + ', ' + UI.esc(mk.jam) + '</p>' +
          '    <p class="text-xs text-slate-400">' + UI.esc(mk.ruang) + '</p>' +
          '  </div>' +
          '</li>';
      }).join('')
      : UI.empty(hari ? 'Tidak ada kuliah hari ' + hari : 'Jadwal belum tersedia', 'Jadwal diambil dari mata kuliah yang Anda kontrak pada KRS.', 'calendar');

    const nilaiHtml = nilaiTerakhir.length
      ? nilaiTerakhir.map(function (n) {
        const mk = db.matakuliah.find(function (m) { return m.kode === n.kodeMk; }) || { nama: n.kodeMk, sks: 0 };
        return '' +
          '<tr>' +
          '  <td><p class="font-semibold text-slate-700">' + UI.esc(mk.nama) + '</p><p class="text-xs text-slate-400">' + UI.esc(n.kodeMk) + ' · ' + mk.sks + ' SKS</p></td>' +
          '  <td class="text-center font-mono font-bold text-slate-600">' + UI.fmt(n.nilaiAkhir) + '</td>' +
          '  <td class="text-center">' + UI.gradeBadge(n.grade) + '</td>' +
          '  <td class="text-center font-mono text-sm font-semibold text-slate-500">' + UI.fmt(n.bobot) + '</td>' +
          '</tr>';
      }).join('')
      : '<tr><td colspan="4">' + UI.empty('Belum ada nilai', 'Nilai akan muncul setelah dosen menginput di kelas Anda.', 'chart') + '</td></tr>';

    container.innerHTML =
      '<div class="page-enter space-y-6">' +
      /* Sapaan */
      '  <div class="relative overflow-hidden rounded-2xl bg-blue-800 bg-gradient-to-r from-blue-700 to-indigo-900 p-6 text-white shadow-md md:p-7">' +
      '    <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>' +
      '    <div class="relative">' +
      '      <p class="text-xs font-bold uppercase tracking-[0.2em] text-white">DASHBOARD MAHASISWA</p>' +
      '      <h1 class="mt-1.5 text-2xl font-extrabold tracking-tight md:text-3xl text-white">Halo, ' + UI.esc(mhs.nama.split(',')[0]) + '! 👋</h1>' +
      '      <p class="mt-1.5 max-w-2xl text-sm text-white/90">' + UI.esc(mhs.prodi) + ' · Semester ' + UI.esc(mhs.semesterAktif) + ' · Angkatan ' + UI.esc(mhs.angkatan || '-') + ' · Status ' + UI.esc(mhs.status) + '</p>' +
      '      <div class="mt-3 flex flex-wrap gap-2">' +
      UI.badge('NIM ' + mhs.nim, 'slate') +
      '        <span class="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white ring-1 ring-white/25">' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</span>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +

      /* Statistik */
      '  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">' +
      UI.statCard({
        label: 'IPK Kumulatif', value: UI.fmt(ipkInfo.ipk), sub: status.label + ' · dari skala 4.00', icon: 'chart', tone: 'emerald',
        valueHtml: '<span class="font-mono">' + UI.fmt(ipkInfo.ipk) + '</span> <span class="text-sm font-semibold text-slate-400">/ 4.00</span>'
      }) +
      UI.statCard({ label: 'Total SKS Lulus', value: String(ipkInfo.totalSks), sub: nilai.length + ' mata kuliah ber-nilai', icon: 'cap', tone: 'blue' }) +
      UI.statCard({ label: 'KRS Semester Ini', value: String(totalKrs) + ' SKS', sub: jumlahMkKrs + ' mata kuliah dikontrak', icon: 'clipboard', tone: 'violet' }) +
      UI.statCard({ label: 'Status Akademik', value: mhs.status, sub: 'Semester berjalan ' + Akademik.TAHUN_AKADEMIK, icon: 'shield', tone: 'amber' }) +
      '  </div>' +

      /* Jadwal + nilai */
      '  <div class="grid gap-6 lg:grid-cols-5">' +
      '    <div class="lg:col-span-2">' +
      UI.card(hari ? 'Jadwal Hari ' + UI.esc(hari) : 'Jadwal Kuliah',
        '<a href="#mhs-jadwal" data-nav="#mhs-jadwal" class="text-xs font-bold text-fti-600 hover:underline">Lihat semua →</a>',
        '<ul class="space-y-2.5">' + jadwalHtml + '</ul>') +
      '    </div>' +
      '    <div class="lg:col-span-3">' +
      UI.card('Nilai Terakhir',
        '<a href="#mhs-khs" data-nav="#mhs-khs" class="text-xs font-bold text-fti-600 hover:underline">Transkrip lengkap →</a>',
        '<div class="-mx-5 overflow-x-auto px-5"><table class="table-fancy">' +
        '<thead><tr><th>Mata Kuliah</th><th class="text-center">Nilai Akhir</th><th class="text-center">Grade</th><th class="text-center">Bobot</th></tr></thead>' +
        '<tbody>' + nilaiHtml + '</tbody></table></div>') +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  /* ============================================================
   * JADWAL KULIAH
   * ============================================================ */
  function jadwal(container) {
    const s = sessionMahasiswa();
    if (!s) return;

    const db = DB.get();
    const krs = db.krs.filter(function (k) { return k.nim === s.nim && k.tahunAkademik === Akademik.TAHUN_AKADEMIK; });
    const mks = krs.map(function (k) { return db.matakuliah.find(function (m) { return m.kode === k.kodeMk; }); }).filter(Boolean);

    let body;
    if (!mks.length) {
      body = UI.empty('Anda belum mengontrak mata kuliah apa pun', 'Buka menu Kontrak KRS untuk memilih mata kuliah semester ini.', 'calendar');
    } else {
      const hari = hariIni();
      body = '<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">' +
        HARI.filter(function (h) { return mks.some(function (mk) { return mk.hari === h; }); }).map(function (h) {
          const list = mks.filter(function (mk) { return mk.hari === h; }).sort(function (a, b) { return a.jam.localeCompare(b.jam); });
          const isToday = h === hari;
          return '' +
            '<div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ' + (isToday ? 'ring-fti-300' : 'ring-slate-200/70') + '">' +
            '  <div class="flex items-center justify-between px-4 py-3 ' + (isToday ? 'bg-gradient-to-r from-fti-600 to-fti-700 text-white' : 'bg-slate-50 text-slate-700') + '">' +
            '    <p class="text-sm font-extrabold uppercase tracking-wide">' + UI.esc(h) + '</p>' +
            (isToday ? '<span class="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">HARI INI</span>' : '<span class="text-[10px] font-semibold text-slate-400">' + list.length + ' MK</span>') +
            '  </div>' +
            '  <ul class="divide-y divide-slate-100">' +
            list.map(function (mk) {
              const dsn = DB.getDosen(mk.dosenNip);
              return '' +
                '<li class="p-4 transition hover:bg-slate-50">' +
                '  <div class="flex items-start justify-between gap-2">' +
                '    <div class="min-w-0">' +
                '      <p class="text-sm font-bold text-slate-800">' + UI.esc(mk.nama) + '</p>' +
                '      <p class="mt-0.5 font-mono text-xs font-semibold text-fti-600">' + UI.esc(mk.kode) + ' · ' + mk.sks + ' SKS</p>' +
                '    </div>' +
                '    ' + UI.badge(mk.jam, 'blue') +
                '  </div>' +
                '  <p class="mt-2 flex items-center gap-1.5 text-xs text-slate-500">' + UI.icon('building', 'h-3.5 w-3.5') + UI.esc(mk.ruang) + '</p>' +
                '  <p class="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">' + UI.icon('users', 'h-3.5 w-3.5') + UI.esc(dsn ? dsn.nama : 'Dosen belum ditetapkan') + '</p>' +
                '</li>';
            }).join('') +
            '  </ul>' +
            '</div>';
        }).join('') +
        '</div>';
    }

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div>' +
      '      <h1 class="text-xl font-extrabold tracking-tight text-slate-800">Jadwal Kuliah</h1>' +
      '      <p class="text-sm text-slate-400">Jadwal dari mata kuliah yang Anda kontrak · ' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</p>' +
      '    </div>' +
      '    <a href="#mhs-krs" data-nav="#mhs-krs" class="inline-flex items-center gap-2 rounded-xl bg-fti-600 px-4 py-2.5 text-sm font-bold text-white shadow transition hover:bg-fti-700">' + UI.icon('clipboard', 'h-4 w-4') + ' Kelola KRS</a>' +
      '  </div>' +
      body +
      '</div>';
  }

  /* ============================================================
   * KONTRAK KRS ONLINE
   * ============================================================ */
  function krs(container) {
    const s = sessionMahasiswa();
    if (!s) return;

    const db = DB.get();
    const mhs = DB.getMahasiswa(s.nim) || { semesterAktif: 3 };
    const semesterAktif = Number(mhs.semesterAktif) || 3;
    const krsAktif = db.krs.filter(function (k) { return k.nim === s.nim && k.tahunAkademik === Akademik.TAHUN_AKADEMIK; });
    const terdaftar = new Set(krsAktif.map(function (k) { return k.kodeMk; }));
    const sudahNilai = new Set(db.nilai.filter(function (n) { return n.nim === s.nim; }).map(function (n) { return n.kodeMk; }));
    const mkList = db.matakuliah.filter(function (m) { return Number(m.semester) === semesterAktif; })
      .sort(function (a, b) { return a.kode.localeCompare(b.kode); });

    const rowsHtml = mkList.map(function (mk) {
      const dsn = DB.getDosen(mk.dosenNip);
      const checked = terdaftar.has(mk.kode);
      const locked = sudahNilai.has(mk.kode);
      return '' +
        '<tr data-row-mk="' + UI.esc(mk.kode) + '" class="' + (locked ? 'opacity-60' : '') + '">' +
        '  <td class="w-10 text-center">' +
        (locked
          ? '<span class="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-slate-500" title="Sudah memiliki nilai">' + UI.icon('check', 'h-3.5 w-3.5') + '</span>'
          : '<input type="checkbox" value="' + UI.esc(mk.kode) + '" data-kode="' + UI.esc(mk.kode) + '" data-sks="' + mk.sks + '" class="h-4 w-4 cursor-pointer rounded border-slate-300 text-fti-600 focus:ring-fti-500" ' + (checked ? 'checked' : '') + ' />') +
        '  </td>' +
        '  <td><p class="font-mono text-xs font-bold text-fti-600">' + UI.esc(mk.kode) + '</p><p class="font-semibold text-slate-700">' + UI.esc(mk.nama) + '</p>' +
        (locked ? '<p class="text-[11px] font-semibold text-slate-400">Sudah memiliki nilai — tidak dapat dipilih ulang</p>' : '') +
        '  </td>' +
        '  <td class="text-center font-mono font-bold text-slate-600">' + mk.sks + '</td>' +
        '  <td class="text-sm text-slate-500">' + UI.esc(mk.hari) + '<br/><span class="font-mono text-xs">' + UI.esc(mk.jam) + '</span></td>' +
        '  <td class="text-xs text-slate-500">' + UI.esc(mk.ruang) + '</td>' +
        '  <td class="text-xs text-slate-500">' + UI.esc(dsn ? dsn.nama : '-') + '</td>' +
        '  <td class="text-center">' + (checked ? UI.badge('Terdaftar', 'emerald') : (locked ? UI.badge('Selesai', 'slate') : UI.badge('Belum', 'slate'))) + '</td>' +
        '</tr>';
    }).join('');

    container.innerHTML =
      '<div class="page-enter space-y-5">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div>' +
      '      <h1 class="text-xl font-extrabold tracking-tight text-slate-800">Kontrak KRS Online</h1>' +
      '      <p class="text-sm text-slate-400">Pilih mata kuliah semester ' + semesterAktif + ' untuk ' + UI.esc(Akademik.TAHUN_AKADEMIK) + '</p>' +
      '    </div>' +
      '  </div>' +

      /* Info ringkas */
      '  <div class="grid gap-4 sm:grid-cols-3">' +
      UI.statCard({ label: 'NIM', value: s.nim, sub: (mhs.prodi || 'Teknik Informatika'), icon: 'usergroup', tone: 'blue' }) +
      UI.statCard({ label: 'SKS Diambil', valueHtml: '<span id="krs-sks-total">0</span> SKS', sub: 'Maksimal ' + Akademik.MAKS_SKS_KRS + ' SKS per semester', icon: 'cap', tone: 'violet' }) +
      UI.statCard({ label: 'Jumlah Mata Kuliah', valueHtml: '<span id="krs-jumlah-mk">0</span> MK', sub: mkList.length + ' MK tersedia semester ini', icon: 'book', tone: 'amber' }) +
      '  </div>' +

      /* Tabel MK */
      '  <div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
      '    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">' +
      '      <h2 class="text-base font-bold text-slate-800">Daftar Mata Kuliah</h2>' +
      '      <p id="krs-info" class="text-xs font-semibold text-slate-400">Pilih mata kuliah yang ingin dikontrak</p>' +
      '    </div>' +
      (mkList.length
        ? '<div class="max-h-[520px] overflow-y-auto"><table class="table-fancy">' +
        '<thead><tr><th class="text-center">Pilih</th><th>Mata Kuliah</th><th class="text-center">SKS</th><th>Waktu</th><th>Ruang</th><th>Dosen</th><th class="text-center">Status</th></tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody></table></div>'
        : '<div class="p-5">' + UI.empty('Tidak ada mata kuliah untuk semester ini', 'Hubungi admin untuk menambahkan mata kuliah semester ' + semesterAktif + '.', 'book') + '</div>') +
      '    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">' +
      '      <p class="text-xs text-slate-500">Maksimal <b>' + Akademik.MAKS_SKS_KRS + ' SKS</b>. Perubahan hanya tersimpan setelah tombol simpan ditekan.</p>' +
      '      <div class="flex gap-2">' +
      '        <button type="button" id="btn-reset-krs" class="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Muat Ulang</button>' +
      '        <button type="button" id="btn-simpan-krs" class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-fti-600 to-fti-800 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-fti-600/25 transition hover:-translate-y-0.5 active:translate-y-0">' +
      UI.icon('check', 'h-4 w-4') + ' Simpan KRS</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    /* --- Update ringkasan SKS terpilih --- */
    function updateRingkasan() {
      const boxes = Array.prototype.slice.call(container.querySelectorAll('input[data-kode]:checked'));
      const total = boxes.reduce(function (sum, b) { return sum + (Number(b.getAttribute('data-sks')) || 0); }, 0);
      const sksEl = container.querySelector('#krs-sks-total');
      const jmlEl = container.querySelector('#krs-jumlah-mk');
      const infoEl = container.querySelector('#krs-info');
      if (sksEl) sksEl.innerHTML = String(total);
      if (jmlEl) jmlEl.innerHTML = String(boxes.length);
      if (infoEl) {
        infoEl.innerHTML = total > Akademik.MAKS_SKS_KRS
          ? '⚠ Melebihi batas ' + Akademik.MAKS_SKS_KRS + ' SKS!'
          : boxes.length + ' MK dipilih · ' + total + ' SKS';
        infoEl.className = total > Akademik.MAKS_SKS_KRS
          ? 'text-xs font-bold text-red-600'
          : 'text-xs font-semibold text-slate-400';
      }
    }

    container.addEventListener('change', function (e) {
      if (e.target && e.target.matches('input[data-kode]')) updateRingkasan();
    });
    updateRingkasan();

    const btnReset = container.querySelector('#btn-reset-krs');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        krs(container);
        UI.toast('Daftar KRS dimuat ulang dari penyimpanan.', 'info');
      });
    }

    /* --- SIMPAN KRS (wajib tersimpan ke LocalStorage + toast sukses) --- */
    const btnSimpan = container.querySelector('#btn-simpan-krs');
    if (btnSimpan) {
      btnSimpan.addEventListener('click', function () {
        const boxes = Array.prototype.slice.call(container.querySelectorAll('input[data-kode]:checked'));
        /* Ambil kode MK dari atribut data-kode (bukan value default "on") */
        const kodeList = boxes.map(function (b) { return b.getAttribute('data-kode') || b.value; });

        if (!kodeList.length) {
          UI.toast('Pilih minimal satu mata kuliah sebelum menyimpan KRS.', 'warning');
          return;
        }
        const totalSks = boxes.reduce(function (sum, b) { return sum + (Number(b.getAttribute('data-sks')) || 0); }, 0);
        if (totalSks > Akademik.MAKS_SKS_KRS) {
          UI.toast('Total ' + totalSks + ' SKS melebihi batas maksimal ' + Akademik.MAKS_SKS_KRS + ' SKS.', 'error');
          return;
        }

        try {
          btnSimpan.disabled = true;
          btnSimpan.classList.add('opacity-70', 'cursor-wait');
          btnSimpan.innerHTML = UI.icon('refresh', 'h-4 w-4 animate-spin') + ' Menyimpan...';

          const tersimpan = DB.saveKrs(s.nim, kodeList); /* <-- persist ke LocalStorage */
          const cek = DB.getKrsByNim(s.nim, Akademik.TAHUN_AKADEMIK);
          if (cek.length !== tersimpan) throw new Error('Verifikasi penyimpanan KRS gagal.');

          UI.toast('KRS Berhasil Disimpan! (' + tersimpan + ' MK · ' + totalSks + ' SKS)', 'success');

          /* Kembalikan tombol & segarkan data */
          setTimeout(function () {
            try { krs(container); } catch (err) { console.error(err); }
          }, 400);
        } catch (err) {
          console.error('[SIAKAD] Gagal simpan KRS:', err);
          UI.toast('Gagal menyimpan KRS: ' + (err.message || err), 'error');
          btnSimpan.disabled = false;
          btnSimpan.classList.remove('opacity-70', 'cursor-wait');
          btnSimpan.innerHTML = UI.icon('check', 'h-4 w-4') + ' Simpan KRS';
        }
      });
    }
  }

  /* ============================================================
   * TRANSCRIP NILAI (KHS)
   * ============================================================ */
  function khs(container) {
    const s = sessionMahasiswa();
    if (!s) return;

    const db = DB.get();
    const mhs = DB.getMahasiswa(s.nim) || { nama: s.nama };
    const nilai = DB.getNilaiByNim(s.nim);
    const ipkInfo = Akademik.hitungIPK(nilai);
    const status = Akademik.statusIPK(ipkInfo.ipk);

    /* Kelompokkan per semester sesuai kurikulum MK */
    const perSemester = {};
    nilai.forEach(function (n) {
      const mk = db.matakuliah.find(function (m) { return m.kode === n.kodeMk; });
      if (!mk) return;
      const key = Number(mk.semester) || 0;
      if (!perSemester[key]) perSemester[key] = [];
      perSemester[key].push({ n: n, mk: mk });
    });

    const sections = Object.keys(perSemester).map(Number).sort(function (a, b) { return a - b; }).map(function (sem) {
      const rows = perSemester[sem].sort(function (a, b) { return a.mk.kode.localeCompare(b.mk.kode); });
      const sksSem = rows.reduce(function (sum, r) { return sum + r.mk.sks; }, 0);
      const bobotSem = rows.reduce(function (sum, r) { return sum + r.mk.sks * (Number(r.n.bobot) || 0); }, 0);
      const ips = sksSem ? (bobotSem / sksSem) : 0;

      return '' +
        '<div class="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-slate-200/70">' +
        '  <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-50 px-5 py-3">' +
        '    <p class="text-sm font-extrabold text-slate-700">Semester ' + sem + '</p>' +
        '    <p class="text-xs font-semibold text-slate-500">' + sksSem + ' SKS · IPS <span class="font-mono font-bold text-fti-700">' + UI.fmt(ips) + '</span></p>' +
        '  </div>' +
        '  <div class="overflow-x-auto"><table class="table-fancy">' +
        '    <thead><tr><th>Kode</th><th>Mata Kuliah</th><th class="text-center">SKS</th><th class="text-center">Tugas</th><th class="text-center">UTS</th><th class="text-center">UAS</th><th class="text-center">Nilai Akhir</th><th class="text-center">Grade</th><th class="text-center">Bobot</th></tr></thead>' +
        '    <tbody>' +
        rows.map(function (r) {
          const persen = r.n.skala4 == null;
          return '' +
            '<tr>' +
            '  <td class="font-mono text-xs font-bold text-fti-600">' + UI.esc(r.mk.kode) + '</td>' +
            '  <td class="font-semibold text-slate-700">' + UI.esc(r.mk.nama) + '</td>' +
            '  <td class="text-center font-mono font-bold text-slate-600">' + r.mk.sks + '</td>' +
            '  <td class="text-center font-mono text-slate-500">' + (persen ? UI.fmt(r.n.tugas, 0) : '-') + '</td>' +
            '  <td class="text-center font-mono text-slate-500">' + (persen ? UI.fmt(r.n.uts, 0) : '-') + '</td>' +
            '  <td class="text-center font-mono text-slate-500">' + (persen ? UI.fmt(r.n.uas, 0) : '-') + '</td>' +
            '  <td class="text-center font-mono font-bold text-slate-700">' + UI.fmt(r.n.nilaiAkhir) + (persen ? '' : ' <span class="text-[10px] font-semibold text-slate-400">(skala 4)</span>') + '</td>' +
            '  <td class="text-center">' + UI.gradeBadge(r.n.grade) + '</td>' +
            '  <td class="text-center font-mono text-sm font-semibold text-slate-500">' + UI.fmt(r.n.bobot) + '</td>' +
            '</tr>';
        }).join('') +
        '    </tbody>' +
        '  </table></div>' +
        '</div>';
    }).join('');

    container.innerHTML =
      '<div class="page-enter space-y-5 no-print-fix">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div>' +
      '      <h1 class="text-xl font-extrabold tracking-tight text-slate-800">Transkrip Nilai (KHS)</h1>' +
      '      <p class="text-sm text-slate-400">' + UI.esc(mhs.nama) + ' · ' + UI.esc(s.nim) + '</p>' +
      '    </div>' +
      '    <button type="button" id="btn-cetak-transkrip" class="no-print inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow transition hover:bg-slate-50">' + UI.icon('clipboard', 'h-4 w-4') + ' Cetak Transkrip</button>' +
      '  </div>' +

      '  <div class="grid gap-4 sm:grid-cols-3">' +
      UI.statCard({ label: 'IPK Kumulatif', valueHtml: '<span class="font-mono">' + UI.fmt(ipkInfo.ipk) + '</span> <span class="text-sm font-semibold text-slate-400">/ 4.00</span>', sub: 'Predikat: ' + status.label, icon: 'chart', tone: 'emerald' }) +
      UI.statCard({ label: 'Total SKS Lulus', value: String(ipkInfo.totalSks) + ' SKS', sub: nilai.length + ' mata kuliah', icon: 'cap', tone: 'blue' }) +
      UI.statCard({ label: 'Jumlah Semester', value: String(Object.keys(perSemester).length) + ' Semester', sub: 'Terhitung dari nilai yang sudah diinput', icon: 'calendar', tone: 'violet' }) +
      '  </div>' +

      (sections || '<div class="no-print">' + UI.empty('Belum ada nilai', 'Transkrip akan terisi setelah dosen menginput nilai Anda.', 'chart') + '</div>') +
      '</div>';

    const btnCetak = container.querySelector('#btn-cetak-transkrip');
    if (btnCetak) {
      btnCetak.addEventListener('click', function () {
        UI.toast('Menyiapkan cetak transkrip...', 'info');
        setTimeout(function () { window.print(); }, 250);
      });
    }
  }

  global.MahasiswaPage = {
    dashboard: dashboard,
    jadwal: jadwal,
    krs: krs,
    khs: khs
  };

})(typeof window !== 'undefined' ? window : globalThis);
