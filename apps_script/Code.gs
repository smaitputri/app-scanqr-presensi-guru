// Apps Script untuk menerima presensi dari aplikasi web
// Pastikan mengganti SPREADSHEET_ID jika diperlukan
const SPREADSHEET_ID = "1sMJGugsR5tgud3GVUja34ZXB_GTG0wegik4sXJhFHHM";

function doPost(e) {
  try {
    // Terima data: dukung FormData (e.parameter) atau JSON (e.postData.contents)
    var data = {};
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      data = JSON.parse(e.postData.contents || '{}');
    } else {
      data = e.parameter || {};
    }

    // Validasi minimal
    if (!data.teacher || !data.classroom || !data.date || !data.time || !data.subjects) {
      throw new Error("Data tidak lengkap: diperlukan teacher, classroom, date, time, subjects");
    }

    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName("Presensi");
    if (!sheet) {
      sheet = spreadsheet.insertSheet("Presensi");
    }

    // Setup header jika sheet baru atau tidak memiliki header
    var headers = [];
    if (sheet.getLastRow() === 0) {
      sheet.clear();
      sheet.appendRow(["Timestamp", "Nama Guru", "Kelas", "Hari", "Tanggal", "Waktu", "Mata Pelajaran", "Jam ke"]);
      headers = ["Timestamp", "Nama Guru", "Kelas", "Hari", "Tanggal", "Waktu", "Mata Pelajaran", "Jam ke"];
    } else {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      // Pastikan kolom 'Jam ke' ada
      ensureJamKeColumn(sheet);
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }

    // Format time menjadi HH:mm (ambil jam dan menit)
    var formattedTime = '';
    try {
      // Normalisasi pemisah waktu: ganti '.' atau spasi dengan ':'
      var rawTime = (data.time || '').toString().trim().replace(/\./g, ':').replace(/\s+/g, '');
      var tParts = rawTime.split(':');
      if (tParts.length >= 2) {
        formattedTime = pad(tParts[0],2) + ':' + pad(tParts[1],2);
      } else {
        formattedTime = rawTime;
      }
    } catch (e) {
      formattedTime = (data.time || '').toString();
    }

    // Hitung nama hari dari tanggal (tanggal dikirim dalam dd/mm/yyyy)
    var dayName = '';
    try {
      var dParts = (data.date || '').toString().split('/');
      if (dParts.length === 3) {
        var day = parseInt(dParts[0], 10);
        var month = parseInt(dParts[1], 10) - 1; // 0-based
        var year = parseInt(dParts[2], 10);
        var dateObj = new Date(year, month, day);
        var days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        dayName = days[dateObj.getDay()];
      }
    } catch (err) {
      dayName = '';
    }

    // Tentukan jam ke: prioritas pada data.jam_ke jika diberikan, lalu data.jamPelajaran (angka), lalu hitung dari waktu
    var jamLabel = '';
    if (data.jam_ke) {
      jamLabel = data.jam_ke.toString();
    } else if (data.jamPelajaran && Number(data.jamPelajaran) > 0) {
      jamLabel = 'Jam ke-' + Number(data.jamPelajaran);
    } else {
      var jamNum = getJamPelajaranFromTime(formattedTime);
      jamLabel = jamNum > 0 ? ('Jam ke-' + jamNum) : '';
    }

    // Append row
    var timestamp = new Date();
    sheet.appendRow([
      timestamp,
      data.teacher,
      data.classroom,
      dayName,
      data.date,
      formattedTime,
      data.subjects,
      jamLabel
    ]);

    // Format dan styling untuk row baru
    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow, 1, 1, 8);
    sheet.getRange(lastRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    // Pastikan kolom Waktu (kolom ke-6) diformat sebagai jam:menit
    try {
      sheet.getRange(lastRow, 6).setNumberFormat("HH:mm");
    } catch (e) {
      // jika gagal, abaikan
    }
    range.setHorizontalAlignment("center");
    range.setVerticalAlignment("middle");
    range.setBorder(true, true, true, true, true, true);
    sheet.autoResizeColumns(1, 8);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data berhasil disimpan", timestamp: timestamp.toISOString(), jam_ke: jamLabel }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString(), details: "Pastikan data yang dikirim lengkap dan format benar" }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput("Hanya menerima permintaan POST");
}

