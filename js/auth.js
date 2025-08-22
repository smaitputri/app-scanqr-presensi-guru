// Fungsi untuk mengirim data presensi ke Google Sheets
async function sendToGoogleSheets(presenceRecord) {
    try {
        // Menggunakan FormData untuk mengirim data
        const formData = new FormData();
        formData.append('teacher', presenceRecord.teacherName);
        formData.append('classroom', presenceRecord.classroom);
        formData.append('date', presenceRecord.date);
        formData.append('time', presenceRecord.time);
        formData.append('subjects', presenceRecord.subjects);
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.text();
        console.log('Google Sheets response:', result);
        return true;
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        showNotification(`Gagal mengirim data: ${error.message}`, true);
        return false;
    }
}

// Update profil guru
function updateProfile() {
    if (!currentTeacher) return;
    
    profileAvatar.textContent = currentTeacher.name.charAt(0);
    profileName.textContent = currentTeacher.name;
    profileNik.textContent = `NIK: ${currentTeacher.nik}`;
    
    // Update mata pelajaran
    subjectBadges.innerHTML = '';
    currentTeacher.subjects.forEach(subject => {
        const badge = document.createElement('span');
        badge.className = 'subject-badge';
        badge.textContent = subject;
        subjectBadges.appendChild(badge);
    });
}