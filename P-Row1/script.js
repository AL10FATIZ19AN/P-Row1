// Sample data untuk aplikasi
let peminjamanData = [
    {
        id: 1,
        nama: "Ahmad Rizki",
        barang: "Laptop Dell Inspiron",
        keadaan: "Baru, kondisi 95%, semua komponen lengkap",
        tanggalPinjam: "2024-01-15T09:00",
        tanggalKembali: "2024-01-20T17:00",
        telepon: "081234567890",
        email: "ahmad.rizki@email.com",
        sosmed: "Instagram: @ahmad_rizki",
        status: "dipinjam",
        tanggalPengajuan: "2024-01-14T10:30"
    },
    {
        id: 2,
        nama: "Sarah Putri",
        barang: "Proyektor Epson",
        keadaan: "Kondisi baik, remote control ada, kabel lengkap",
        tanggalPinjam: "2024-01-18T08:00",
        tanggalKembali: "2024-01-25T16:00",
        telepon: "087654321098",
        email: "sarah.putri@email.com",
        sosmed: "Facebook: Sarah Putri",
        status: "dipinjam",
        tanggalPengajuan: "2024-01-17T14:20"
    },
    {
        id: 3,
        nama: "Budi Santoso",
        barang: "Sound System JBL",
        keadaan: "Kondisi 90%, 2 speaker aktif, mixer ada",
        tanggalPinjam: "2024-01-10T10:00",
        tanggalKembali: "2024-01-12T18:00",
        telepon: "089876543210",
        email: "budi.santoso@email.com",
        sosmed: "",
        status: "dikembalikan",
        tanggalPengajuan: "2024-01-09T16:45"
    },
    {
        id: 4,
        nama: "Dewi Kartika",
        barang: "Kamera Canon EOS",
        keadaan: "Kondisi 85%, lensa 18-55mm, memory card 32GB",
        tanggalPinjam: "2024-01-05T09:00",
        tanggalKembali: "2024-01-08T17:00",
        telepon: "081112223334",
        email: "dewi.kartika@email.com",
        sosmed: "Instagram: @dewi_kartika",
        status: "telat",
        tanggalPengajuan: "2024-01-04T11:15"
    }
];

let adminData = [
    {
        id: 1,
        nama: "Admin Utama",
        jabatan: "Super Admin",
        telepon: "081234567890",
        email: "admin@p-row.com",
        avatar: "AU"
    },
    {
        id: 2,
        nama: "Siti Nurhaliza",
        jabatan: "Admin Peminjaman",
        telepon: "087654321098",
        email: "siti.nurhaliza@p-row.com",
        avatar: "SN"
    },
    {
        id: 3,
        nama: "Rizki Pratama",
        jabatan: "Admin Inventaris",
        telepon: "089876543210",
        email: "rizki.pratama@p-row.com",
        avatar: "RP"
    },
    {
        id: 4,
        nama: "Maya Indah",
        jabatan: "Admin Support",
        telepon: "081112223334",
        email: "maya.indah@p-row.com",
        avatar: "MI"
    }
];

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Set up navigation
    setupNavigation();
    
    // Set up form submission
    setupFormSubmission();
    
    // Load initial data
    loadStatusData();
    loadAdminData();
});

function initializeApp() {
    // Set current date and time for form inputs
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('tanggal-pinjam').value = formatDateTime(now);
    document.getElementById('tanggal-kembali').value = formatDateTime(tomorrow);
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            // Update page title
            const titles = {
                'pengajuan': 'Pengajuan Peminjaman',
                'status': 'Daftar Status Peminjaman',
                'admin': 'Daftar Anggota Admin'
            };
            pageTitle.textContent = titles[targetSection];
        });
    });
}

