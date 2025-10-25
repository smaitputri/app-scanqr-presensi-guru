// Data guru (40 guru dengan 1-3 mata pelajaran)
const teachers = [
    { id: 1, name: "Zahid Zuhendra, Lc.", nupy: "1011", subjects: ["Manhaj","Jam Kedatangan"] },
    { id: 2, name: "Saparuddin, Lc., M.HI.", nupy: "1063", subjects: ["Adab Akhlak","Jam Kedatangan"] },
    { id: 3, name: "Ahamd Firdaus, Lc.", nupy: "1051", subjects: ["Faroidh","Jam Kedatangan"] },
    { id: 4, name: "Rasyid Ridlo, Lc., M.HI.", nupy: "1123", subjects: ["Ta'bir","Jam Kedatangan"] },
    { id: 5, name: "Davidli Ihsan, M.H.I.", nupy: "1062", subjects: ["Aqidah","Jam Kedatangan"] },
    { id: 6, name: "Muhammad Nadhir Atsigah, Lc.", nupy: "1069", subjects: ["Ilmu Hadits","Aqidah","Jam Kedatangan"] },
    { id: 7, name: "Fadillah Al Hinduan", nupy: "2088", subjects: ["Haf-Hadits", "Ta'bir","Jam Kedatangan"] },
    { id: 8, name: "Fadilah Muzhar, S.Pd.", nupy: "2287", subjects: ["Bahasa Arab","Jam Kedatangan"] },
    { id: 9, name: "Sri Rosita, Lc.", nupy: "2086", subjects: ["Bahasa Arab", "Haf-Hadits","Jam Kedatangan"] },
    { id: 10, name: "Ummu Salmiyah Yusuf, Lc.", nupy: "2467", subjects: ["Fiqh","Ushul Fiqh","Faroidh","Balaghoh","Jam Kedatangan"] },
    { id: 11, name: "Siti Miftahul Jannah, Lc., M.Pd.", nupy: "2486", subjects: ["Fiqh", "Balaghoh","Manhaj","Jam Kedatangan"] },
    { id: 12, name: "Desiana Rahim Riani, Lc.", nupy: "2060", subjects: ["Bahasa Arab","Nahwu","Jam Kedatangan"] },
    { id: 13, name: "Rima Suci, Lc.", nupy: "2014", subjects: ["Shorof","Bahasa dan Sastra Arab","Fiqh","Adab Akhlak","Jam Kedatangan"] },
    { id: 14, name: "Khaula Hanifa, S.Pd.", nupy: "2015", subjects: ["Aqidah","Adab Akhlak","Jam Kedatangan"] },
    { id: 15, name: "Risnatul Aini, Lc.", nupy: "2000", subjects: ["Ta'bir","Bahasa Arab","Jam Kedatangan"] },
    { id: 16, name: "Annisa Rabbani, Lc.", nupy: "2012", subjects: ["Nahwu","Bahasa Arab","Shorof","Jam Kedatangan"] },
    { id: 17, name: "Nazhiroh", nupy: "2042", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 18, name: "Parmiatun", nupy: "2072", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 19, name: "Misnah", nupy: "2025", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 20, name: "Mu'annah", nupy: "2095", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 21, name: "Nur Khoiri", nupy: "2340", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 22, name: "Sukmawati", nupy: "2345", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 23, name: "Nadia Yuli Zurrahmati", nupy: "2077", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 24, name: "Joharatul Fitri", nupy: "2182", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 25, name: "Reni Anggraini, S.Pd.", nupy: "2124", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 26, name: "Sriatun", nupy: "2251", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 27, name: "Mahnun, S.Pd.I.", nupy: "2149", subjects: ["Tahfizhul Qur'an","Jam Kedatangan"] },
    { id: 28, name: "Vera Hidayati, SH.", nupy: "2290", subjects: ["Antropologi","IPS", "PKN/Praakarya","PKN/Sejarah","PJOK","Jam Kedatangan"] },
    { id: 29, name: "Fitria Ayu Ningsih, S.Pd.", nupy: "2061", subjects: ["Bahasa Indonesia","Bahasa dan Sastra Indonesia","PJOK","Jam Kedatangan"] },
    { id: 30, name: "Wardatul Aini, M.Pd.", nupy: "2158", subjects: ["Bahasa Indonesia","Bahasa dan Sastra Indonesia","PJOK","Jam Kedatangan"] },
    { id: 31, name: "Mastuni, S.Pd.", nupy: "2065", subjects: ["Bahasa Inggris","Bahasa dan Sastra Inggris","PJOK/Prakarya","Jam Kedatangan"] },
    { id: 32, name: "Bq. Gina Yuliandari Putri, S.Pd.", nupy: "2059", subjects: ["Bahasa Inggris","Bahasa dan Sastra Inggris","Informatika","PJOK/Prakarya","Jam Kedatangan"] },
    { id: 33, name: "Sri Handayani, S.Pd.", nupy: "2125", subjects: ["Matematika", "PJOK","Jam Kedatangan"] },
    { id: 34, name: "Zulfa Rahmi Ekarini, S.Pd.", nupy: "2338", subjects: ["Matematika","Matematika Peminatan","PJOK","Jam Kedatangan"] },
    { id: 35, name: "Risa Herlina Hariati, S.Pd.", nupy: "2304", subjects: ["Biologi","IPA-Biologi","Jam Kedatangan"] },
    { id: 36, name: "Novita Supiyani, S.Pd.", nupy: "2109", subjects: ["Kimia","IPA-Kimia","PJOK","Jam Kedatangan"] },
    { id: 37, name: "Siti Nurlaelan Barorah, S.Pd.", nupy: "2155", subjects: ["Fisika","IPA-Fisika","PJOK","Jam Kedatangan"] },
    { id: 38, name: "Rahim Imaduddin, S.T.", nupy: "1046", subjects: ["Wakasek dan Bendahara","Jam Kedatangan"] },
    { id: 39, name: "Irma Suryaningsih, S.Pd.", nupy: "2181", subjects: ["Staff Administrasi","Jam Kedatangan"] },
    { id: 40, name: "Muhammad Wardiyan Dzulfikar R., S.Kom.", nupy: "1065", subjects: ["Staff Administrasi","Jam Kedatangan"] },
    { id: 41, name: "Ahmad Rosidi, S.E.", nupy: "1053", subjects: ["KTU","Jam Kedatangan"] },
    { id: 42, name: "Gunawan Trianto, M.Pd.", nupy: "1007", subjects: ["Kepala Sekolah","Jam Kedatangan"] },
    { id: 43, name: "Sativa Nasywa Az-Zahra, S.I.Pust.", nupy: "2046", subjects: ["Staff Perpustakaan","Jam Kedatangan"] },
    { id: 44, name: "Haeratunnisa, S.Pd.", nupy: "2018", subjects: ["Fiqh","Jam Kedatangan"] },
    { id: 45, name: "Linda Malasari, S.Kom.", nupy: "2023", subjects: ["Staff Administrasi","Jam Kedatangan"] },
    
];

// Data kelas
const classrooms = [
    "KELAS-XA", "KELAS-XB", "KELAS-XC", "KELAS-XD",
    "KELAS-XI-IBB-1", "KELAS-XI-IBB-2", "KELAS-XI-MIA-1", "KELAS-XI-MIA-2",
    "KELAS-XII-IBB-1", "KELAS-XII-IBB-2", "KELAS-XII-MIA-1", "KELAS-XII-MIA-2","-"
];

// Konstanta lainnya
const ADMIN_nupy = "admin123";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-rF5w1WHbKX3LTqemI9GpbiU4UJyaPcFTIinmFMCWSBDt9JKQ19RQiFV9tWqtDDyrVw/exec";