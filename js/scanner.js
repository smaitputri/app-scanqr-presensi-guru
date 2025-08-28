// Variabel untuk menyimpan mata pelajaran dan jam ke yang dipilih
let selectedSubject = '';
let selectedJamKe = '';

// Fungsi untuk menampilkan pilihan mata pelajaran dan jam ke
function showSubjectSelection() {
    const subjectSelection = document.getElementById('subject-selection');
    const subjectSelect = document.getElementById('subject-select');
    
    // Kosongkan dropdown mata pelajaran
    subjectSelect.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>';
    
    // Isi dropdown dengan mata pelajaran guru
    if (currentTeacher && currentTeacher.subjects) {
        currentTeacher.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }
    
    // Reset dropdown jam ke
    document.getElementById('jamke-select').value = '';
    
    // Tampilkan section pemilihan mata pelajaran dan jam ke
    subjectSelection.style.display = 'block';
    
    // Sembunyikan scanner container sementara
    document.querySelector('.scanner-container').style.display = 'none';
    document.querySelector('.scanner-controls').style.display = 'none';
    scannerMessage.textContent = "Silakan pilih mata pelajaran dan jam ke terlebih dahulu";
}

// Fungsi untuk menyembunyikan pilihan mata pelajaran dan jam ke
function hideSubjectSelection() {
    const subjectSelection = document.getElementById('subject-selection');
    
    // Sembunyikan section pemilihan mata pelajaran dan jam ke
    subjectSelection.style.display = 'none';
    
    // Tampilkan kembali scanner container
    document.querySelector('.scanner-container').style.display = 'block';
    document.querySelector('.scanner-controls').style.display = 'flex';
}

// Fungsi untuk scan QR code (sekali saja)
function scanQRCode() {
    if (!scanning) return;
    
    const canvasElement = document.createElement('canvas');
    const canvas = canvasElement.getContext('2d');
    
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        canvasElement.height = videoElement.videoHeight;
        canvasElement.width = videoElement.videoWidth;
        canvas.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
        
        if (code) {
            // QR ditemukan
            const classroom = code.data;
            
            // Cek apakah kelas valid
            if (classrooms.includes(classroom)) {
                // Tambahkan presensi untuk guru yang login
                addPresenceRecord(currentTeacher, classroom, selectedSubject, selectedJamKe);
                
                // Tampilkan pesan sukses
                scannerMessage.innerHTML = `<span style="color: #2ecc71;">Presensi berhasil! ${currentTeacher.name} di ${classroom}</span>`;
                
                // Berhenti scanning setelah berhasil
                stopScanning();
            } else {
                scannerMessage.innerHTML = `<span style="color: #e74c3c;">Kelas tidak dikenali: ${classroom}</span>`;
                
                // Tetap scanning untuk mencoba lagi
                requestAnimationFrame(scanQRCode);
            }
        } else {
            // Tetap scanning jika QR belum ditemukan
            requestAnimationFrame(scanQRCode);
        }
    } else {
        // Tetap scanning jika video belum siap
        requestAnimationFrame(scanQRCode);
    }
}

// Fungsi untuk memulai scanning
async function startScanning() {
    // Tampilkan pilihan mata pelajaran dan jam ke terlebih dahulu
    showSubjectSelection();
}

// Fungsi untuk mengonfirmasi pilihan mata pelajaran dan jam ke, lalu memulai scan
function confirmSubjectAndStartScan() {
    const subjectSelect = document.getElementById('subject-select');
    const jamkeSelect = document.getElementById('jamke-select');
    
    selectedSubject = subjectSelect.value;
    selectedJamKe = jamkeSelect.value;
    
    if (!selectedSubject || !selectedJamKe) {
        showNotification("Silakan pilih mata pelajaran dan jam ke terlebih dahulu", true);
        return;
    }
    
    // Sembunyikan pilihan mata pelajaran dan jam ke
    hideSubjectSelection();
    
    // Mulai proses scanning
    startCameraAndScan();
}

