/* ============================================================
 * SIAKAD Mini FTI UNG — js/data.js
 * LocalStorage Database (siakad_fti_ung_db_v1), Seed Data Dummy,
 * dan Helper Akademik (konversi nilai -> grade, IPK, dst).
 * ============================================================ */
(function (global) {
  'use strict';

  const DB_KEY = 'siakad_fti_ung_db_v1';
  const SESSION_KEY = 'siakad_fti_ung_session_v1';
  const SEED_VERSION = 1;
  const TAHUN_AKADEMIK = 'Ganjil 2025/2026';

  /* ------------------------------------------------------------
   * Util kecil
   * ------------------------------------------------------------ */
  function uid(prefix) {
    return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function round2(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function _read() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('[SIAKAD] Gagal membaca LocalStorage:', e);
      return null;
    }
  }

  function _write(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }

  /* ------------------------------------------------------------
   * Seed Data Dummy (data awal yang valid & siap diuji)
   * ------------------------------------------------------------ */
  function seedMahasiswa() {
    return [
      { nim: '531423001', nama: 'Muhammad Fajar Siddik', password: '123', prodi: 'Teknik Informatika', semesterAktif: 3, angkatan: '2023', email: 'fajar.siddik@student.ung.ac.id', status: 'Aktif' },
      { nim: '531423002', nama: 'Nurul Hikmah Saleh', password: '123', prodi: 'Teknik Informatika', semesterAktif: 3, angkatan: '2023', email: 'nurul.saleh@student.ung.ac.id', status: 'Aktif' },
      { nim: '531423003', nama: 'Adriani Daud', password: '123', prodi: 'Teknik Informatika', semesterAktif: 3, angkatan: '2023', email: 'adriani.daud@student.ung.ac.id', status: 'Aktif' },
      { nim: '531423004', nama: 'Ilham N. Rajab', password: '123', prodi: 'Teknik Informatika', semesterAktif: 3, angkatan: '2023', email: 'ilham.rajab@student.ung.ac.id', status: 'Aktif' },
      { nim: '531423005', nama: 'Siti Aminah Pontoh', password: '123', prodi: 'Teknik Informatika', semesterAktif: 3, angkatan: '2023', email: 'siti.pontoh@student.ung.ac.id', status: 'Aktif' },
      { nim: '531423006', nama: 'Rizky Ramadhan Tantu', password: '123', prodi: 'Teknik Informatika', semesterAktif: 3, angkatan: '2023', email: 'rizky.tantu@student.ung.ac.id', status: 'Aktif' },
      { nim: '531423007', nama: 'Dewi Ayu Lestari', password: '123', prodi: 'Teknik Informatika', semesterAktif: 2, angkatan: '2023', email: 'dewi.lestari@student.ung.ac.id', status: 'Cuti' },
      { nim: '532224001', nama: 'Alfan Maulana', password: '123', prodi: 'Sistem Informasi', semesterAktif: 1, angkatan: '2024', email: 'alfan.maulana@student.ung.ac.id', status: 'Aktif' },
      { nim: '532224002', nama: 'Citra Puspita Nelwan', password: '123', prodi: 'Sistem Informasi', semesterAktif: 1, angkatan: '2024', email: 'citra.nelwan@student.ung.ac.id', status: 'Aktif' },
      { nim: '532224003', nama: 'Hendra K. Mangopa', password: '123', prodi: 'Sistem Informasi', semesterAktif: 1, angkatan: '2024', email: 'hendra.mangopa@student.ung.ac.id', status: 'Aktif' }
    ];
  }

  function seedDosen() {
    return [
      { nip: '19850101', nama: 'Dr. Ir. Muhammad Ruslan Djenundja, S.T., M.T.', password: '123', bidang: 'Kecerdasan Buatan', email: 'ruslan.djenundja@ung.ac.id' },
      { nip: '19790312', nama: 'Dra. Nurhayati Moh. Nusi, S.Kom., M.Si.', password: '123', bidang: 'Basis Data', email: 'nurhayati.nusi@ung.ac.id' },
      { nip: '19881120', nama: 'Ahmad Yani Hanafi, S.Kom., M.T.', password: '123', bidang: 'Jaringan Komputer', email: 'ahmad.hanafi@ung.ac.id' },
      { nip: '19920517', nama: 'Rina S. Tantular, S.T., M.T.', password: '123', bidang: 'Rekayasa Perangkat Lunak', email: 'rina.tantular@ung.ac.id' }
    ];
  }

  function seedAdmin() {
    return [
      { username: 'admin', nama: 'Administrator SIAKAD FTI', password: 'admin' }
    ];
  }

  function seedMatakuliah() {
    return [
      /* Semester 1 */
      { kode: 'IF101', nama: 'Pengantar Teknik Informatika', sks: 3, semester: 1, hari: 'Senin', jam: '08:00 - 10:00', ruang: 'Ruang Kelas A-101', dosenNip: '19850101' },
      { kode: 'IF102', nama: 'Algoritma dan Pemrograman', sks: 4, semester: 1, hari: 'Selasa', jam: '10:00 - 12:00', ruang: 'Lab Komputer 1', dosenNip: '19881120' },
      { kode: 'IF103', nama: 'Logika Informatika', sks: 3, semester: 1, hari: 'Rabu', jam: '08:00 - 10:00', ruang: 'Ruang Kelas A-102', dosenNip: '19790312' },
      { kode: 'MA101', nama: 'Matematika Diskrit', sks: 3, semester: 1, hari: 'Kamis', jam: '13:00 - 15:00', ruang: 'Ruang Kelas B-201', dosenNip: '19920517' },
      /* Semester 2 */
      { kode: 'IF201', nama: 'Struktur Data', sks: 4, semester: 2, hari: 'Senin', jam: '10:00 - 12:00', ruang: 'Lab Komputer 2', dosenNip: '19881120' },
      { kode: 'IF202', nama: 'Basis Data', sks: 3, semester: 2, hari: 'Selasa', jam: '08:00 - 10:00', ruang: 'Lab Basis Data', dosenNip: '19790312' },
      { kode: 'IF203', nama: 'Pemrograman Web', sks: 3, semester: 2, hari: 'Rabu', jam: '13:00 - 15:00', ruang: 'Lab Komputer 1', dosenNip: '19920517' },
      { kode: 'MA202', nama: 'Statistika', sks: 3, semester: 2, hari: 'Jumat', jam: '08:00 - 10:00', ruang: 'Ruang Kelas B-202', dosenNip: '19850101' },
      /* Semester 3 (semester berjalan) */
      { kode: 'IF301', nama: 'Pemrograman Berorientasi Objek', sks: 3, semester: 3, hari: 'Senin', jam: '13:00 - 15:00', ruang: 'Lab Komputer 2', dosenNip: '19920517' },
      { kode: 'IF302', nama: 'Sistem Operasi', sks: 3, semester: 3, hari: 'Selasa', jam: '13:00 - 15:00', ruang: 'Ruang Kelas A-103', dosenNip: '19850101' },
      { kode: 'IF303', nama: 'Jaringan Komputer', sks: 4, semester: 3, hari: 'Rabu', jam: '10:00 - 12:00', ruang: 'Lab Jaringan 2', dosenNip: '19881120' },
      { kode: 'IF304', nama: 'Desain dan Analisis Algoritma', sks: 3, semester: 3, hari: 'Kamis', jam: '10:00 - 12:00', ruang: 'Ruang Kelas A-101', dosenNip: '19790312' },
      /* Semester 4 */
      { kode: 'IF401', nama: 'Rekayasa Perangkat Lunak', sks: 3, semester: 4, hari: 'Senin', jam: '15:00 - 17:00', ruang: 'Ruang Kelas B-201', dosenNip: '19920517' },
      { kode: 'IF402', nama: 'Kecerdasan Buatan', sks: 3, semester: 4, hari: 'Selasa', jam: '15:00 - 17:00', ruang: 'Lab Komputer 3', dosenNip: '19850101' },
      { kode: 'IF403', nama: 'Pemrograman Mobile', sks: 3, semester: 4, hari: 'Rabu', jam: '15:00 - 17:00', ruang: 'Lab Komputer 2', dosenNip: '19881120' },
      { kode: 'IF404', nama: 'Keamanan Informasi', sks: 3, semester: 4, hari: 'Jumat', jam: '10:00 - 12:00', ruang: 'Lab Jaringan 1', dosenNip: '19881120' }
    ];
  }

  function seedKrs() {
    const rows = [];
    const tanggal = nowISO();
    function add(nim, kodeList) {
      kodeList.forEach(function (kode) {
        rows.push({ id: uid('krs'), nim: nim, kodeMk: kode, tahunAkademik: TAHUN_AKADEMIK, tanggal: tanggal });
      });
    }
    add('531423001', ['IF301', 'IF302', 'IF303', 'IF304']); // 13 SKS
    add('531423002', ['IF301', 'IF302', 'IF303']);           // 10 SKS
    add('531423003', ['IF302', 'IF303', 'IF304']);           // 10 SKS
    add('531423004', ['IF302', 'IF304']);                    // 6 SKS
    add('531423005', ['IF301', 'IF304']);                    // 6 SKS
    return rows;
  }

  function seedNilai() {
    /* Format: [nim, kodeMk, tugas, uts, uas] — komponen skala 0-100 */
    const pasangan = [
      ['531423001', 'IF101', 88, 85, 90],
      ['531423001', 'IF102', 92, 88, 94],
      ['531423001', 'IF103', 80, 78, 84],
      ['531423001', 'MA101', 76, 82, 79],
      ['531423001', 'IF201', 90, 86, 92],
      ['531423001', 'IF202', 84, 80, 88],
      ['531423001', 'IF203', 95, 91, 93],
      ['531423001', 'MA202', 72, 75, 70],
      ['531423002', 'IF101', 78, 80, 76],
      ['531423002', 'IF102', 85, 82, 88],
      ['531423002', 'IF103', 70, 68, 74],
      ['531423002', 'MA101', 65, 70, 68],
      ['531423003', 'IF101', 95, 92, 97],
      ['531423003', 'IF102', 90, 94, 91],
      ['531423003', 'IF103', 88, 85, 90],
      ['531423003', 'MA101', 82, 86, 84],
      ['531423004', 'IF101', 60, 65, 62],
      ['531423004', 'IF102', 55, 58, 60],
      ['531423004', 'IF103', 70, 72, 68],
      ['531423005', 'IF101', 84, 80, 86],
      ['531423005', 'IF102', 76, 80, 74],
      ['531423006', 'IF101', 91, 89, 93]
    ];
    return pasangan.map(function (p) {
      const tugas = p[2], uts = p[3], uas = p[4];
      const na = Akademik.hitungNilaiAkhir(tugas, uts, uas);
      const g = Akademik.gradeDariPersen(na);
      return {
        id: uid('nilai'),
        nim: p[0],
        kodeMk: p[1],
        tugas: tugas,
        uts: uts,
        uas: uas,
        skala4: null,
        nilaiAkhir: na,
        grade: g.huruf,
        bobot: g.bobot,
        updatedAt: nowISO(),
        updatedBy: 'seed'
      };
    });
  }

  function buildSeed() {
    return {
      version: SEED_VERSION,
      createdAt: nowISO(),
      tahunAkademik: TAHUN_AKADEMIK,
      admin: seedAdmin(),
      dosen: seedDosen(),
      mahasiswa: seedMahasiswa(),
      matakuliah: seedMatakuliah(),
      krs: seedKrs(),
      nilai: seedNilai()
    };
  }

  /* ------------------------------------------------------------
   * DB — akses LocalStorage
   * ------------------------------------------------------------ */
  const DB = {
    key: DB_KEY,
    sessionKey: SESSION_KEY,

    init: function () {
      let db = _read();
      /* FORCE RE-SEED jika kosong atau tidak valid */
      if (!db || typeof db !== 'object' || db.version !== SEED_VERSION || !Array.isArray(db.mahasiswa) || !Array.isArray(db.dosen) || !Array.isArray(db.admin) || !Array.isArray(db.matakuliah)) {
        db = buildSeed();
        _write(db);
        console.info('[SIAKAD] Seed data dummy dimuat ke LocalStorage (' + DB_KEY + ').');
      }
      /* Pastikan kredensial wajib ada */
      const hasMhs = db.mahasiswa && db.mahasiswa.some(function (m) { return m.nim === '531423001' && m.password === '123'; });
      const hasDsn = db.dosen && db.dosen.some(function (d) { return d.nip === '19850101' && d.password === '123'; });
      const hasAdm = db.admin && db.admin.some(function (a) { return a.username === 'admin' && a.password === 'admin'; });
      if (!hasMhs || !hasDsn || !hasAdm) {
        db = buildSeed();
        _write(db);
        console.info('[SIAKAD] Force re-seed kredensial demo (' + DB_KEY + ').');
      }
      return db;
    },

    get: function () {
      return this.init();
    },

    save: function (db) {
      return _write(db);
    },

    reset: function () {
      const db = buildSeed();
      _write(db);
      return db;
    },

    /* ---- Akun / login ---- */
    findUser: function (role, identifier, password) {
      const db = this.get();
      const id = String(identifier == null ? '' : identifier).trim();
      const pw = String(password == null ? '' : password).trim();
      if (!id || !pw) return null;
      const roleNorm = String(role == null ? '' : role).trim().toLowerCase();

      if (roleNorm === 'mahasiswa' || roleNorm === 'mhs') {
        const m = db.mahasiswa.find(function (x) { return String(x.nim).trim() === id && String(x.password).trim() === pw; });
        return m ? { role: 'mahasiswa', id: m.nim, nama: m.nama, ref: m } : null;
      }
      if (roleNorm === 'dosen' || roleNorm === 'dsn') {
        const d = db.dosen.find(function (x) { return String(x.nip).trim() === id && String(x.password).trim() === pw; });
        return d ? { role: 'dosen', id: d.nip, nama: d.nama, ref: d } : null;
      }
      if (roleNorm === 'admin' || roleNorm === 'administrator') {
        const a = db.admin.find(function (x) { return String(x.username).trim().toLowerCase() === id.toLowerCase() && String(x.password).trim() === pw; });
        return a ? { role: 'admin', id: a.username, nama: a.nama, ref: a } : null;
      }
      return null;
    },

    /* ---- Master lookups ---- */
    getMatakuliah: function (kode) {
      return this.get().matakuliah.find(function (mk) { return mk.kode === kode; }) || null;
    },
    getMahasiswa: function (nim) {
      return this.get().mahasiswa.find(function (m) { return m.nim === nim; }) || null;
    },
    getDosen: function (nip) {
      return this.get().dosen.find(function (d) { return d.nip === nip; }) || null;
    },

    /* ---- KRS ---- */
    getKrsByNim: function (nim, tahun) {
      return this.get().krs.filter(function (k) {
        return k.nim === nim && (!tahun || k.tahunAkademik === tahun);
      });
    },
    getKrsByMk: function (kode, tahun) {
      return this.get().krs.filter(function (k) {
        return k.kodeMk === kode && (!tahun || k.tahunAkademik === tahun);
      });
    },
    /* Menyimpan KRS mahasiswa untuk tahun akademik berjalan (replace). */
    saveKrs: function (nim, kodeList, tahun) {
      const db = this.get();
      const ta = tahun || TAHUN_AKADEMIK;
      const kodeUnik = Array.from(new Set((kodeList || []).filter(Boolean)));
      db.krs = db.krs.filter(function (k) { return !(k.nim === nim && k.tahunAkademik === ta); });
      const tanggal = nowISO();
      kodeUnik.forEach(function (kode) {
        db.krs.push({ id: uid('krs'), nim: nim, kodeMk: kode, tahunAkademik: ta, tanggal: tanggal });
      });
      this.save(db);
      return kodeUnik.length;
    },

    /* ---- Nilai ---- */
    getNilaiByNim: function (nim) {
      return this.get().nilai.filter(function (n) { return n.nim === nim; });
    },
    getNilaiByMk: function (kode) {
      return this.get().nilai.filter(function (n) { return n.kodeMk === kode; });
    },
    upsertNilai: function (rec) {
      const db = this.get();
      const idx = db.nilai.findIndex(function (n) { return n.nim === rec.nim && n.kodeMk === rec.kodeMk; });
      const base = idx >= 0 ? db.nilai[idx] : { id: uid('nilai'), nim: rec.nim, kodeMk: rec.kodeMk };
      const row = Object.assign({}, base, rec, { updatedAt: nowISO() });
      /* Konversi grade MUTLAK dihitung di sini (NA >= 85 -> A, skala 4.0 -> A) */
      const g = Akademik.tentukanGrade(row);
      row.nilaiAkhir = g.nilaiAkhir;
      row.grade = g.huruf;
      row.bobot = g.bobot;
      if (idx >= 0) db.nilai[idx] = row; else db.nilai.push(row);
      this.save(db);
      return row;
    }
  };

  /* ------------------------------------------------------------
   * Akademik — konversi nilai & IPK
   * Aturan MUTLAK:
   *   - Nilai Akhir (0-100) >= 85  -> Grade 'A'
   *   - Input skala 4.0 == 4.0     -> Grade 'A'
   * ------------------------------------------------------------ */
  const Akademik = {
    TAHUN_AKADEMIK: TAHUN_AKADEMIK,
    BOBOT: { tugas: 0.30, uts: 0.30, uas: 0.40 },
    MAKS_SKS_KRS: 24,

    /* Nilai akhir komponen 0-100: Tugas 30% + UTS 30% + UAS 40% */
    hitungNilaiAkhir: function (tugas, uts, uas) {
      const t = Number(tugas) || 0;
      const u = Number(uts) || 0;
      const a = Number(uas) || 0;
      return round2(t * 0.30 + u * 0.30 + a * 0.40);
    },

    /* Konversi skala 0-100 -> huruf grade & bobot */
    gradeDariPersen: function (na) {
      const n = Number(na) || 0;
      if (n >= 85) return { huruf: 'A', bobot: 4.00 };
      if (n >= 80) return { huruf: 'A-', bobot: 3.75 };
      if (n >= 75) return { huruf: 'B+', bobot: 3.50 };
      if (n >= 70) return { huruf: 'B', bobot: 3.00 };
      if (n >= 65) return { huruf: 'C+', bobot: 2.50 };
      if (n >= 60) return { huruf: 'C', bobot: 2.00 };
      if (n >= 50) return { huruf: 'D', bobot: 1.00 };
      return { huruf: 'E', bobot: 0.00 };
    },

    /* Konversi skala 4.0 -> huruf grade. 4.0 MUTLAK menjadi 'A' */
    gradeDariSkala4: function (v) {
      const n = Number(v) || 0;
      if (n >= 4.00) return { huruf: 'A', bobot: 4.00 };
      if (n >= 3.75) return { huruf: 'A-', bobot: 3.75 };
      if (n >= 3.50) return { huruf: 'B+', bobot: 3.50 };
      if (n >= 3.00) return { huruf: 'B', bobot: 3.00 };
      if (n >= 2.50) return { huruf: 'C+', bobot: 2.50 };
      if (n >= 2.00) return { huruf: 'C', bobot: 2.00 };
      if (n >= 1.00) return { huruf: 'D', bobot: 1.00 };
      return { huruf: 'E', bobot: 0.00 };
    },

    /* Menentukan grade dari record nilai (mode persen ATAU skala 4.0) */
    tentukanGrade: function (rec) {
      rec = rec || {};
      const skala4 = rec.skala4;
      if (skala4 !== null && skala4 !== undefined && skala4 !== '' && !isNaN(Number(skala4))) {
        const g = Akademik.gradeDariSkala4(Number(skala4));
        return { metode: 'skala4', nilaiAkhir: round2(Number(skala4)), huruf: g.huruf, bobot: g.bobot };
      }
      const na = Akademik.hitungNilaiAkhir(rec.tugas, rec.uts, rec.uas);
      const g = Akademik.gradeDariPersen(na);
      return { metode: 'persen', nilaiAkhir: na, huruf: g.huruf, bobot: g.bobot };
    },

    /* IPK & total SKS dari daftar record nilai */
    hitungIPK: function (nilaiList) {
      const db = DB.get();
      let totalSks = 0;
      let totalBobot = 0;
      (nilaiList || []).forEach(function (n) {
        const mk = db.matakuliah.find(function (m) { return m.kode === n.kodeMk; });
        if (!mk) return;
        totalSks += Number(mk.sks) || 0;
        totalBobot += (Number(mk.sks) || 0) * (Number(n.bobot) || 0);
      });
      return {
        totalSks: totalSks,
        ipk: totalSks > 0 ? round2(totalBobot / totalSks) : 0
      };
    },

    statusIPK: function (ipk) {
      const n = Number(ipk) || 0;
      if (n >= 3.5) return { label: 'Cum Laude', tone: 'emerald' };
      if (n >= 3.0) return { label: 'Sangat Baik', tone: 'blue' };
      if (n >= 2.5) return { label: 'Baik', tone: 'amber' };
      if (n >= 2.0) return { label: 'Cukup', tone: 'orange' };
      return { label: 'Perlu Perbaikan', tone: 'red' };
    }
  };

  /* ------------------------------------------------------------
   * Export ke global
   * ------------------------------------------------------------ */
  global.DB = DB;
  global.Akademik = Akademik;
  global.SIAKAD_CONST = { DB_KEY: DB_KEY, SESSION_KEY: SESSION_KEY, TAHUN_AKADEMIK: TAHUN_AKADEMIK };

})(typeof window !== 'undefined' ? window : globalThis);
