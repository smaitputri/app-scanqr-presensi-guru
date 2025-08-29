// Update statistik admin
function updateAdminStats() {
    const today = formatDate(new Date());
    
    // Hitung guru yang hadir hari ini
    const todayPresences = allPresences.filter(p => p.date === today);
    const presentTeachers = [...new Set(todayPresences.map(p => p.teacherId))];
    
    totalTeachersElement.textContent = teachers.length;
    presentTodayElement.textContent = presentTeachers.length;
    totalPresenceElement.textContent = allPresences.length;
}

// Update daftar presensi admin
function updateAdminPresenceList(presences) {
    adminPresenceList.innerHTML = '';
    
    presences.forEach(presence => {
        const presenceCard = document.createElement('div');
        presenceCard.className = 'admin-presence-card';
        
        presenceCard.innerHTML = `
            <div class="admin-presence-header">
                <div class="admin-presence-name">${presence.teacherName}</div>
                <div class="admin-presence-class">${presence.classroom}</div>
            </div>
            <div class="admin-presence-details">
                <div>${presence.date}</div>
                <div>${presence.time}</div>
            </div>
        `;
        
        adminPresenceList.appendChild(presenceCard);
    });
}

// Setup event listeners untuk semua tombol admin
document.addEventListener('DOMContentLoaded', function() {
    // Existing buttons
    const viewAllBtn = document.getElementById('view-all-btn');
    const viewTodayBtn = document.getElementById('view-today-btn');
    const exportExcelBtn = document.getElementById('export-excel-btn');
    
    // New sheets data button
    const viewSheetsBtn = document.getElementById('view-sheets-btn');
    
    if (viewAllBtn) viewAllBtn.addEventListener('click', () => {
        updateAdminPresenceList(allPresences);
    });
    
    if (viewTodayBtn) viewTodayBtn.addEventListener('click', () => {
        const today = formatDate(new Date());
        const todayPresences = allPresences.filter(p => p.date === today);
        updateAdminPresenceList(todayPresences);
    });
    
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', exportToExcel);
    
    // Add listener for new sheets data button
    if (viewSheetsBtn) viewSheetsBtn.addEventListener('click', fetchAndRenderSheetsData);
});

// Fungsi untuk generate QR Code
function generateQRCode(classroom) {
    // Clear previous QR Code
    qrPreview.style.display = 'block';
    qrClassName.textContent = classroom;
    
    // Create QR Code
    const qr = new QRCode(qrCanvas, {
        text: classroom,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Fungsi untuk download QR Code
function downloadQRCode() {
    const link = document.createElement('a');
    link.download = `${qrClassName.textContent}-presensi-qr.png`;
    link.href = qrCanvas.toDataURL('image/png');
    link.click();
}

// Fungsi untuk fetch data dari Google Sheets telah dipindahkan ke app.js

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

// Fungsi untuk export data presensi ke Excel
function exportToExcel() {
    exportStatus.className = 'export-status';
    exportStatus.style.display = 'none';
    
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (!startDate || !endDate) {
        exportStatus.textContent = "Pilih rentang tanggal terlebih dahulu!";
        exportStatus.className = 'export-status error';
        exportStatus.style.display = 'block';
        return;
    }
    
    // Filter data berdasarkan rentang tanggal
    const filteredPresences = allPresences.filter(presence => {
        const presenceDate = new Date(presence.date.split('/').reverse().join('-'));
        const start = new Date(startDate);
        const end = new Date(endDate);
        return presenceDate >= start && presenceDate <= end;
    });
    
    if (filteredPresences.length === 0) {
        exportStatus.textContent = "Tidak ada data presensi pada rentang tanggal tersebut!";
        exportStatus.className = 'export-status error';
        exportStatus.style.display = 'block';
        return;
    }
    
    // Siapkan data untuk Excel
    const excelData = [
        ["Nama Guru", "Kelas", "Tanggal", "Waktu", "Mata Pelajaran"]
    ];
    
    filteredPresences.forEach(presence => {
        const teacher = teachers.find(t => t.id === presence.teacherId);
        const subjects = teacher ? teacher.subjects.join(", ") : "Tidak diketahui";
        
        excelData.push([
            presence.teacherName,
            presence.classroom,
            presence.date,
            presence.time,
            subjects
        ]);
    });
    
    // Buat worksheet
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presensi Guru");
    
    // Export ke Excel
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    XLSX.writeFile(wb, `presensi_guru_${formattedDate}.xlsx`);
    
    exportStatus.textContent = `Data berhasil diexport! ${filteredPresences.length} presensi ditemukan.`;
    exportStatus.className = 'export-status success';
    exportStatus.style.display = 'block';
}