// Inisialisasi variabel
let videoStream = null;
let scanning = false;
let currentTeacher = null;
let teacherPresences = [];
let allPresences = [];

// DOM Elements
const loginPage = document.getElementById('login-page');
const appContainer = document.getElementById('app-container');
const nupyInput = document.getElementById('nupy-input');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');

const videoElement = document.getElementById('video');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const scannerMessage = document.getElementById('scanner-message');
const scannerLaser = document.getElementById('scanner-laser');
const presenceList = document.getElementById('presence-list');
const notification = document.getElementById('notification');
const todayPresenceElement = document.getElementById('today-presence');
const currentDateTimeElement = document.getElementById('current-date-time');

const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileNupy = document.getElementById('profile-nupy');
const subjectBadges = document.getElementById('subject-badges');
const logoutBtn = document.getElementById('logout-btn');

const scannerBtn = document.getElementById('scanner-btn');
const dashboardBtn = document.getElementById('dashboard-btn');
const profileBtn = document.getElementById('profile-btn');
const adminBtn = document.getElementById('admin-btn');
const daftarHadirBtn = document.getElementById('daftar-hadir-btn');
const scannerPage = document.getElementById('scanner-page');
const dashboardPage = document.getElementById('dashboard-page');
const profilePage = document.getElementById('profile-page');
const adminPage = document.getElementById('admin-page');
const daftarHadirPage = document.getElementById('daftar-hadir-page');

// Admin elements
const viewAllBtn = document.getElementById('view-all-btn');
const viewTodayBtn = document.getElementById('view-today-btn');
const exportExcelBtn = document.getElementById('export-excel-btn');
const totalTeachersElement = document.getElementById('total-teachers');
const presentTodayElement = document.getElementById('present-today');
const totalPresenceElement = document.getElementById('total-presence');
const adminPresenceList = document.getElementById('admin-presence-list');

// QR Generator elements
const classroomSelect = document.getElementById('classroom-select');
const generateQrBtn = document.getElementById('generate-qr-btn');
const qrPreview = document.getElementById('qr-preview');
const qrCanvas = document.getElementById('qr-canvas');
const qrClassName = document.getElementById('qr-class-name');
const downloadQrBtn = document.getElementById('download-qr-btn');

// Excel Export elements
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const generateExcelBtn = document.getElementById('generate-excel-btn');
const exportStatus = document.getElementById('export-status');

// PERUBAHAN: Elemen untuk pemilihan mata pelajaran
const confirmSubjectBtn = document.getElementById('confirm-subject-btn');

