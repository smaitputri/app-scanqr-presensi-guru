// Fungsi untuk mengirim data presensi ke Google Sheets
async function sendToGoogleSheets(presenceRecord) {
  try {
    // Menggunakan FormData untuk mengirim data
    const formData = new FormData();
    formData.append('teacher', presenceRecord.teacherName);
    formData.append('classroom', presenceRecord.classroom);
    formData.append('date', presenceRecord.date); // Format: dd/mm/yyyy
    formData.append('time', presenceRecord.time); // Format: hh:mm:ss (akan dipotong menjadi hh:mm)
    formData.append('subjects', presenceRecord.subjects);
    formData.append('jamPelajaran', presenceRecord.jamPelajaran || 0);
    
    console.log('Mengirim data ke Google Sheets:', {
      teacher: presenceRecord.teacherName,
      classroom: presenceRecord.classroom,
      date: presenceRecord.date,
      time: presenceRecord.time,
      jamPelajaran: presenceRecord.jamPelajaran
    });
    
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
    profileNupy.textContent = `NUPY: ${currentTeacher.nupy}`;
    
    // Update mata pelajaran
    subjectBadges.innerHTML = '';
    currentTeacher.subjects.forEach(subject => {
        const badge = document.createElement('span');
        badge.className = 'subject-badge';
        badge.textContent = subject;
        subjectBadges.appendChild(badge);
    });
}

// PERUBAHAN: Fungsi untuk melakukan login dengan NUPY
function loginWithNUPY(nupy, password) {
    // Cek jika login sebagai admin
    if (nupy === "admin" && password === ADMIN_nupy) {
        return {
            id: 0,
            name: "Admin",
            nupy: ADMIN_nupy,
            subjects: ["Administrator"]
        };
    }
    
    // Cari guru dengan NUPY yang sesuai
    const teacher = teachers.find(t => t.nupy === nupy);
    
    // Jika guru ditemukan dan password sama dengan NUPY
    if (teacher && password === nupy) {
        return teacher;
    }
    
    return null;
}