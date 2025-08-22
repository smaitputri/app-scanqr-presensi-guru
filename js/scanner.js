// Fungsi untuk scan QR code
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
                addPresenceRecord(currentTeacher, classroom);
                
                // Tampilkan pesan sukses
                scannerMessage.innerHTML = `<span style="color: #2ecc71;">Presensi berhasil! ${currentTeacher.name} di ${classroom}</span>`;
                
                // Berhenti scanning sementara
                scanning = false;
                setTimeout(() => {
                    scannerMessage.textContent = "Arahkan kamera ke QR Code berikutnya...";
                    scanning = true;
                    scanQRCode();
                }, 3000);
            } else {
                scannerMessage.innerHTML = `<span style="color: #e74c3c;">Kelas tidak dikenali: ${classroom}</span>`;
                requestAnimationFrame(scanQRCode);
            }
        } else {
            requestAnimationFrame(scanQRCode);
        }
    } else {
        requestAnimationFrame(scanQRCode);
    }
}

// Tambahkan presensi ke daftar
async function addPresenceRecord(teacher, classroom) {
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
        subjects: teacher.subjects.join(", ")
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
        showNotification(`${teacher.name} terekam di ${classroom} pukul ${timeString}`);
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
        
        presenceCard.innerHTML = `
            <div class="avatar">${presence.teacherName.charAt(0)}</div>
            <div class="info">
                <div class="name">${presence.teacherName}</div>
                <div class="details">
                    <div class="classroom">${presence.classroom}</div>
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
    const todayClasses = [...new Set(todayPresences.map(p => p.classroom))];
    
    // Hitung jam mengajar (asumsi 2 jam per kelas)
    const teachingHours = todayClasses.length * 2;
    
    todayPresenceElement.textContent = todayPresences.length;
    classesTaughtElement.textContent = todayClasses.length;
    teachingHoursElement.textContent = teachingHours;
}