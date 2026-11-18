/**
 * Main Application Logic (100% Standalone & Offline Ready)
 * MPK MAN 1 JEMBER Web Application + Role-Based Access (Admin & Sekre)
 */

// Application State
let currentFilterStatus = 'all';
let activeModalQuestionId = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initRouting();
  initModalListeners();
  renderAuthUI();
  renderCounters();
  renderRoleBanner();
  renderQuestionsList();
});

function initModalListeners() {
  // Close modals when clicking on dark backdrop
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });

  // Close modals when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-modal-backdrop.open').forEach(m => m.classList.remove('open'));
    }
  });
}

/* =========================================================================
   1. PAGE ROUTING & NAVIGATION
   ========================================================================= */
function initRouting() {
  window.addEventListener('hashchange', handleHashRoute);
  
  const initialHash = window.location.hash.replace('#', '');
  if (['portofolio', 'kotak-saran', 'jawaban'].includes(initialHash)) {
    switchPage(initialHash, false);
  } else {
    switchPage('portofolio', false);
  }
}

function handleHashRoute() {
  const hash = window.location.hash.replace('#', '');
  if (['portofolio', 'kotak-saran', 'jawaban'].includes(hash)) {
    switchPage(hash, false);
  }
}

function switchPage(pageId, updateHash = true) {
  const validPages = ['portofolio', 'kotak-saran', 'jawaban'];
  if (!validPages.includes(pageId)) return;

  if (updateHash) {
    window.location.hash = pageId;
  }

  // Update Page View Sections
  validPages.forEach(p => {
    const pageEl = document.getElementById(`page-${p}`);
    if (pageEl) {
      if (p === pageId) {
        pageEl.classList.add('active-page');
      } else {
        pageEl.classList.remove('active-page');
      }
    }
  });

  // Update Desktop Nav Buttons
  validPages.forEach(p => {
    const navBtn = document.getElementById(`nav-btn-${p}`);
    if (navBtn) {
      if (p === pageId) {
        navBtn.classList.add('active');
      } else {
        navBtn.classList.remove('active');
      }
    }
  });

  // Re-render data if entering Page 3
  if (pageId === 'jawaban') {
    renderCounters();
    renderRoleBanner();
    renderQuestionsList();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

/* =========================================================================
   2. AUTHENTICATION (LOGIN, LOGOUT, ROLE SWITCHING)
   ========================================================================= */
function renderAuthUI() {
  const user = window.authStore.getUser();
  const navUserArea = document.getElementById('nav-user-area');
  const mobileUserArea = document.getElementById('mobile-user-area');
  const toolbarAuthBtn = document.getElementById('toolbar-auth-btn');

  let navHtml = '';
  let mobileHtml = '';
  let toolbarHtml = '';

  if (user) {
    // Logged in user badge and logout button
    const isAdm = user.role === 'admin';
    const badgeIcon = isAdm ? '🛡️' : '📝';
    const badgeClass = isAdm ? 'user-badge-admin' : 'user-badge-sekre';

    navHtml = `
      <div class="user-badge-nav ${badgeClass}" title="Masuk sebagai ${escapeHtml(user.roleTitle)}">
        <span>${badgeIcon}</span>
        <span>${escapeHtml(user.name)}</span>
      </div>
      <button onclick="handleLogout()" class="btn btn-secondary btn-sm" title="Keluar sesi">
        <span>Keluar</span>
      </button>
    `;

    mobileHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="user-badge-nav ${badgeClass}">
          <span>${badgeIcon}</span>
          <span>${escapeHtml(user.name)}</span>
        </span>
        <button onclick="handleLogout()" class="btn btn-secondary btn-sm">Keluar</button>
      </div>
    `;

    toolbarHtml = `
      <div class="user-badge-nav ${badgeClass}" style="margin-left:auto;">
        <span>${badgeIcon}</span>
        <span>Mode Aktif: <strong>${isAdm ? 'Admin Penuh' : 'Sekretariat'}</strong></span>
      </div>
    `;
  } else {
    // Guest view: Show Login Button
    navHtml = `
      <button onclick="openLoginModal()" class="btn btn-secondary btn-sm" style="border-color:var(--primary); color:var(--primary-dark);">
        <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
        <span>Login Pengurus</span>
      </button>
    `;

    mobileHtml = `
      <button onclick="openLoginModal(); toggleMobileMenu();" class="btn btn-primary btn-sm btn-full">
        <span>🔑 Login Pengurus MPK (Admin / Sekre)</span>
      </button>
    `;

    toolbarHtml = `
      <button onclick="openLoginModal()" class="btn btn-secondary btn-sm" style="margin-left:auto; border-color:var(--slate-300);">
        <span>🔑 Login Pengurus untuk Menjawab</span>
      </button>
    `;
  }

  if (navUserArea) navUserArea.innerHTML = navHtml;
  if (mobileUserArea) mobileUserArea.innerHTML = mobileHtml;
  if (toolbarAuthBtn) toolbarAuthBtn.innerHTML = toolbarHtml;
}

function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.add('open');
    const uInput = document.getElementById('login-username');
    if (uInput) uInput.focus();
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('open');
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const uInput = document.getElementById('login-username');
  const pInput = document.getElementById('login-password');
  const u = uInput.value.trim();
  const p = pInput.value.trim();

  const loggedUser = window.authStore.login(u, p);
  if (loggedUser) {
    closeLoginModal();
    renderAuthUI();
    renderRoleBanner();
    renderQuestionsList();
    
    if (loggedUser.role === 'admin') {
      showToast(`Selamat datang, Administrator MPK! Hak akses penuh aktif.`, 'success');
    } else {
      showToast(`Selamat datang, Sekretariat MPK! Mode menjawab aspirasi aktif.`, 'success');
    }
  } else {
    showToast('Username atau password salah. Akses ditolak.', 'warning');
  }
}

function handleLogout() {
  window.authStore.logout();
  renderAuthUI();
  renderRoleBanner();
  renderQuestionsList();
  showToast('Anda telah keluar dari sesi pengurus.', 'success');
}

function renderRoleBanner() {
  const bannerContainer = document.getElementById('role-status-banner');
  if (!bannerContainer) return;

  const user = window.authStore.getUser();

  if (!user) {
    bannerContainer.innerHTML = `
      <div class="role-banner" style="background:#ffffff; border:1px solid var(--slate-200); color:var(--slate-600);">
        <div style="display:flex; align-items:center; gap:8px;">
          <span>👤</span>
          <span><strong>Mode Pengunjung (Siswa Umum):</strong> Seluruh aspirasi disajikan secara anonim. Anda dapat membaca dan memberikan dukungan (*upvote*).</span>
        </div>
        <button onclick="openLoginModal()" style="background:none; border:none; color:var(--primary); font-weight:700; cursor:pointer; text-decoration:underline;">
          Login Pengurus →
        </button>
      </div>
    `;
    return;
  }

  if (user.role === 'admin') {
    bannerContainer.innerHTML = `
      <div class="role-banner role-banner-admin">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.1rem;">🛡️</span>
          <div>
            <strong>Login sebagai Administrator MPK (Akses Penuh):</strong>
            <p style="font-size:0.75rem; margin-top:2px;">Anda memiliki wewenang untuk menanggapi, mengedit jawaban, menghapus pertanyaan, dan mengunduh rekap data.</p>
          </div>
        </div>
        <div class="admin-control-bar">
          <button onclick="exportDataJSON()" class="btn btn-secondary btn-sm" title="Unduh seluruh data aspirasi ke format JSON">
            <span>📥 Unduh Data Rekap</span>
          </button>
          <button onclick="resetDataDemo()" class="btn btn-secondary btn-sm" title="Pulihkan data bawaan awal">
            <span>↺ Reset Data Demo</span>
          </button>
        </div>
      </div>
    `;
  } else if (user.role === 'sekre') {
    bannerContainer.innerHTML = `
      <div class="role-banner role-banner-sekre">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.1rem;">📝</span>
          <div>
            <strong>Login sebagai Sekretariat MPK (Mode Menjawab Aspirasi):</strong>
            <p style="font-size:0.75rem; margin-top:2px;">Anda berwenang menulis dan mempublikasikan tanggapan resmi MPK atas aspirasi siswa (tanpa izin menghapus data).</p>
          </div>
        </div>
        <span class="brand-tag" style="background:#ccfbf1; color:#0f766e;">Hak Akses: Menjawab Aspirasi</span>
      </div>
    `;
  }
}

/* =========================================================================
   3. PAGE 1: PORTOFOLIO INTERACTIONS
   ========================================================================= */
function filterProker(category) {
  const cards = document.querySelectorAll('.proker-card');
  const buttons = document.querySelectorAll('.filter-bar .filter-btn');

  buttons.forEach(btn => {
    if (btn.getAttribute('data-filter') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* =========================================================================
   4. PAGE 2: KOTAK SARAN FORM HANDLING
   ========================================================================= */
function updateCharCount(textarea) {
  const counter = document.getElementById('char-counter');
  if (counter) {
    counter.textContent = `${textarea.value.length} / 600 karakter`;
  }
}

function toggleAnonymousInput(checkbox) {
  const nameInput = document.getElementById('input-author-name');
  if (!nameInput) return;

  if (checkbox.checked) {
    nameInput.value = '';
    nameInput.disabled = true;
    nameInput.placeholder = '🔒 Identitas 100% Dirahasiakan (Anonim)';
    nameInput.style.backgroundColor = 'var(--slate-100)';
    nameInput.style.cursor = 'not-allowed';
  } else {
    nameInput.disabled = false;
    nameInput.placeholder = 'Contoh: Siswa Kelas XI-IPA / Fulan (Kosongkan jika ingin anonim)';
    nameInput.style.backgroundColor = '#ffffff';
    nameInput.style.cursor = 'text';
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const authorInput = document.getElementById('input-author-name');
  const categoryInput = document.getElementById('input-category');
  const questionInput = document.getElementById('input-question');
  const submitBtn = document.getElementById('btn-submit-form');

  const question = questionInput.value.trim();
  const category = categoryInput.value;
  const authorName = authorInput.disabled ? "Anonim" : authorInput.value.trim();

  if (!question) {
    showToast('Harap tuliskan aspirasi atau pertanyaan Anda.', 'warning');
    return;
  }

  // Loading indicator on button
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Mengirimkan pesan...</span>';

  setTimeout(() => {
    // Save to LocalStorage Store
    const savedItem = window.aspirasiStore.addQuestion(question, category, authorName);

    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      <span>Kirim Pesan / Pertanyaan Sekarang</span>
    `;

    // Reset form
    document.getElementById('feedback-form').reset();
    updateCharCount(document.getElementById('input-question'));
    const anonCheck = document.getElementById('check-anonymous');
    if (anonCheck) {
      anonCheck.checked = false;
      toggleAnonymousInput(anonCheck);
    }

    // Update counters & list
    renderCounters();
    renderQuestionsList();

    // Show standalone confirmation modal with Ticket ID
    openConfirmModal(savedItem.id);
  }, 400);
}

function openConfirmModal(ticketId) {
  const modal = document.getElementById('confirm-modal');
  const ticketLabel = document.getElementById('confirm-modal-ticket-id');
  if (ticketLabel) ticketLabel.textContent = `#${ticketId}`;
  if (modal) modal.classList.add('open');
}

function closeConfirmModalAndStay() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.classList.remove('open');
}

