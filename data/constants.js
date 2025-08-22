// Data guru (40 guru dengan 1-3 mata pelajaran)
const teachers = [
    { id: 1, name: "Zahid Zuhendra, Lc.", nik: "1011", subjects: ["Manhaj"] },
    { id: 2, name: "Saparuddin, Lc., M.HI.", nik: "1063", subjects: ["Adab Akhlak"] },
    { id: 3, name: "Ahamd Firdaus, Lc.", nik: "1051", subjects: ["Faroidh-Kelas-XII"] },
    { id: 4, name: "Rasyid Ridlo, Lc., M.HI.", nik: "1123", subjects: ["Ta'bir"] },
    { id: 5, name: "Davidli Ihsan, M.H.I.", nik: "1062", subjects: ["Aqidah"] },
    { id: 6, name: "Muhammad Nadhir Atsigah, Lc.", nik: "1069", subjects: ["Ilmu Hadits","Aqidah"] },
    { id: 7, name: "Fadillah Al Hinduan", nik: "2088", subjects: ["Haf-Hadits", "Ta'bir"] },
    { id: 8, name: "Fadilah Muzhar, S.Pd.", nik: "2287", subjects: ["Bahasa Arab"] },
    { id: 9, name: "Sri Rosita, Lc.", nik: "2086", subjects: ["Bahasa Arab", "Haf-Hadits"] },
    { id: 10, name: "Ummu Salmiyah Yusuf, Lc.", nik: "2467", subjects: ["Fiqh","Ushul Fiqh","Faroidh-Kelas-XII","Faroidh-Kelas-XI"] },
    { id: 11, name: "Siti Miftahul Jannah, Lc., M.Pd.", nik: "2486", subjects: ["Fiqh", "Balaghoh"] },
    { id: 12, name: "Desiana Rahim Riani, Lc.", nik: "2060", subjects: ["Bahasa Arab","Nahwu"] },
    { id: 13, name: "Rima Suci, Lc.", nik: "2014", subjects: ["Shorof","Bahasa dan Sastra Arab","Fiqh","Adab Akhlak"] },
    { id: 14, name: "Khaula Hanifa, S.Pd.", nik: "2015", subjects: ["Aqidah","Adab Akhlak"] },
    { id: 15, name: "Risnatul Aini, Lc.", nik: "2014", subjects: ["Ta'bir","Bahasa Arab"] },
    { id: 16, name: "Annisa Rabbani, Lc.", nik: "2012", subjects: ["Nahwu","Bahasa Arab","Shorof"] },
    { id: 17, name: "Nazhiroh", nik: "2042", subjects: ["Tahfizhul Qur'an"] },
    { id: 18, name: "Parmiatun", nik: "2072", subjects: ["Tahfizhul Qur'an"] },
    { id: 19, name: "Misnah", nik: "2025", subjects: ["Tahfizhul Qur'an"] },
    { id: 20, name: "Mu'annah", nik: "2095", subjects: ["Tahfizhul Qur'an"] },
    { id: 21, name: "Nur Khoiri", nik: "2340", subjects: ["Tahfizhul Qur'an"] },
    { id: 22, name: "Sukmawati", nik: "2345", subjects: ["Tahfizhul Qur'an"] },
    { id: 23, name: "Nadia Yuli Zurrahmati", nik: "2077", subjects: ["Tahfizhul Qur'an"] },
    { id: 24, name: "Joharatul Fitri", nik: "2182", subjects: ["Tahfizhul Qur'an"] },
    { id: 25, name: "Reni Anggraini, S.Pd.", nik: "2124", subjects: ["Tahfizhul Qur'an"] },
    { id: 26, name: "Sriatun", nik: "2251", subjects: ["Tahfizhul Qur'an"] },
    { id: 27, name: "Mahnun, S.Pd.I.", nik: "2149", subjects: ["Tahfizhul Qur'an"] },
    { id: 28, name: "Vera Hidayati, SH.", nik: "2290", subjects: ["Antropologi","IPS", "PKN/Praakarya","PKN/Sejarah"] },
    { id: 29, name: "Fitria Ayu Ningsih, S.Pd.", nik: "2061", subjects: ["Bahasa Indonesia","Bahasa dan Sastra Indonesia","PJOK"] },
    { id: 30, name: "Wardatul Aini, M.Pd.", nik: "2158", subjects: ["Bahasa Indonesia","Bahasa dan Sastra Indonesia","PJOK"] },
    { id: 31, name: "Mastuni, S.Pd.", nik: "2065", subjects: ["Bahasa Inggris","Bahasa dan Sastra Inggris","PJOK/Prakarya"] },
    { id: 32, name: "Bq. Gina Yuliandari Putri, S.Pd.", nik: "2059", subjects: ["Bahasa Inggris","Bahasa dan Sastra Inggris","Informatika","PJOK"] },
    { id: 33, name: "Sri Handayani, S.Pd.", nik: "2125", subjects: ["Matematika PJOK"] },
    { id: 34, name: "Zulfa Rahmi Ekarini, S.Pd.", nik: "2338", subjects: ["Matematika","Matematika Peminatan","PJOK"] },
    { id: 35, name: "Risa Herlina Hariati, S.Pd.", nik: "2304", subjects: ["Biologi","IPA-Biologi"] },
    { id: 36, name: "Novita Supiyani, S.Pd.", nik: "2109", subjects: ["Kimia","IPA-Kimia","PJOK"] },
    { id: 37, name: "Siti Nurlaelan Barorah, S.Pd.", nik: "2155", subjects: ["Fisika","IPA-Fisika","PJOK"] },
    { id: 38, name: "Rahim Imaduddin, S.T.", nik: "1046", subjects: ["Wakasek dan Bendahara"] },
    { id: 39, name: "Irma Suryaningsih, S.Pd.", nik: "2181", subjects: ["Staff Administrasi"] },
    { id: 40, name: "Muhammad Wardiyan Dzulfikar R., S.Kom.", nik: "1065", subjects: ["Staff Administrasi"] },
    { id: 41, name: "Ahmad Rosidi, S.E.", nik: "1053", subjects: ["KTU"] },
    { id: 42, name: "Gunawan Trianto, M.Pd.", nik: "1007", subjects: ["Kepala Sekolah"] },
    { id: 43, name: "Sativa Nasywa Az-Zahra, S.I.Pust.", nik: "2046", subjects: ["Staff Perpustakaan"] },
    { id: 44, name: "Haeratunnisa, S.Pd.", nik: "2018", subjects: ["Fiqh"] }
];

// Data kelas
const classrooms = [
    "KELAS-XA", "KELAS-XB", "KELAS-XC", "KELAS-XD",
    "KELAS-XI-IBB-1", "KELAS-XI-IBB-2", "KELAS-XI-MIA-1", "KELAS-XI-MIA-2",
    "KELAS-XII-IBB-1", "KELAS-XII-IBB-2", "KELAS-XII-MIA-1", "KELAS-XII-MIA-2"
];

// Konstanta lainnya
const ADMIN_NIK = "admin123";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzf2mkCb09vj0LPBWjEo_jmKy-naHDt5YRxGB0WABzUnD-DExE_EPnf25QTaydNT6oP2Q/exec";