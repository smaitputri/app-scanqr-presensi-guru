// Variabel untuk menyimpan mata pelajaran yang dipilih
let selectedSubject = '';

// Fungsi untuk menentukan jam ke berdasarkan range waktu
function getJamPelajaran(waktu) {
    // Parse waktu format HH:MM:SS atau HH:MM
    const timeParts = waktu.split(':');
    const jam = parseInt(timeParts[0]);
    const menit = parseInt(timeParts[1]);
    
    // Konversi ke format HH.MM untuk memudahkan perbandingan
    const waktuDecimal = jam + (menit / 100);
    
    console.log('Waktu:', waktu, 'Decimal:', waktuDecimal.toFixed(2));
    
    // PERBAIKAN: Gunakan range waktu sesuai data yang diminta
    if (waktuDecimal >= 7.30 && waktuDecimal < 8.10) return 1;    // 07.30 - 08.10 Jam ke-1
    if (waktuDecimal >= 8.10 && waktuDecimal < 8.50) return 2;    // 08.10 - 08.50 Jam ke-2
    if (waktuDecimal >= 8.50 && waktuDecimal < 9.30) return 3;    // 08.50 - 09.30 Jam ke-3
    if (waktuDecimal >= 9.30 && waktuDecimal < 10.10) return 4;   // 09.30 - 10.10 Jam ke-4
    if (waktuDecimal >= 10.40 && waktuDecimal < 11.15) return 5;  // 10.40 - 11.15 Jam ke-5
    if (waktuDecimal >= 11.15 && waktuDecimal < 11.50) return 6;  // 11.15 - 11.50 Jam ke-6
    if (waktuDecimal >= 11.50 && waktuDecimal < 12.25) return 7;  // 11.50 - 12.25 Jam ke-7
    if (waktuDecimal >= 12.25 && waktuDecimal < 13.00) return 8;  // 12.25 - 13.00 Jam ke-8
    
    console.log('Waktu di luar jam pelajaran:', waktu);
    return 0; // Di luar jam pelajaran
}


// Fungsi untuk menampilkan pilihan mata pelajaran
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
    
    // Tampilkan section pemilihan mata pelajaran
    subjectSelection.style.display = 'block';
    
    // Sembunyikan scanner container sementara
    document.querySelector('.scanner-container').style.display = 'none';
    document.querySelector('.scanner-controls').style.display = 'none';
    scannerMessage.textContent = "Silakan pilih mata pelajaran terlebih dahulu";
}

// Fungsi untuk menyembunyikan pilihan mata pelajaran
function hideSubjectSelection() {
    const subjectSelection = document.getElementById('subject-selection');
    
    // Sembunyikan section pemilihan mata pelajaran
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
                addPresenceRecord(currentTeacher, classroom, selectedSubject);
                
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
    // PERUBAHAN: Tampilkan pilihan mata pelajaran terlebih dahulu
    showSubjectSelection();
}

// Fungsi untuk mengonfirmasi pilihan mata pelajaran dan memulai scan
function confirmSubjectAndStartScan() {
    const subjectSelect = document.getElementById('subject-select');
    selectedSubject = subjectSelect.value;
    
    if (!selectedSubject) {
        showNotification("Silakan pilih mata pelajaran terlebih dahulu", true);
        return;
    }
    
    // Sembunyikan pilihan mata pelajaran
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
    
    // Reset pilihan mata pelajaran
    selectedSubject = '';
    document.getElementById('subject-select').value = '';
}

// Tambahkan presensi ke daftar
async function addPresenceRecord(teacher, classroom, subject) {
    const now = new Date();
    const dateString = formatDate(now);
    const timeString = formatTime(now);
    
    // Tentukan jam pelajaran berdasarkan waktu
    const jamPelajaran = getJamPelajaran(timeString);
    
    console.log('Presensi:', {
        teacher: teacher.name,
        classroom,
        subject,
        time: timeString,
        jamPelajaran
    });
    
    // Buat record presensi
    const presenceRecord = {
        teacherId: teacher.id,
        teacherName: teacher.name,
        classroom: classroom,
        date: dateString,
        time: timeString,
        timestamp: now.getTime(),
        subjects: subject,
        jamPelajaran: jamPelajaran
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
    
    // Tampilkan notifikasi dengan informasi jam pelajaran
    let jamInfo = "";
    if (jamPelajaran > 0) {
        jamInfo = ` pada Jam ke-${jamPelajaran}`;
    } else {
        jamInfo = " (di luar jam pelajaran)";
    }
    
    if (success) {
        showNotification(`${teacher.name} terekam di ${classroom} untuk mapel ${subject}${jamInfo} pukul ${timeString}`);
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
        const jamInfo = presence.jamPelajaran > 0 ? `Jam ke-${presence.jamPelajaran}` : "Di luar jam";
        
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