function closeConfirmModalAndGo() {
  closeConfirmModalAndStay();
  switchPage('jawaban');
}

/* =========================================================================
   5. PAGE 3: KUMPULAN JAWABAN (100% ANONIM) + ROLE ACTIONS
   ========================================================================= */
function renderCounters() {
  const stats = window.aspirasiStore.getStats();

  const elTotal = document.getElementById('stat-total');
  const elAnswered = document.getElementById('stat-answered');
  const elInReview = document.getElementById('stat-in-review');
  const elPending = document.getElementById('stat-pending');

  if (elTotal) elTotal.textContent = stats.total;
  if (elAnswered) elAnswered.textContent = stats.answered;
  if (elInReview) elInReview.textContent = stats.inReview;
  if (elPending) elPending.textContent = stats.pending;

  const fAll = document.getElementById('count-filter-all');
  const fAns = document.getElementById('count-filter-answered');
  const fRev = document.getElementById('count-filter-in_review');
  const fPen = document.getElementById('count-filter-pending');

  if (fAll) fAll.textContent = stats.total;
  if (fAns) fAns.textContent = stats.answered;
  if (fRev) fRev.textContent = stats.inReview;
  if (fPen) fPen.textContent = stats.pending;

  const navBadge = document.getElementById('badge-nav-count');
  const navBadgeMobile = document.getElementById('badge-nav-count-mobile');
  if (navBadge) navBadge.textContent = stats.total;
  if (navBadgeMobile) navBadgeMobile.textContent = stats.total;
}

