// Event listener untuk menu navigasi
document.querySelectorAll(".navList").forEach(function (element, index) {
    element.addEventListener('click', function () {
        // Menghilangkan kelas 'active' dari semua menu item
        document.querySelectorAll(".navList").forEach(function (e) {
            e.classList.remove('active');
        });

        // Menambahkan kelas 'active' pada menu yang diklik
        this.classList.add('active');

        // Menyembunyikan semua data-table dan modal yang ada
        document.querySelectorAll(".data-table").forEach(function (table) {
            table.style.display = 'none';
        });
        document.querySelectorAll(".modal-overlay").forEach(function (modal) {
            modal.style.display = 'none';
        });

        // Menampilkan bagian yang sesuai dengan menu yang diklik berdasarkan index
        if (index === 0) {
            document.querySelector('.dashboard').style.display = 'block'; // Dashboard
        } else if (index === 1) {
            document.querySelector('.categoryDetailsTable').style.display = 'block'; // Category
            fetchCategories(); // Ambil kategori
        } else if (index === 2) {
            document.querySelector('.productDetailsTable').style.display = 'block'; // Product
            fetchProducts(); // Ambil produk
        } else if (index === 3) {
            document.querySelector('.orderDetailsTable').style.display = 'block'; // Order Report
            fetchOrders(); // Ambil pesanan
        } else if (index === 4) {
            document.querySelector('.transactionDetailsTable').style.display = 'block'; // Transaction Report
        }
    });
});

// Mendapatkan supplier_id dari localStorage
const supplierId = localStorage.getItem('supplier_id');

// URL API kategori dan produk dengan menambahkan supplier_id
const categoryApiUrl = `http://localhost:8000/api/categories?supplier_id=${supplierId}`;
const productApiUrl = `http://localhost:8000/api/products?supplier_id=${supplierId}`;
const orderApiUrl = `http://127.0.0.1:8000/api/pesanan?supplier_id=${supplierId}`; // Gantilah dengan URL API pesanan Anda

// Variabel untuk menyimpan kategori
let categories = [];

// Fungsi untuk mengambil kategori
function fetchCategories() {
    fetch(categoryApiUrl)
        .then(response => response.json())
        .then(data => {
            categories = data; // Menyimpan kategori untuk digunakan nanti
            const tableBody = document.querySelector("#categoryDataTable tbody");
            tableBody.innerHTML = '';
            data.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td><button onclick="editCategory(${category.id})">Edit</button><button onclick="deleteCategory(${category.id})">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Fungsi untuk mengambil produk
function fetchProducts() {
    fetch(productApiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Produk yang diterima:", data); // Log produk untuk debugging
            const tableBody = document.querySelector("#productDataTable tbody");
            tableBody.innerHTML = '';
            data.forEach(product => {
                // Mencocokkan kategori produk dengan nama kategori
                const category = categories.find(cat => cat.id === product.category_id);
                const categoryName = category ? category.name : 'Unknown Category';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><img src="${product.image_url}" alt="Product Image" class="product-image"></td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${categoryName}</td> <!-- Nama kategori -->
                    <td><button onclick="editProduct(${product.id})">Edit</button><button onclick="deleteProduct(${product.id})">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Fungsi untuk mengambil dan menampilkan data pesanan
function fetchOrders() {
    fetch(orderApiUrl)
        .then(response => response.json())
        .then(data => {
            const orderTableBody = document.querySelector("#orderDataTable tbody");
            orderTableBody.innerHTML = ''; // Bersihkan tabel sebelumnya
            data.forEach(order => {
                // Pengecekan jika produk ada di dalam order
                const productName = order.product ? order.product.name : 'No product'; // Menggunakan 'No product' jika tidak ada produk

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${productName}</td> <!-- Nama produk yang diambil dari relasi -->
                    <td>${order.quantity}</td>
                    <td>${order.price}</td>
                    <td>${order.total_price}</td>
                    <td>${order.status}</td>
                    <td>${order.order_date}</td>
                `;
                orderTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

// Panggil fetchOrders saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    // Memastikan supplier_id ada di localStorage sebelum memanggil fetchOrders
    if (supplierId) {
        fetchOrders(); // Mengambil data pesanan jika supplier_id tersedia
    } else {
        console.log('Supplier ID tidak ditemukan');
    }
});

// Fungsi login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        console.log(data); // Menambahkan log untuk memeriksa data yang diterima

        if (response.ok) {
            alert('Login berhasil!');

            // Cek apakah data yang diterima valid
            if (data.user && data.type === 'supplier') {
                // Simpan informasi supplier dan status login ke LocalStorage
                localStorage.setItem('supplier', JSON.stringify(data.user)); // Menyimpan data user sebagai supplier
                localStorage.setItem('isLoggedIn', 'true');
                
                // Simpan supplier_id dari data user
                localStorage.setItem('supplier_id', data.user.id);

                // Redirect ke halaman yang sesuai berdasarkan tipe supplier
                window.location.href = 'dashboardsuppplier.html'; // Halaman supplier
            } else {
                alert('Data supplier tidak valid.');
            }
        } else {
            alert(data.error || 'Login gagal!');
        }
    } catch (error) {
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
});