// Fungsi untuk menentukan jam ke berdasarkan waktu (mengembalikan angka 0..8)
function getJamPelajaranFromTime(timeString) {
  try {
    if (!timeString) return 0;
    var t = timeString.toString();
    var parts = t.split(':');
    if (parts.length < 2) return 0;
    var jam = parseInt(parts[0], 10);
    var menit = parseInt(parts[1], 10);
    if (isNaN(jam) || isNaN(menit)) return 0;
    var totalMenit = jam * 60 + menit;
    if (totalMenit >= 450 && totalMenit < 490) return 1; // 07:30 - 08:10
    if (totalMenit >= 490 && totalMenit < 530) return 2; // 08:10 - 08:50
    if (totalMenit >= 530 && totalMenit < 570) return 3; // 08:50 - 09:30
    if (totalMenit >= 570 && totalMenit < 610) return 4; // 09:30 - 10:10
    if (totalMenit >= 640 && totalMenit < 675) return 5; // 10:40 - 11:15
    if (totalMenit >= 675 && totalMenit < 710) return 6; // 11:15 - 11:50
    if (totalMenit >= 710 && totalMenit < 745) return 7; // 11:50 - 12:25
    if (totalMenit >= 745 && totalMenit < 780) return 8; // 12:25 - 13:00
    return 0;
  } catch (e) {
    return 0;
  }
}

// Tambahkan kolom 'Jam ke' jika belum ada; letakkan setelah 'Mata Pelajaran' jika memungkinkan
function ensureJamKeColumn(sheet) {
  try {
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var jamIdx = headers.indexOf('Jam ke');
    if (jamIdx !== -1) return;
    var mataIdx = headers.indexOf('Mata Pelajaran');
    if (mataIdx !== -1) {
      sheet.insertColumnAfter(mataIdx + 1);
      sheet.getRange(1, mataIdx + 2).setValue('Jam ke');
    } else {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue('Jam ke');
    }
  } catch (e) {
    Logger.log('ensureJamKeColumn error: ' + e.toString());
  }
}

// Baca data presensi
function getAttendanceData() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName('Presensi');
    if (!sheet || sheet.getLastRow() === 0) return { status: 'success', data: [] };
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    var result = rows.map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });
    return { status: 'success', data: result };
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

// Hapus baris presensi (index 1-based di sheet)
function deleteAttendance(rowIndex) {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName('Presensi');
    if (sheet && rowIndex > 0 && rowIndex <= sheet.getLastRow()) {
      sheet.deleteRow(rowIndex);
      return { status: 'success', message: 'Data berhasil dihapus' };
    } else {
      return { status: 'error', message: 'Baris tidak valid' };
    }
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

// Update existing rows with Jam ke (menggunakan nilai di kolom Waktu)
function updateExistingDataWithJamPelajaran() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName('Presensi');
    if (!sheet || sheet.getLastRow() <= 1) { Logger.log('Tidak ada data yang perlu diupdate'); return; }
    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    var timeIdx = headers.indexOf('Waktu');
    var jamIdx = headers.indexOf('Jam ke');
    if (timeIdx === -1) { Logger.log("Kolom 'Waktu' tidak ditemukan"); return; }
    if (jamIdx === -1) { ensureJamKeColumn(sheet); headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0]; jamIdx = headers.indexOf('Jam ke'); }
    var lastRow = sheet.getLastRow();
    var timeRange = sheet.getRange(2, timeIdx+1, lastRow-1, 1).getValues();
    for (var i=0;i<timeRange.length;i++) {
      var v = timeRange[i][0];
      var timeString = '';
      if (v instanceof Date) {
        timeString = Utilities.formatDate(v, Session.getScriptTimeZone(), 'HH:mm');
      } else {
        timeString = v ? v.toString() : '';
      }
      var jamNum = getJamPelajaranFromTime(timeString);
      var jamLabel = jamNum>0 ? ('Jam ke-' + jamNum) : '';
      sheet.getRange(i+2, jamIdx+1).setValue(jamLabel);
    }
    Logger.log('Data existing berhasil diupdate dengan nilai Jam ke');
  } catch (e) {
    Logger.log('updateExistingDataWithJamPelajaran error: ' + e.toString());
  }
}

// Helper: pad number to length
function pad(v,len){
  var s = v.toString();
  while(s.length < len) s = '0'+s;
  return s;
}