function setStatusFilter(status) {
  currentFilterStatus = status;

  const buttons = document.querySelectorAll('.status-tabs-row .status-tab');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-status') === status) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderQuestionsList();
}

function resetFilters() {
  const searchInput = document.getElementById('search-input');
  const catFilter = document.getElementById('filter-category');

  if (searchInput) searchInput.value = '';
  if (catFilter) catFilter.value = 'all';
  setStatusFilter('all');
}

function renderQuestionsList() {
  const container = document.getElementById('questions-container');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;

  const searchInput = document.getElementById('search-input');
  const catFilter = document.getElementById('filter-category');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCat = catFilter ? catFilter.value : 'all';

  let items = window.aspirasiStore.getAll();

  // Status Filter
  if (currentFilterStatus !== 'all') {
    items = items.filter(item => item.status === currentFilterStatus);
  }

  // Category Filter
  if (selectedCat !== 'all') {
    items = items.filter(item => item.category === selectedCat);
  }

  // Keyword / Ticket ID Search
  if (query) {
    items = items.filter(item => {
      const matchQ = item.question.toLowerCase().includes(query);
      const matchId = item.id.toLowerCase().includes(query);
      const matchCat = item.category.toLowerCase().includes(query);
      const matchAns = item.officialAnswer ? item.officialAnswer.toLowerCase().includes(query) : false;
      return matchQ || matchId || matchCat || matchAns;
    });
  }

  // Handle Empty State
  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  } else {
    if (emptyState) emptyState.style.display = 'none';
  }

  // Check Current User Role for Permissions
  const isAdm = window.authStore.isAdmin();
  const isSek = window.authStore.isSekre();

  // Generate Card List (STRICTLY ANONYMOUS: No Author Name Shown)
  container.innerHTML = items.map(item => {
    // Status Badge
    let statusBadge = '';
    if (item.status === 'answered') {
      statusBadge = `
        <span class="badge-status badge-answered">
          <svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          <span>Sudah Terjawab</span>
        </span>
      `;
    } else if (item.status === 'in_review') {
      statusBadge = `
        <span class="badge-status badge-review">
          <svg viewBox="0 0 24 24"><path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/></svg>
          <span>Sedang Ditinjau</span>
        </span>
      `;
    } else {
      statusBadge = `
        <span class="badge-status badge-pending">
          <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          <span>Menunggu Respon</span>
        </span>
      `;
    }

    // Official Answer segment
    let answerHtml = '';
    if (item.officialAnswer) {
      answerHtml = `
        <div class="q-answer-box">
          <div class="q-answer-header">
            <div class="q-responder">
              <div class="q-responder-badge">
                <svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
              </div>
              <span>Tanggapan Resmi: ${escapeHtml(item.answeredBy || 'Pengurus MPK MAN 1 Jember')}</span>
            </div>
            <span class="q-answer-date">🕒 ${escapeHtml(item.answeredAt || '-')}</span>
          </div>
          <div class="q-answer-content">${escapeHtml(item.officialAnswer)}</div>
        </div>
      `;
    } else {
      answerHtml = `
        <div class="q-pending-box">
          ⏳ Pertanyaan telah tercatat dalam sistem dan sedang dalam antrean pembahasan komisi MPK terkait.
        </div>
      `;
    }

    // Role-Based Actions:
    // - admin: Can Answer/Edit AND Delete
    // - sekre: Can ONLY Answer/Edit (no delete)
    // - guest: Cannot Answer or Delete
    let roleActionsHtml = '';
    if (isAdm) {
      roleActionsHtml = `
        <div class="q-admin-actions" style="background:#fffbeb; border:1px solid #fde68a;">
          <span style="font-size:0.75rem; font-weight:800; color:#92400e; margin-right:auto;">
            🛡️ Aksi Admin:
          </span>
          <button onclick="openAnswerModal('${item.id}')" class="btn btn-primary btn-sm">
            <span>✏️ ${item.officialAnswer ? 'Edit Tanggapan' : 'Tanggapi Aspirasi'}</span>
          </button>
          <button onclick="deleteQuestionItem('${item.id}')" class="btn btn-secondary btn-sm" style="color:#ef4444;" title="Hapus Aspirasi">
            <span>🗑️ Hapus</span>
          </button>
        </div>
      `;
    } else if (isSek) {
      roleActionsHtml = `
        <div class="q-admin-actions" style="background:#f0fdfa; border:1px solid #99f6e4;">
          <span style="font-size:0.75rem; font-weight:800; color:#0f766e; margin-right:auto;">
            📝 Aksi Sekretariat:
          </span>
          <button onclick="openAnswerModal('${item.id}')" class="btn btn-primary btn-sm">
            <span>✏️ ${item.officialAnswer ? 'Edit Tanggapan' : 'Jawab Pertanyaan Ini'}</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="q-card">
        <div class="q-header">
          <div class="q-meta">
            <span class="q-ticket-badge">#${escapeHtml(item.id)}</span>
            <span class="q-cat-badge">🏷️ ${escapeHtml(item.category)}</span>
            <span class="q-date">📅 ${escapeHtml(item.createdAt)}</span>
          </div>
          <div>${statusBadge}</div>
        </div>

        <!-- Strict Anonymity (Author name is 100% hidden) -->
        <div class="q-author-pill">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span>Pengirim: <strong>Anonim</strong> (Identitas Penulis Dirahasiakan)</span>
        </div>

        <div class="q-question-text">
          ${escapeHtml(item.question)}
        </div>

        ${answerHtml}

        <div class="q-footer">
          <button onclick="upvoteQuestion('${item.id}')" class="btn-upvote" title="Klik untuk mendukung aspirasi ini">
            <svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
            <span>Dukung Aspirasi</span>
            <strong style="margin-left:4px;">${item.upvotes || 0}</strong>
          </button>

          <span style="font-size:0.75rem; color:var(--slate-400);">Siswa MAN 1 Jember</span>
        </div>

        ${roleActionsHtml}
      </div>
    `;
  }).join('');
}

