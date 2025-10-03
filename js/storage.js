// Simpan presensi ke localStorage
function savePresencesToLocalStorage() {
    if (currentTeacher) {
        localStorage.setItem(`teacherPresences_${currentTeacher.id}`, JSON.stringify(teacherPresences));
    }
    localStorage.setItem('allPresences', JSON.stringify(allPresences));
}

// Load presensi dari localStorage
function loadPresencesFromLocalStorage() {
    if (currentTeacher) {
        const savedPresences = localStorage.getItem(`teacherPresences_${currentTeacher.id}`);
        if (savedPresences) {
            teacherPresences = JSON.parse(savedPresences);
        }
    }
    
    const savedAllPresences = localStorage.getItem('allPresences');
    if (savedAllPresences) {
        allPresences = JSON.parse(savedAllPresences);
    }
}