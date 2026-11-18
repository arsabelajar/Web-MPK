# Web MPK MAN 1 JEMBER (100% Standalone & Offline Ready)

Aplikasi web interaktif dan modern yang dirancang khusus untuk **MPK (Majelis Perwakilan Kelas) MAN 1 JEMBER**, berisikan 3 halaman (*Portofolio*, *Kotak Saran*, *Kumpulan Jawaban Anonim*) yang dilengkapi **Fitur Login Pengurus (Opsional)** berbasis peran (*Role-Based Access Control*).

---

## 🔑 Fitur Login Pengurus (Opsional)

Login bersifat **opsional**. Pengunjung umum (siswa/guru) tetap dapat menjelajahi portofolio (Page 1), mengirim saran (Page 2), serta membaca dan mendukung (*upvote*) jawaban di Page 3 tanpa harus login.

Terdapat 2 jenis akun pengurus yang dapat masuk:

### 1. Akun `admin` (Administrator Utama)
- **Kredensial Demo:** Username: `admin` | Password: `admin123` *(atau cukup `admin`)*
- **Wewenang & Fitur:**
  - ✅ **Menjawab Aspirasi:** Menulis tanggapan resmi, memperbarui status (*Sudah Terjawab*, *Sedang Ditinjau*, *Menunggu Respon*), serta menentukan komisi penanggung jawab.
  - ✅ **Edit Tanggapan:** Memperbarui jawaban yang telah diterbitkan sebelumnya.
  - ✅ **Hapus Aspirasi:** Menghapus pesan/pertanyaan yang tidak layak dari daftar.
  - ✅ **Unduh Rekap Data:** Mengekspor seluruh data aspirasi ke format file `.json`.
  - ✅ **Reset Database:** Mengembalikan data demo awal kapan saja.

### 2. Akun `sekre` (Sekretariat MPK)
- **Kredensial:** Username: `sekre` | Password: `sekre123`
- **Wewenang & Fitur:**
  - ✅ **Khusus Menjawab Pertanyaan:** Menulis dan mempublikasikan tanggapan resmi MPK atas pertanyaan siswa.
  - ❌ **Tidak Bisa Menghapus:** Tombol hapus disembunyikan demi menjaga integritas data.
  - ❌ **Tidak Memiliki Akses Kelola Sistem:** Tidak dapat mereset database atau mengelola konfigurasi administratif.

> **🔒 Keamanan Form Login:** Kotak login dirancang tertutup dan bersih tanpa menampilkan akun/password publik, sehingga hanya pihak pengurus MPK yang mengetahui kredensial yang dapat masuk.

---

## 📑 Struktur 3 Halaman Utama

1. **Page 1: Portofolio MPK MAN 1 JEMBER (`#portofolio`)**
   - Hero banner interaktif dengan statistik real-time.
   - Visi & Misi lembaga legislatif madrasah.
   - Profil 4 Komisi MPK (Komisi A: Legislasi, B: Advokasi & Sarpras, C: Pengawasan OSIS/Ekskul, D: Humas).
   - Program kerja unggulan dengan filter kategori (*Semua*, *Advokasi*, *Musyawarah*).

2. **Page 2: Kotak Saran Siswa (`#kotak-saran`)**
   - Nama bersifat opsional (tersedia opsi *"Kirim Anonim Penuh"*).
   - Kategori aspirasi: Fasilitas, Kesiswaan, Program Kerja, Akademik, Umum.
   - Live counter karakter (maksimal 600 karakter).
   - Dialog konfirmasi mandiri yang menerbitkan **ID Tiket Unik** (misal: `#MPK-9041`).

3. **Page 3: Kumpulan Jawaban & Status Aspirasi (`#jawaban`)**
   - **100% Anonim:** Seluruh aspirasi ditampilkan tanpa menyertakan nama pengirim demi kenyamanan siswa.
   - **Status Respon Transparan:**
     - 🟢 *Sudah Terjawab*
     - 🟡 *Sedang Ditinjau*
     - ⚪ *Menunggu Respon*
   - Pencarian live berdasarkan kata kunci atau nomor tiket.
   - Tombol *"Dukung Aspirasi"* (*upvote*).
   - Tombol *"Tanggapi Aspirasi"* atau *"Hapus"* yang muncul otomatis sesuai peran akun yang sedang login (*Admin* / *Sekre*).

---

## 🚀 Cara Menjalankan

1. **Buka Langsung di Browser:**  
   Klik ganda berkas [index.html](file:///home/kali/Desktop/Web%20mpk/index.html).
2. **Atau Melalui Server Lokal Python:**
   ```bash
   python3 -m http.server 8080
   ```
   Buka di peramban: [http://localhost:8080](http://localhost:8080)

---

## 📁 Struktur Berkas

```
Web mpk/
├── index.html       # Antarmuka 3 Halaman + Modal Login & Banner Role
├── css/
│   └── styles.css   # 100% Standalone CSS (Offline Ready & Responsive)
├── js/
│   ├── data.js      # LocalStorage Handler, AspirasiStore & AuthStore (Admin/Sekre)
│   └── app.js       # Logika Otentikasi, Hak Akses Role, Filter, & Form Handler
└── README.md        # Panduan lengkap penggunaan
```