/* =========================================================================
   6. ACTIONS: UPVOTE, ANSWER, DELETE, EXPORT
   ========================================================================= */
function upvoteQuestion(id) {
  const newVotes = window.aspirasiStore.upvote(id);
  if (newVotes !== false) {
    renderQuestionsList();
    showToast('Terima kasih telah mendukung aspirasi ini!', 'success');
  }
}

function openAnswerModal(id) {
  const user = window.authStore.getUser();
  if (!user) {
    showToast('Harap login sebagai Admin atau Sekre terlebih dahulu untuk menjawab aspirasi.', 'warning');
    openLoginModal();
    return;
  }

  const items = window.aspirasiStore.getAll();
  const target = items.find(item => item.id === id);
  if (!target) return;

  activeModalQuestionId = id;
  
  const modal = document.getElementById('answer-modal');
  const ticketEl = document.getElementById('modal-ticket-id');
  const questionEl = document.getElementById('modal-question-text');
  const statusSelect = document.getElementById('modal-input-status');
  const responderInput = document.getElementById('modal-input-responder');
  const answerText = document.getElementById('modal-input-answer');

  if (ticketEl) ticketEl.textContent = `#${target.id} — Kategori: ${target.category}`;
  if (questionEl) questionEl.textContent = `"${target.question}"`;
  if (statusSelect) statusSelect.value = target.status || 'answered';

  // Default responder name based on role
  if (responderInput) {
    if (target.answeredBy) {
      responderInput.value = target.answeredBy;
    } else if (user.role === 'sekre') {
      responderInput.value = 'Sekretariat MPK MAN 1 Jember';
    } else {
      responderInput.value = 'Pengurus MPK MAN 1 Jember';
    }
  }

  if (answerText) answerText.value = target.officialAnswer || '';

  if (modal) modal.classList.add('open');
}