// Inisialisasi aplikasi
function initApp() {
    // Display daftar hadir button for admin only
    if(currentTeacher && currentTeacher.id === 0) {
        daftarHadirBtn.style.display = 'block';
    }
    // Update waktu secara real-time
    setInterval(updateDateTime, 1000);
    updateDateTime();
    
    // Isi dropdown kelas untuk QR Generator
    classrooms.forEach(classroom => {
        const option = document.createElement('option');
        option.value = classroom;
        option.textContent = classroom;
        classroomSelect.appendChild(option);
    });
    
    // Set tanggal untuk export Excel (default: hari ini)
    const today = new Date();
    startDateInput.value = today.toISOString().split('T')[0];
    endDateInput.value = today.toISOString().split('T')[0];
    
    // Event listener untuk input NUPY
    nupyInput.addEventListener('input', function() {
        // Isi otomatis password dengan nilai NUPY
        passwordInput.value = this.value;
    });
    
    // Event listener untuk tombol login
    loginBtn.addEventListener('click', function() {
        const nupy = nupyInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!nupy || !password) {
            loginError.textContent = "Masukkan 4 angka terakhir NUPY dan password!";
            loginError.style.display = 'block';
            return;
        }
        
        // Melakukan login dengan NUPY
        const teacher = loginWithNUPY(nupy, password);
        
        if (teacher) {
            // Login berhasil
            currentTeacher = teacher;
            
            // Tampilkan atau sembunyikan tombol admin berdasarkan role
            adminBtn.style.display = teacher.id === 0 ? 'block' : 'none';
            daftarHadirBtn.style.display = teacher.id === 0 ? 'block' : 'none';
            
            // Load presensi dari localStorage
            loadPresencesFromLocalStorage();
            
            // Update UI
            updateProfile();
            
            if (teacher.id !== 0) {
                // Jika bukan admin, update presence list dan stats
                updatePresenceList();
                updateStats();
            }
            
            // Sembunyikan login page, tampilkan aplikasi
            loginPage.style.display = 'none';
            appContainer.style.display = 'block';
            
            // Reset form login
            nupyInput.value = '';
            passwordInput.value = '';
            loginError.style.display = 'none';
            
            // Buka halaman yang sesuai
            if (teacher.id === 0) {
                adminBtn.click(); // Buka halaman admin untuk admin
            } else {
                dashboardBtn.click(); // Buka dashboard untuk guru
            }
        } else {
            // Login gagal
            loginError.textContent = "NUPY atau password salah!";
            loginError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Event listener untuk tekan enter di input password
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // Event listener untuk tekan enter di input NUPY
    nupyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // PERUBAHAN: Event listener untuk tombol konfirmasi mata pelajaran
    confirmSubjectBtn.addEventListener('click', confirmSubjectAndStartScan);
    
    // Event listener untuk scanner
    startBtn.addEventListener('click', startScanning);
    
    // Berhenti scanning
    stopBtn.addEventListener('click', stopScanning);
    
    // Event listener untuk tombol admin
    viewAllBtn.addEventListener('click', function() {
        updateAdminPresenceList(allPresences);
    });
    
    viewTodayBtn.addEventListener('click', function() {
        const today = formatDate(new Date());
        const todayPresences = allPresences.filter(p => p.date === today);
        updateAdminPresenceList(todayPresences);
    });

    // Event listener untuk tombol Daftar Hadir
    daftarHadirBtn.addEventListener('click', function() {
        scannerPage.classList.remove('active');
        dashboardPage.classList.remove('active');
        profilePage.classList.remove('active');
        adminPage.classList.remove('active');
        daftarHadirPage.classList.add('active');
        scannerBtn.classList.remove('btn-primary');
        scannerBtn.classList.add('btn-secondary');
        dashboardBtn.classList.remove('btn-primary');
        dashboardBtn.classList.add('btn-secondary');
        profileBtn.classList.remove('btn-primary');
        profileBtn.classList.add('btn-secondary');
        adminBtn.classList.remove('btn-primary');
        adminBtn.classList.add('btn-admin');
        daftarHadirBtn.classList.remove('btn-primary');
        daftarHadirBtn.classList.add('btn-secondary');
        daftarHadirBtn.classList.remove('btn-secondary');
        daftarHadirBtn.classList.add('btn-primary');
        
        // Load data dari Google Sheets secara otomatis
        fetchAndRenderSheetsData();
    });

    // Event listener untuk QR Generator
    generateQrBtn.addEventListener('click', function() {
        const selectedClassroom = classroomSelect.value;
        if (!selectedClassroom) {
            alert("Pilih kelas terlebih dahulu!");
            return;
        }
        generateQRCode(selectedClassroom);
    });
    
    downloadQrBtn.addEventListener('click', downloadQRCode);
    
    // Event listener untuk export Excel
    generateExcelBtn.addEventListener('click', exportToExcel);
    
    // Navigasi halaman
    scannerBtn.addEventListener('click', function() {
        scannerPage.classList.add('active');
        dashboardPage.classList.remove('active');
        profilePage.classList.remove('active');
        adminPage.classList.remove('active');
        daftarHadirPage.classList.remove('active');
        scannerBtn.classList.remove('btn-secondary');
        scannerBtn.classList.add('btn-primary');
        dashboardBtn.classList.remove('btn-primary');
        dashboardBtn.classList.add('btn-secondary');
        profileBtn.classList.remove('btn-primary');
        profileBtn.classList.add('btn-secondary');
        adminBtn.classList.remove('btn-primary');
        adminBtn.classList.add('btn-admin');
    });
    
    dashboardBtn.addEventListener('click', function() {
        scannerPage.classList.remove('active');
        dashboardPage.classList.add('active');
        profilePage.classList.remove('active');
        adminPage.classList.remove('active');
        daftarHadirPage.classList.remove('active');
        scannerBtn.classList.remove('btn-primary');
        scannerBtn.classList.add('btn-secondary');
        dashboardBtn.classList.remove('btn-secondary');
        dashboardBtn.classList.add('btn-primary');
        profileBtn.classList.remove('btn-primary');
        profileBtn.classList.add('btn-secondary');
        adminBtn.classList.remove('btn-primary');
        adminBtn.classList.add('btn-admin');
        
        // Update data saat membuka dashboard
        updatePresenceList();
        updateStats();
    });
    
    profileBtn.addEventListener('click', function() {
        scannerPage.classList.remove('active');
        dashboardPage.classList.remove('active');
        profilePage.classList.add('active');
        adminPage.classList.remove('active');
        daftarHadirPage.classList.remove('active');
        scannerBtn.classList.remove('btn-primary');
        scannerBtn.classList.add('btn-secondary');
        dashboardBtn.classList.remove('btn-primary');
        dashboardBtn.classList.add('btn-secondary');
        profileBtn.classList.remove('btn-secondary');
        profileBtn.classList.add('btn-primary');
        adminBtn.classList.remove('btn-primary');
        adminBtn.classList.add('btn-admin');
    });
    
    adminBtn.addEventListener('click', function() {
        scannerPage.classList.remove('active');
        dashboardPage.classList.remove('active');
        profilePage.classList.remove('active');
        adminPage.classList.add('active');
        daftarHadirPage.classList.remove('active');
        scannerBtn.classList.remove('btn-primary');
        scannerBtn.classList.add('btn-secondary');
        dashboardBtn.classList.remove('btn-primary');
        dashboardBtn.classList.add('btn-secondary');
        profileBtn.classList.remove('btn-primary');
        profileBtn.classList.add('btn-secondary');
        adminBtn.classList.remove('btn-admin');
        adminBtn.classList.add('btn-primary');
        
        // Update data admin
        updateAdminStats();
        updateAdminPresenceList(allPresences);
    });
    
    // Fungsi logout
    logoutBtn.addEventListener('click', function() {
        currentTeacher = null;
        teacherPresences = [];
        
        // Sembunyikan aplikasi, tampilkan login page
        appContainer.style.display = 'none';
        loginPage.style.display = 'flex';
        
        // Reset form login
        nupyInput.value = '';
        passwordInput.value = '';
        loginError.style.display = 'none';
    });
}

// Fungsi untuk fetch data dari Google Sheets dan render tabel
async function fetchAndRenderSheetsData() {
    adminPresenceList.innerHTML = '<div class="loading">Memuat data dari Google Sheets...</div>';
    
    try {
        const url = `${GOOGLE_SCRIPT_URL}?action=get`;
        const response = await fetch(url);
        const json = await response.json();
        
        if (json.status === 'success' && Array.isArray(json.data)) {
            renderSheetsTable(json.data);
        } else {
            adminPresenceList.innerHTML = '<div class="error">Gagal mengambil data: ' + (json.message || 'Unknown error') + '</div>';
        }
    } catch (err) {
        adminPresenceList.innerHTML = '<div class="error">Error: ' + err.message + '</div>';
    }
}

// Fungsi untuk render tabel dari data Google Sheets
function renderSheetsTable(data) {
    if (!data || data.length === 0) {
        adminPresenceList.innerHTML = '<div class="empty">Tidak ada data presensi.</div>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'presence-table';
    
    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Timestamp', 'Nama Guru', 'Kelas', 'Hari', 'Tanggal', 'Waktu', 'Mata Pelajaran', 'Jam ke'];
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Body
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        [
            row['Timestamp'] || '',
            row['Nama Guru'] || row.teacher || '',
            row['Kelas'] || row.classroom || '',
            row['Hari'] || row.hari || '',
            row['Tanggal'] || row.date || '',
            row['Waktu'] || row.time || '',
            row['Mata Pelajaran'] || row.subjects || '',
            row['Jam ke'] || row.jam_ke || ''
        ].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    adminPresenceList.innerHTML = '';
    adminPresenceList.appendChild(table);
}

// Jalankan aplikasi saat halaman dimuat
window.addEventListener('load', initApp);