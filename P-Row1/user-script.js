// Sample data untuk user
let userData = {
    nama: "Ahmad Rizki",
    telepon: "081234567890",
    email: "ahmad.rizki@email.com",
    sosmed: "Instagram: @ahmad_rizki"
};

let userPeminjamanData = [
    {
        id: 1,
        adminTujuan: "Admin Utama",
        barang: "Laptop Dell Inspiron",
        jadwalPengembalian: "2024-01-20T17:00",
        status: "dipinjam",
        tanggalPengajuan: "2024-01-14T10:30",
        adminTelepon: "081234567890",
        adminEmail: "admin@p-row.com"
    },
    {
        id: 2,
        adminTujuan: "Siti Nurhaliza",
        barang: "Proyektor Epson",
        jadwalPengembalian: "2024-01-25T16:00",
        status: "menunggu",
        tanggalPengajuan: "2024-01-17T14:20",
        adminTelepon: "087654321098",
        adminEmail: "siti.nurhaliza@p-row.com"
    },
    {
        id: 3,
        adminTujuan: "Rizki Pratama",
        barang: "Sound System JBL",
        jadwalPengembalian: "2024-01-12T18:00",
        status: "dikembalikan",
        tanggalPengajuan: "2024-01-09T16:45",
        adminTelepon: "089876543210",
        adminEmail: "rizki.pratama@p-row.com"
    },
    {
        id: 4,
        adminTujuan: "Maya Indah",
        barang: "Kamera Canon EOS",
        jadwalPengembalian: "2024-01-08T17:00",
        status: "telat",
        tanggalPengajuan: "2024-01-04T11:15",
        adminTelepon: "081112223334",
        adminEmail: "maya.indah@p-row.com"
    }
];

let adminListData = [
    {
        id: 1,
        nama: "Admin Utama",
        jabatan: "Super Admin",
        telepon: "081234567890",
        email: "admin@p-row.com",
        avatar: "AU",
        pernahDipinjam: true
    },
    {
        id: 2,
        nama: "Siti Nurhaliza",
        jabatan: "Admin Peminjaman",
        telepon: "087654321098",
        email: "siti.nurhaliza@p-row.com",
        avatar: "SN",
        pernahDipinjam: true
    },
    {
        id: 3,
        nama: "Rizki Pratama",
        jabatan: "Admin Inventaris",
        telepon: "089876543210",
        email: "rizki.pratama@p-row.com",
        avatar: "RP",
        pernahDipinjam: true
    },
    {
        id: 4,
        nama: "Maya Indah",
        jabatan: "Admin Support",
        telepon: "081112223334",
        email: "maya.indah@p-row.com",
        avatar: "MI",
        pernahDipinjam: true
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
    loadAdminListData();
    
    // Set up user menu
    setupUserMenu();
});

function initializeApp() {
    // Set current date and time for form inputs
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.getElementById('jadwal-pengembalian').value = formatDateTime(tomorrow);
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
                'admin-list': 'Daftar Admin'
            };
            pageTitle.textContent = titles[targetSection];
        });
    });
}

function setupUserMenu() {
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const userMenu = document.getElementById('user-menu');
        const userInfo = document.querySelector('.user-info');
        
        if (!userInfo.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('show');
        }
    });
}

function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    userMenu.classList.toggle('show');
}

function setupFormSubmission() {
    const form = document.getElementById('peminjaman-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate admin selection
        if (!data['admin-tujuan']) {
            alert('Pilih admin yang dituju!');
            return;
        }
        
        // Create new peminjaman object
        const newPeminjaman = {
            id: userPeminjamanData.length + 1,
            adminTujuan: data['admin-tujuan'],
            barang: data.barang,
            jadwalPengembalian: data['jadwal-pengembalian'],
            status: 'menunggu',
            tanggalPengajuan: new Date().toISOString(),
            adminTelepon: getAdminContact(data['admin-tujuan'], 'telepon'),
            adminEmail: getAdminContact(data['admin-tujuan'], 'email')
        };
        
        // Add to data
        userPeminjamanData.unshift(newPeminjaman);
        
        // Show success message
        alert('Pengajuan peminjaman berhasil dikirim! Status: Menunggu ACC');
        
        // Reset form
        form.reset();
        initializeApp();
        
        // Refresh status data if on status page
        if (document.getElementById('status').classList.contains('active')) {
            loadStatusData();
        }
    });
}

function getAdminContact(adminId, type) {
    const admin = adminListData.find(a => a.id === parseInt(adminId.replace('admin', '')));
    return admin ? (type === 'telepon' ? admin.telepon : admin.email) : '';
}

function loadStatusData() {
    const statusList = document.getElementById('status-list');
    const filter = document.getElementById('status-filter').value;
    
    // Filter data based on selected status
    let filteredData = userPeminjamanData;
    if (filter !== 'all') {
        filteredData = userPeminjamanData.filter(item => item.status === filter);
    }
    
    // Sort by date (newest first)
    filteredData.sort((a, b) => new Date(b.tanggalPengajuan) - new Date(a.tanggalPengajuan));
    
    // Generate HTML
    statusList.innerHTML = filteredData.map(item => createStatusCard(item)).join('');
}

function createStatusCard(item) {
    const statusLabels = {
        'menunggu': 'Menunggu ACC',
        'dipinjam': 'Sedang Dipinjam',
        'dikembalikan': 'Telah Dikembalikan',
        'telat': 'Telat Pengembalian'
    };
    
    const statusClasses = {
        'menunggu': 'status-menunggu',
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
    
    let warningMessage = '';
    if (item.status === 'telat') {
        warningMessage = `
            <div class="warning-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>BARANG TELAT DIKEMBALIKAN!</span>
            </div>
        `;
    }
    
    return `
        <div class="status-card">
            <div class="status-header-card">
                <div class="status-info">
                    <h4>${item.barang}</h4>
                    <p><strong>Admin:</strong> ${item.adminTujuan}</p>
                    <p><strong>Jadwal Kembali:</strong> ${formatDate(item.jadwalPengembalian)}</p>
                    <p><strong>Kontak Admin:</strong> ${item.adminTelepon} | ${item.adminEmail}</p>
                </div>
                <span class="status-badge ${statusClasses[item.status]}">${statusLabels[item.status]}</span>
            </div>
            ${warningMessage}
        </div>
    `;
}

function loadAdminListData() {
    const adminListContainer = document.getElementById('admin-list-container');
    
    adminListContainer.innerHTML = adminListData.map(admin => `
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
            <div class="admin-actions">
                <button class="btn-pinjam" onclick="pinjamDariAdmin('${admin.nama}')">
                    <i class="fas fa-handshake"></i> Pinjam
                </button>
            </div>
        </div>
    `).join('');
}

function pinjamDariAdmin(adminName) {
    // Navigate to pengajuan section
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');
    
    // Update active nav item
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector('[data-section="pengajuan"]').classList.add('active');
    
    // Update active section
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById('pengajuan').classList.add('active');
    
    // Update page title
    pageTitle.textContent = 'Pengajuan Peminjaman';
    
    // Auto-fill admin selection
    const adminSelect = document.getElementById('admin-tujuan');
    const adminOptions = adminSelect.options;
    
    for (let i = 0; i < adminOptions.length; i++) {
        if (adminOptions[i].text === adminName) {
            adminSelect.selectedIndex = i;
            break;
        }
    }
    
    // Focus on barang input
    document.getElementById('barang').focus();
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