function closeAnswerModal() {
  const modal = document.getElementById('answer-modal');
  if (modal) modal.classList.remove('open');
  activeModalQuestionId = null;
}

function saveAnswerFromModal() {
  if (!activeModalQuestionId) return;

  const status = document.getElementById('modal-input-status').value;
  const responder = document.getElementById('modal-input-responder').value;
  const answer = document.getElementById('modal-input-answer').value;

  if (!answer.trim()) {
    showToast('Teks jawaban tidak boleh kosong.', 'warning');
    return;
  }

  window.aspirasiStore.answerQuestion(activeModalQuestionId, answer, status, responder);
  closeAnswerModal();

  renderCounters();
  renderQuestionsList();
  showToast('Tanggapan resmi berhasil dipublikasikan di Page 3!', 'success');
}

function deleteQuestionItem(id) {
  if (!window.authStore.isAdmin()) {
    showToast('Akses ditolak: Hanya Admin yang berhak menghapus pertanyaan.', 'warning');
    return;
  }

  if (confirm(`[Hak Admin] Yakin ingin menghapus pertanyaan #${id}?`)) {
    window.aspirasiStore.deleteQuestion(id);
    renderCounters();
    renderQuestionsList();
    showToast('Pertanyaan berhasil dihapus oleh Admin.', 'success');
  }
}

function resetDataDemo() {
  if (!window.authStore.isAdmin()) {
    showToast('Hanya Admin yang berhak mereset data demo.', 'warning');
    return;
  }

  if (confirm('[Hak Admin] Pulihkan data contoh bawaan? Seluruh aspirasi baru akan direset.')) {
    window.aspirasiStore.resetToDefault();
    renderCounters();
    renderQuestionsList();
    showToast('Data contoh bawaan berhasil dipulihkan.', 'success');
  }
}

function exportDataJSON() {
  if (!window.authStore.isAdmin()) {
    showToast('Hanya Admin yang berhak mengekspor data.', 'warning');
    return;
  }

  const items = window.aspirasiStore.getAll();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `rekap-aspirasi-mpk-${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('File rekap data aspirasi berhasil diunduh.', 'success');
}

/* =========================================================================
   7. UTILITIES (STANDALONE TOAST & HTML ESCAPER)
   ========================================================================= */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
