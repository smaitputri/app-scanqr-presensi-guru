// Simpan presensi ke localStorage
// function savePresencesToLocalStorage() {
//     if (currentTeacher) {
//         localStorage.setItem(`teacherPresences_${currentTeacher.id}`, JSON.stringify(teacherPresences));
//     }
//     localStorage.setItem('allPresences', JSON.stringify(allPresences));
// }

// Load presensi dari localStorage
// function loadPresencesFromLocalStorage() {
//     if (currentTeacher) {
//         const savedPresences = localStorage.getItem(`teacherPresences_${currentTeacher.id}`);
//         if (savedPresences) {
//             teacherPresences = JSON.parse(savedPresences);
//         }
//     }
    
//     const savedAllPresences = localStorage.getItem('allPresences');
//     if (savedAllPresences) {
//         allPresences = JSON.parse(savedAllPresences);
//     }
// }

function savePresencesToLocalStorage() {
    const today = new Date().toDateString();
    
    // Filter hanya data hari ini dan batasi 10
    if (currentTeacher) {
        const todayPresences = teacherPresences
            .filter(presence => new Date(presence.timestamp).toDateString() === today)
            .slice(-10);
        
        localStorage.setItem(`teacherPresences_${currentTeacher.id}`, JSON.stringify(todayPresences));
    }
    
    const todayAllPresences = allPresences
        .filter(presence => new Date(presence.timestamp).toDateString() === today)
        .slice(-10);
    
    localStorage.setItem('allPresences', JSON.stringify(todayAllPresences));
}