function setupFormSubmission() {
    const form = document.getElementById('peminjaman-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate dates
        const tanggalPinjam = new Date(data['tanggal-pinjam']);
        const tanggalKembali = new Date(data['tanggal-kembali']);
        
        if (tanggalKembali <= tanggalPinjam) {
            alert('Tanggal pengembalian harus setelah tanggal pinjam!');
            return;
        }
        
        // Create new peminjaman object
        const newPeminjaman = {
            id: peminjamanData.length + 1,
            nama: data.nama,
            barang: data.barang,
            keadaan: data.keadaan,
            tanggalPinjam: data['tanggal-pinjam'],
            tanggalKembali: data['tanggal-kembali'],
            telepon: data.telepon,
            email: data.email,
            sosmed: data.sosmed,
            status: 'dipinjam',
            tanggalPengajuan: new Date().toISOString()
        };
        
        // Add to data
        peminjamanData.unshift(newPeminjaman);
        
        // Show success message
        alert('Peminjaman berhasil disimpan! Status: Sedang Dipinjam');
        
        // Reset form
        form.reset();
        initializeApp();
        
        // Refresh status data if on status page
        if (document.getElementById('status').classList.contains('active')) {
            loadStatusData();
        }
    });
}

function loadStatusData() {
    const statusList = document.getElementById('status-list');
    const filter = document.getElementById('status-filter').value;
    
    // Filter data based on selected status
    let filteredData = peminjamanData;
    if (filter !== 'all') {
        filteredData = peminjamanData.filter(item => item.status === filter);
    }
    
    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.tanggalPengajuan) - new Date(a.tanggalPengajuan));
    
    // Generate HTML
    statusList.innerHTML = filteredData.map(item => createStatusCard(item)).join('');
}

function createStatusCard(item) {
    const statusLabels = {
        'dipinjam': 'Sedang Dipinjam',
        'dikembalikan': 'Telah Dikembalikan',
        'telat': 'Telat Pengembalian'
    };
    
    const statusClasses = {
        'dipinjam': 'status-dipinjam',
        'dikembalikan': 'status-dikembalikan',
        'telat': 'status-telat'
    };
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    let actionButtons = '';
    
    if (item.status === 'dipinjam') {
        actionButtons = `
            <button class="btn btn-primary btn-sm" onclick="updateStatus(${item.id}, 'dikembalikan')">
                <i class="fas fa-undo"></i> Kembalikan
            </button>
        `;
    } else if (item.status === 'dikembalikan') {
        actionButtons = `
            <button class="btn btn-secondary btn-sm" onclick="updateStatus(${item.id}, 'dipinjam')">
                <i class="fas fa-redo"></i> Pinjam Lagi
            </button>
        `;
    }
    
    return `
        <div class="status-card">
            <div class="status-header-card">
                <div class="status-info">
                    <h4>${item.nama}</h4>
                    <p><strong>Barang:</strong> ${item.barang}</p>
                    <p><strong>Tanggal Pinjam:</strong> ${formatDate(item.tanggalPinjam)}</p>
                    <p><strong>Batas Kembali:</strong> ${formatDate(item.tanggalKembali)}</p>
                    <p><strong>Kontak:</strong> ${item.telepon} | ${item.email}</p>
                    ${item.sosmed ? `<p><strong>Sosmed:</strong> ${item.sosmed}</p>` : ''}
                </div>
                <span class="status-badge ${statusClasses[item.status]}">${statusLabels[item.status]}</span>
            </div>
            <div class="status-info">
                <p><strong>Keadaan Awal:</strong> ${item.keadaan}</p>
            </div>
            ${actionButtons ? `<div class="status-actions">${actionButtons}</div>` : ''}
        </div>
    `;
}

function updateStatus(id, newStatus) {
    const item = peminjamanData.find(item => item.id === id);
    if (item) {
        item.status = newStatus;
        loadStatusData();
        alert(`Status berhasil diubah menjadi: ${newStatus}`);
    }
}

function loadAdminData() {
    const adminList = document.getElementById('admin-list');
    
    adminList.innerHTML = adminData.map(admin => `
        <div class="admin-card">
            <div class="admin-info">
                <div class="admin-avatar">${admin.avatar}</div>
                <div class="admin-details">
                    <h4>${admin.nama}</h4>
                    <p>${admin.jabatan}</p>
                </div>
            </div>
            <div class="admin-contact">
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${admin.telepon}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${admin.email}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function addAdmin() {
    alert('Fitur tambah admin akan diimplementasikan nanti!');
}

function refreshData() {
    loadStatusData();
    alert('Data berhasil diperbarui!');
}

// Utility functions
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Filter functionality
document.getElementById('status-filter').addEventListener('change', function() {
    loadStatusData();
}); 