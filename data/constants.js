// Data guru (40 guru dengan 1-3 mata pelajaran)
const teachers = [
    { id: 1, name: "Zahid Zuhendra, Lc.", nik: "19771220041011", subjects: ["Manhaj"] },
    { id: 2, name: "Saparuddin, Lc., M.HI.", nik: "19841220101063", subjects: ["Adab Akhlak"] },
    { id: 3, name: "Ahamd Firdaus, Lc.", nik: "19820220101051", subjects: ["Faroidh-Kelas-XII"] },
    { id: 4, name: "Rasyid Ridlo, Lc., M.HI.", nik: "19820620131123", subjects: ["Ta'bir"] },
    { id: 5, name: "Davidli Ihsan, M.H.I.", nik: "19860320101062", subjects: ["Aqidah"] },
    { id: 6, name: "Muhammad Nadhir Atsigah, Lc.", nik: "19940920221069", subjects: ["Ilmu Hadits","Aqidah"] },
    { id: 7, name: "Fadillah Al Hinduan", nik: "19910920122088", subjects: ["Haf-Hadits", "Ta'bir"] },
    { id: 8, name: "Fadilah Muzhar, S.Pd.", nik: "19930820142287", subjects: ["Bahasa Arab"] },
    { id: 9, name: "Sri Rosita, Lc.", nik: "19960320222086", subjects: ["Bahasa Arab", "Haf-Hadits"] },
    { id: 10, name: "Ummu Salmiyah Yusuf, Lc.", nik: "19950120192467", subjects: ["Fiqh","Ushul Fiqh","Faroidh-Kelas-XII","Faroidh-Kelas-XI"] },
    { id: 11, name: "Siti Miftahul Jannah, Lc., M.Pd.", nik: "19970120192486", subjects: ["Fiqh", "Balaghoh"] },
    { id: 12, name: "Desiana Rahim Riani, Lc.", nik: "19960220222060", subjects: ["Bahasa Arab","Nahwu"] },
    { id: 13, name: "Rima Suci, Lc.", nik: "19930220242014", subjects: ["Shorof","Bahasa dan Sastra Arab","Fiqh","Adab Akhlak"] },
    { id: 14, name: "Khaula Hanifa, S.Pd.", nik: "20020120242015", subjects: ["Aqidah","Adab Akhlak"] },
    { id: 15, name: "Risnatul Aini, Lc.", nik: "20001020252014", subjects: ["Ta'bir","Bahasa Arab"] },
    { id: 16, name: "Annisa Rabbani, Lc.", nik: "20020820252012", subjects: ["Nahwu","Bahasa Arab","Shorof"] },
    { id: 17, name: "Nazhiroh", nik: "19900720092042", subjects: ["Tahfizhul Qur'an"] },
    { id: 18, name: "Parmiatun", nik: "19901220112072", subjects: ["Tahfizhul Qur'an"] },
    { id: 19, name: "Misnah", nik: "19791220072025", subjects: ["Tahfizhul Qur'an"] },
    { id: 20, name: "Mu'annah", nik: "19731220122095", subjects: ["Tahfizhul Qur'an"] },
    { id: 21, name: "Nur Khoiri", nik: "19750720182340", subjects: ["Tahfizhul Qur'an"] },
    { id: 22, name: "Sukmawati", nik: "19740820182345", subjects: ["Tahfizhul Qur'an"] },
    { id: 23, name: "Nadia Yuli Zurrahmati", nik: "20020720222077", subjects: ["Tahfizhul Qur'an"] },
    { id: 24, name: "Joharatul Fitri", nik: "19790820152182", subjects: ["Tahfizhul Qur'an"] },
    { id: 25, name: "Reni Anggraini, S.Pd.", nik: "19890220132124", subjects: ["Tahfizhul Qur'an"] },
    { id: 26, name: "Sriatun", nik: "19770720162251", subjects: ["Tahfizhul Qur'an"] },
    { id: 27, name: "Mahnun, S.Pd.I.", nik: "19880520142149", subjects: ["Tahfizhul Qur'an"] },
    { id: 28, name: "Vera Hidayati, SH.", nik: "19670220082290", subjects: ["Antropologi","IPS", "PKN/Praakarya","PKN/Sejarah"] },
    { id: 29, name: "Fitria Ayu Ningsih, S.Pd.", nik: "19990220222061", subjects: ["Bahasa Indonesia","Bahasa dan Sastra Indonesia","PJOK"] },
    { id: 30, name: "Wardatul Aini, M.Pd.", nik: "19860720152158", subjects: ["Bahasa Indonesia","Bahasa dan Sastra Indonesia","PJOK"] },
    { id: 31, name: "Mastuni, S.Pd.", nik: "19881220102065", subjects: ["Bahasa Inggris","Bahasa dan Sastra Inggris","PJOK/Prakarya"] },
    { id: 32, name: "Bq. Gina Yuliandari Putri, S.Pd.", nik: "19980820222059", subjects: ["Bahasa Inggris","Bahasa dan Sastra Inggris","Informatika","PJOK"] },
    { id: 33, name: "Sri Handayani, S.Pd.", nik: "19880220132125", subjects: ["Matematika PJOK"] },
    { id: 34, name: "Zulfa Rahmi Ekarini, S.Pd.", nik: "19950220182338", subjects: ["Matematika","Matematika Peminatan","PJOK"] },
    { id: 35, name: "Risa Herlina Hariati, S.Pd.", nik: "19930220162304", subjects: ["Biologi","IPA-Biologi"] },
    { id: 36, name: "Novita Supiyani, S.Pd.", nik: "19891120122109", subjects: ["Kimia","IPA-Kimia","PJOK"] },
    { id: 37, name: "Siti Nurlaelan Barorah, S.Pd.", nik: "19910720152155", subjects: ["Fisika","IPA-Fisika","PJOK"] },
    { id: 38, name: "Rahim Imaduddin, S.T.", nik: "19800620091046", subjects: ["Wakasek dan Bendahara"] },
    { id: 39, name: "Irma Suryaningsih, S.Pd.", nik: "19890120142181", subjects: ["Staff Administrasi"] },
    { id: 40, name: "Muhammad Wardiyan Dzulfikar R., S.Kom.", nik: "19930620231065", subjects: ["Staff Administrasi"] },
    { id: 41, name: "Ahmad Rosidi, S.E.", nik: "19890620101053", subjects: ["KTU"] },
    { id: 42, name: "Gunawan Trianto, M.Pd.", nik: "19811220031007", subjects: ["Kepala Sekolah"] },
    { id: 43, name: "Sativa Nasywa Az-Zahra, S.I.Pust.", nik: "20000720242046", subjects: ["Staff Perpustakaan"] },
    { id: 44, name: "Haeratunnisa, S.Pd.", nik: "20010520252018", subjects: ["Fiqh"] }
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