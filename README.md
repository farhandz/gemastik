Dokumen Kebutuhan Sistem (System Requirements Specification - SRS)
1. Pendahuluan
1.1 Tujuan
Dokumen ini menjelaskan kebutuhan sistem untuk pengembangan aplikasi bahasa isyarat berbasis machine learning yang bertujuan untuk mengidentifikasi dan menerjemahkan bahasa isyarat ke dalam teks atau suara.
1.2 Ruang Lingkup
Aplikasi ini akan digunakan oleh individu yang mendengar dan yang tidak mendengar untuk memfasilitasi komunikasi. Aplikasi ini akan tersedia di platform mobile dan web.
1.3 Definisi, Akronim, dan Singkatan
SRS: System Requirements Specification
UI/UX: User Interface/User Experience
ML: Machine Learning

2. Deskripsi Umum
2.1 Perspektif Sistem
Aplikasi ini akan terdiri dari tiga komponen utama: frontend (antarmuka pengguna), backend (logika aplikasi dan server), dan model machine learning (untuk pengenalan bahasa isyarat).
2.2 Fungsi Sistem
Pengenalan bahasa isyarat melalui kamera.
Terjemahan bahasa isyarat ke teks.
Terjemahan teks ke suara.
Penyimpanan dan pengelolaan data pengguna.
Dukungan multi-bahasa.
2.3 Karakteristik Pengguna
Pengguna Utama: Individu yang mendengar dan yang tidak mendengar, termasuk mereka yang memiliki keterbatasan pendengaran.
2.4 Batasan
Keterbatasan akurasi pengenalan bahasa isyarat tergantung pada kualitas dataset.
Keterbatasan perangkat keras pengguna seperti kamera dan mikrofon.
3. Kebutuhan Fungsional
3.1 Pengenalan Bahasa Isyarat
Aplikasi harus dapat mengidentifikasi isyarat tangan dari video secara real-time.
Aplikasi  mampu mengenali setidaknya 32 isyarat umum.
3.2 Terjemahan Bahasa Isyarat ke Teks Menggunakan Kamera
Aplikasi harus menerjemahkan isyarat yang dikenali ke teks dengan akurasi minimal 70%.4. Kebutuhan Non-Fungsional
4.1 Kinerja
Aplikasi dapat memproses dan menerjemahkan isyarat dalam waktu kurang dari 5 detik.
4.2 Keamanan
Data pengguna harus dienkripsi saat disimpan dan saat dalam transmisi.
Aplikasi harus mematuhi standar keamanan data seperti GDPR.
4.3 Kegunaan
Antarmuka pengguna intuitif dan mudah digunakan.
Aplikasi harus menyediakan panduan pengguna dan bantuan online.
4.4 Skalabilitas
Aplikasi harus dirancang untuk dapat ditingkatkan dengan mudah seiring bertambahnya pengguna dan dataset.
4.5 Portabilitas
Aplikasi  kompatibel dengan platform mobile dan web.
Kode aplikasi  mudah dipindahkan dan diintegrasikan dengan sistem lain.
5. Spesifikasi Teknis
5.1 Arsitektur Sistem
Frontend: Dibangun menggunakan teknologi seperti  React.js untuk web.
Running Model: mengadopsi teknologi WebAssembly dan WebGL untuk menyediakan runtime inferensi model ONNX yang dioptimalkan untuk CPU dan GPU.
Backend: Menggunakan  Flask untuk server dan API.
5.2 Teknologi Machine Learning
Framework: Menggunakan PyTorch untuk pelatihan model.
Model: Convolutional Neural Networks (CNN) untuk pengenalan gambar/video..
5.3 Infrastruktur
Aplikasi harus di hosting di vercel
