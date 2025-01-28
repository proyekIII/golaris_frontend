// Mendapatkan supplier_id dari localStorage setelah login
const supplierId = localStorage.getItem('supplier_id');

// URL API kategori, produk, dan pesanan dengan menambahkan supplier_id
const categoryApiUrl = `http://localhost:8000/api/categories?supplier_id=${supplierId}`;
const productApiUrl = `http://127.0.0.1:8000/api/products/supplier/${supplierId}`; // Perbaikan URL produk
const orderApiUrl = `http://localhost:8000/api/pesanan?supplier_id=${supplierId}`;

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
            const tableBody = document.querySelector("#productDataTable tbody");
            tableBody.innerHTML = '';
            data.forEach(product => {
                const category = categories.find(cat => cat.id === product.category_id);
                const categoryName = category ? category.name : 'Unknown Category';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><img src="${product.image_url}" alt="Product Image" class="product-image"></td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${categoryName}</td>
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
            orderTableBody.innerHTML = '';
            data.forEach(order => {
                const productName = order.product ? order.product.name : 'No product'; 

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${productName}</td>
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

// Panggil fungsi fetch saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    if (supplierId) {
        fetchCategories(); // Mengambil data kategori
        fetchProducts(); // Mengambil data produk
        fetchOrders(); // Mengambil data pesanan jika supplier_id tersedia
    } else {
        console.log('Supplier ID tidak ditemukan');
    }
});

// Fungsi logout
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('supplier');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('supplier_id');
    alert('Anda telah logout!');
    window.location.href = 'login.html'; // Redirect ke halaman login
});
