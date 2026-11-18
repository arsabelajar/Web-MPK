/**
 * Data Management & LocalStorage Handler
 * MPK MAN 1 JEMBER Aspirasi System + Auth Store
 */

const STORAGE_KEY = 'mpk_man1jember_aspirasi_v1';
const AUTH_STORAGE_KEY = 'mpk_man1jember_current_user_v1';

// Initial realistic default data
const INITIAL_QUESTIONS = [
  {
    id: "MPK-9041",
    category: "Fasilitas",
    question: "Apakah kipas angin dan proyektor di beberapa ruang kelas lantai 2 gedung barat bisa dijadwalkan perawatan rutin? Terkadang proyektor mendadak mati di tengah jam pelajaran.",
    createdAt: "16 Nov 2026, 08:30 WIB",
    status: "answered", // 'answered' | 'in_review' | 'pending'
    officialAnswer: "Assalamu'alaikum wr. wb. Terima kasih atas aspirasinya! Komisi B (Sarana & Prasarana) telah berkoordinasi langsung dengan pihak Waka Sarpras pada hari Senin kemarin. Tim teknisi madrasah telah menjadwalkan pengecekan dan penggantian kabel HDMI/power untuk ruang kelas lantai 2 mulai akhir pekan ini.",
    answeredAt: "17 Nov 2026, 13:45 WIB",
    answeredBy: "Komisi B (Sarpras & Advokasi) MPK",
    upvotes: 28
  },
  {
    id: "MPK-8820",
    category: "Kesiswaan",
    question: "Untuk kegiatan Class Meeting semester ini, apakah cabang e-sports dan lomba debat keislaman bisa dimasukkan ke dalam daftar lomba antarkelas?",
    createdAt: "15 Nov 2026, 14:10 WIB",
    status: "answered",
    officialAnswer: "Terima kasih atas usulannya yang sangat kreatif! Aspirasi ini telah kami bahas bersama pengurus OSIS bidang Olahraga & Seni. Cabang e-sports (Mobile Legends) dan Debat Keislaman telah disetujui masuk juknis Class Meeting tahun ini dengan panduan teknis yang akan diumumkan segera.",
    answeredAt: "16 Nov 2026, 10:20 WIB",
    answeredBy: "Presidium Komisi C (Pengawasan OSIS & Event)",
    upvotes: 45
  },
  {
    id: "MPK-8715",
    category: "Program Kerja",
    question: "Bagaimana alur dan transparansi bagi organisasi/ekstrakurikuler yang ingin mengajukan proposal kegiatan ke pihak MPK untuk peninjauan anggaran?",
    createdAt: "14 Nov 2026, 11:05 WIB",
    status: "answered",
    officialAnswer: "Alur pengajuan proposal kegiatan ekskul dapat diajukan minimal H-14 kegiatan ke Komisi Pengawasan & Anggaran MPK melalui ruang sekretariat MPK atau via email resmi MPK. Bagan SOP alur proposal juga telah kami tempel di mading madrasah dan highlight IG @mpkman1jember.",
    answeredAt: "15 Nov 2026, 09:00 WIB",
    answeredBy: "Badan Pengurus Harian (BPH) MPK",
    upvotes: 19
  },
  {
    id: "MPK-8604",
    category: "Akademik",
    question: "Apakah jam buka perpustakaan madrasah bisa diperpanjang hingga pukul 16.30 WIB untuk siswa yang ingin belajar mandiri atau mengerjakan tugas kelompok sepulang sekolah?",
    createdAt: "17 Nov 2026, 15:20 WIB",
    status: "in_review",
    officialAnswer: "Aspirasi sedang dalam tahap audiensi dengan Kepala Perpustakaan MAN 1 Jember dan Waka Kurikulum terkait ketersediaan staf pendamping perpustakaan sore hari. Hasil audiensi akan segera diumumkan di sini.",
    answeredAt: "18 Nov 2026, 08:30 WIB",
    answeredBy: "Komisi A (Aspirasi & Kebijakan Madrasah)",
    upvotes: 32
  },
  {
    id: "MPK-8501",
    category: "Umum",
    question: "Apakah boleh diadakan sesi 'Curhat Bersama MPK' secara luring tiap bulan agar siswa bisa langsung berdialog santai tanpa rasa canggung?",
    createdAt: "18 Nov 2026, 09:15 WIB",
    status: "pending",
    officialAnswer: null,
    answeredAt: null,
    answeredBy: null,
    upvotes: 12
  }
];

class AspirasiStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.saveAll(INITIAL_QUESTIONS);
    }
  }

  getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_QUESTIONS;
    } catch (e) {
      console.error("Gagal membaca LocalStorage:", e);
      return INITIAL_QUESTIONS;
    }
  }

  saveAll(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Gagal menyimpan ke LocalStorage:", e);
    }
  }

  addQuestion(questionText, category = "Umum", authorName = "") {
    const items = this.getAll();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `MPK-${randomNum}`;
    
    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newItem = {
      id: newId,
      category: category || "Umum",
      question: questionText.trim(),
      authorPrivateName: authorName.trim() || "Anonim",
      createdAt: formattedDate,
      status: "pending",
      officialAnswer: null,
      answeredAt: null,
      answeredBy: null,
      upvotes: 0
    };

    items.unshift(newItem);
    this.saveAll(items);
    return newItem;
  }

  answerQuestion(id, answerText, status = "answered", answeredBy = "Pengurus MPK MAN 1 Jember") {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    items[index].status = status;
    items[index].officialAnswer = answerText.trim();
    items[index].answeredAt = formattedDate;
    items[index].answeredBy = answeredBy.trim() || "Pengurus MPK MAN 1 Jember";

    this.saveAll(items);
    return items[index];
  }

  upvote(id) {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return false;

    items[index].upvotes = (items[index].upvotes || 0) + 1;
    this.saveAll(items);
    return items[index].upvotes;
  }

  deleteQuestion(id) {
    let items = this.getAll();
    items = items.filter(item => item.id !== id);
    this.saveAll(items);
    return true;
  }

  resetToDefault() {
    this.saveAll(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  }

  getStats() {
    const items = this.getAll();
    const total = items.length;
    const answered = items.filter(item => item.status === 'answered').length;
    const inReview = items.filter(item => item.status === 'in_review').length;
    const pending = items.filter(item => item.status === 'pending').length;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    return { total, answered, inReview, pending, percentage };
  }
}

/* =========================================================================
   AUTH STORE (USER LOGIN: ADMIN & SEKRE)
   ========================================================================= */
const AUTH_USERS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator MPK',
    roleTitle: 'Admin Utama (Akses Penuh)',
    badgeClass: 'user-badge-admin'
  },
  sekre: {
    username: 'sekre',
    password: 'sekre123',
    role: 'sekre',
    name: 'Sekretariat MPK',
    roleTitle: 'Sekretaris (Khusus Menjawab)',
    badgeClass: 'user-badge-sekre'
  }
};

class AuthStore {
  constructor() {
    this.currentUser = this.loadUser();
  }

  loadUser() {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  login(username, password) {
    const u = username.toLowerCase().trim();
    const p = password.trim();

    if (AUTH_USERS[u] && AUTH_USERS[u].password === p) {
      const userData = {
        username: AUTH_USERS[u].username,
        role: AUTH_USERS[u].role,
        name: AUTH_USERS[u].name,
        roleTitle: AUTH_USERS[u].roleTitle,
        badgeClass: AUTH_USERS[u].badgeClass
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      this.currentUser = userData;
      return userData;
    }
    return null;
  }

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.currentUser = null;
  }

  getUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  }

  isSekre() {
    return this.currentUser && this.currentUser.role === 'sekre';
  }
}

// Global instances
window.aspirasiStore = new AspirasiStore();
window.authStore = new AuthStore();