// Fungsi untuk memulai kamera dan scanning
async function startCameraAndScan() {
    try {
        scannerMessage.textContent = "Mengakses kamera...";
        
        // Meminta izin untuk mengakses kamera
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: "environment",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        videoElement.srcObject = videoStream;
        videoElement.play();
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        scanning = true;
        scannerMessage.textContent = "Mengarahkan kamera ke QR Code...";
        
        // Tampilkan laser scanner
        scannerLaser.style.display = 'block';
        
        // Memulai proses scanning (sekali saja)
        scanQRCode();
    } catch (err) {
        console.error("Error accessing camera: ", err);
        scannerMessage.innerHTML = `<span style="color: #e74c3c;">Gagal mengakses kamera: ${err.message}</span>`;
        startBtn.disabled = false;
    }
}

// Fungsi untuk menghentikan scanning
function stopScanning() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    
    scanning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    scannerMessage.textContent = "Scanning dihentikan. Klik 'Mulai Scan' untuk memulai kembali.";
    scannerLaser.style.display = 'none';
    
    // Reset pilihan mata pelajaran dan jam ke
    selectedSubject = '';
    selectedJamKe = '';
    document.getElementById('subject-select').value = '';
    document.getElementById('jamke-select').value = '';
}

// Tambahkan presensi ke daftar
async function addPresenceRecord(teacher, classroom, subject, jamKe) {
    const now = new Date();
    const dateString = formatDate(now);
    const timeString = formatTime(now);
    
    // Buat record presensi
    const presenceRecord = {
        teacherId: teacher.id,
        teacherName: teacher.name,
        classroom: classroom,
        date: dateString,
        time: timeString,
        timestamp: now.getTime(),
        subjects: subject,
        jamPelajaran: jamKe // PERUBAHAN: Gunakan jam ke yang dipilih
    };
    
    // Simpan ke array guru
    teacherPresences.unshift(presenceRecord);
    
    // Simpan ke array semua presensi
    allPresences.unshift(presenceRecord);
    
    // Simpan ke localStorage
    savePresencesToLocalStorage();
    
    // Kirim ke Google Sheets
    const success = await sendToGoogleSheets(presenceRecord);
    
    // Update tampilan
    updatePresenceList();
    updateStats();
    
    // Update tampilan admin jika sedang aktif
    if (adminPage.classList.contains('active')) {
        updateAdminStats();
        updateAdminPresenceList(allPresences);
    }
    
    // Tampilkan notifikasi
    if (success) {
        showNotification(`${teacher.name} terekam di ${classroom} untuk mapel ${subject} pada Jam ke-${jamKe} pukul ${timeString}`);
    }
}

// Update daftar presensi
function updatePresenceList() {
    presenceList.innerHTML = '';
    
    // Tampilkan maksimal 10 presensi terbaru
    const recentPresences = teacherPresences.slice(0, 10);
    
    recentPresences.forEach(presence => {
        const presenceCard = document.createElement('div');
        presenceCard.className = 'presence-card';
        
        // Jika presensi kurang dari 10 menit yang lalu, tambahkan class "new"
        const now = new Date();
        const presenceTime = new Date(presence.timestamp);
        const minutesDiff = (now - presenceTime) / (1000 * 60);
        
        if (minutesDiff < 10) {
            presenceCard.classList.add('new');
        }
        
        // PERUBAHAN: Tambahkan informasi jam pelajaran
        const jamInfo = presence.jamPelajaran > 0 ? `Jam ke-${presence.jamPelajaran}` : "Belum ditentukan";
        
        presenceCard.innerHTML = `
            <div class="avatar">${presence.teacherName.charAt(0)}</div>
            <div class="info">
                <div class="name">${presence.teacherName}</div>
                <div class="details">
                    <div class="classroom">${presence.classroom}</div>
                    <div class="subject">${presence.subjects}</div>
                    <div class="jam-pelajaran">${jamInfo}</div>
                    <div class="date">${presence.date}</div>
                    <div class="time">${presence.time}</div>
                </div>
            </div>
        `;
        
        presenceList.appendChild(presenceCard);
    });
}

// Update statistik dashboard
function updateStats() {
    if (!currentTeacher) return;
    
    const today = formatDate(new Date());
    
    // Hitung presensi hari ini
    const todayPresences = teacherPresences.filter(p => p.date === today && p.teacherId === currentTeacher.id);
    
    // Hanya menampilkan jumlah presensi hari ini
    todayPresenceElement.textContent = todayPresences.length;
}