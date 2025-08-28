// Format tanggal dan waktu
function formatDateTime(date) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${dayName}, ${day} ${month} ${year} - ${hours}:${minutes}:${seconds}`;
}

// Format tanggal untuk presensi
function formatDate(date) {
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format waktu untuk presensi
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Update waktu secara real-time
function updateDateTime() {
    const now = new Date();
    currentDateTimeElement.textContent = formatDateTime(now);
}

// Tampilkan notifikasi
function showNotification(message, isError = false) {
    const titleElement = notification.querySelector('.title');
    const messageElement = notification.querySelector('.message');
    const iconElement = notification.querySelector('i');
    
    if (isError) {
        notification.classList.add('error');
        titleElement.textContent = "Error!";
        iconElement.className = "fas fa-exclamation-triangle";
    } else {
        notification.classList.remove('error');
        titleElement.textContent = "Presensi Terekam!";
        iconElement.className = "fas fa-bell";
    }
    
    messageElement.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Setelah notifikasi selesai, reset scanner untuk scan berikutnya
        if (!isError) {
            setTimeout(() => {
                scannerMessage.textContent = "Kamera siap untuk scan berikutnya. Klik 'Mulai Scan' untuk memulai.";
            }, 1000);
        }
    }, 5000);
}