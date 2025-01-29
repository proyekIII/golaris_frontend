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

// URL API kategori dan produk
const categoryApiUrl = 'http://localhost:8000/api/categories';
// const productApiUrl = 'http://localhost:8000/api/products';
const orderApiUrl = 'http://127.0.0.1:8000/api/pesanan'; // Gantilah dengan URL API pesanan Anda

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
// Menambahkan kategori
function addCategory(event) {
    event.preventDefault();
    const categoryName = document.getElementById("categoryName").value;
    
    fetch(categoryApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
    })
    .then(response => response.json())
    .then(data => {
        alert("Category added successfully!");
        closeAddCategoryModal();
        fetchCategories(); // Refresh data kategori
    })
    .catch(error => console.error("Error adding category:", error));
}

// Mengedit kategori
function editCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        document.getElementById("editCategoryId").value = category.id;
        document.getElementById("editCategoryName").value = category.name;
        document.getElementById("editCategoryForm").style.display = "block";
    }
}

// Memperbarui kategori
function updateCategory(event) {
    event.preventDefault();
    const categoryId = document.getElementById("editCategoryId").value;
    const categoryName = document.getElementById("editCategoryName").value;

    fetch(`${categoryApiUrl}/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
    })
    .then(response => response.json())
    .then(data => {
        alert("Category updated successfully!");
        closeEditCategoryModal();
        fetchCategories(); // Refresh data kategori
    })
    .catch(error => console.error("Error updating category:", error));
}

// Menghapus kategori
function deleteCategory(categoryId) {
    if (confirm("Are you sure you want to delete this category?")) {
        fetch(`${categoryApiUrl}/${categoryId}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                alert("Category deleted successfully!");
                fetchCategories(); // Refresh data kategori
            } else {
                alert("Failed to delete category.");
            }
        })
        .catch(error => console.error("Error deleting category:", error));
    }
}

// Fungsi untuk menutup modal
function closeAddCategoryModal() {
    document.getElementById("addCategoryForm").style.display = "none";
}

function closeEditCategoryModal() {
    document.getElementById("editCategoryForm").style.display = "none";
}

function showAddCategoryModal() {
    document.getElementById("addCategoryForm").style.display = "block";
}



const productApiUrl = 'http://localhost:8000/api/products';

// Fungsi untuk mengambil produk
function fetchProducts() {
    fetch(productApiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#productDataTable tbody");
            tableBody.innerHTML = ''; // Bersihkan data sebelumnya
            data.forEach(product => {
                const categoryName = product.category_name || 'Unknown Category'; // Nama kategori produk
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td><img src="${product.image_url}" alt="Product Image" class="product-image"></td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${categoryName}</td>
                    <td>
                        <button onclick="editProduct(${product.id})">Edit</button>
                        <button onclick="deleteProduct(${product.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Fungsi untuk menambahkan produk
function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const stock = document.getElementById("productStock").value;
    const category_id = document.getElementById("productCategoryId").value;
    const imageFile = document.getElementById("productImageUrl").files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('category_id', category_id);
    if (imageFile) {
        formData.append('image_url', imageFile);
    }

    fetch(productApiUrl, {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        alert("Product added successfully!");
        closeAddProductModal();
        fetchProducts(); // Refresh data produk
    })
    .catch(error => console.error("Error adding product:", error));
}

// Fungsi untuk menampilkan modal edit produk
function editProduct(productId) {
    // Ganti URL dengan endpoint API Anda
    const productApiUrl = 'http://127.0.0.1:8000/api/products';

    fetch(`${productApiUrl}/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal mendapatkan data produk. Silakan cek koneksi atau ID produk.');
            }
            return response.json();
        })
        .then(product => {
            // Pastikan data produk ditemukan
            if (product) {
                // Isi form dengan data produk
                document.getElementById("editProductId").value = product.id;
                document.getElementById("editProductName").value = product.name;
                document.getElementById("editProductPrice").value = product.price;
                document.getElementById("editProductStock").value = product.stock;
                document.getElementById("editProductCategoryId").value = product.category_id;

                // Tampilkan form edit
                document.getElementById("editProductForm").style.display = "block";
            } else {
                // Jika data produk tidak ditemukan
                alert("Data produk tidak ditemukan. Silakan cek kembali ID produk.");
            }
        })
        .catch(error => {
            console.error("Terjadi kesalahan:", error.message);
            alert("Terjadi kesalahan saat mengambil data produk. Silakan coba lagi.");
        });
}

// Fungsi untuk memperbarui produk
function updateProduct(event) {
    event.preventDefault();
    const id = document.getElementById("editProductId").value;
    const name = document.getElementById("editProductName").value;
    const price = document.getElementById("editProductPrice").value;
    const stock = document.getElementById("editProductStock").value;
    const category_id = document.getElementById("editProductCategoryId").value;
    // const description = document.getElementById("editProductDescription").value;  // Tambahkan untuk deskripsi jika ada
    // const supplier_id = document.getElementById("editProductSupplierId").value;  // Tambahkan untuk supplier jika ada

    const updatedProduct = {
        name: name,
        price: price,
        // description: description,
        stock: stock,
        category_id: category_id,
        // supplier_id: supplier_id
    };

    fetch(`${productApiUrl}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
    })
    .then(response => response.json())
    .then(data => {
        alert("Product updated successfully!");
        closeEditProductModal();
        fetchProducts(); // Refresh data produk
    })
    .catch(error => console.error("Error updating product:", error));
}


// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        fetch(`${productApiUrl}/${productId}`, { method: "DELETE" })
        .then(response => {
            if (response.ok) {
                alert("Product deleted successfully!");
                fetchProducts(); // Refresh data produk
            } else {
                alert("Failed to delete product.");
            }
        })
        .catch(error => console.error("Error deleting product:", error));
    }
}

// Fungsi untuk menutup modal tambah produk
function closeAddProductModal() {
    document.getElementById("addProductForm").style.display = "none";
}

// Fungsi untuk menutup modal edit produk
function closeEditProductModal() {
    document.getElementById("editProductForm").style.display = "none";
}

// Fungsi untuk menampilkan modal tambah produk
function showAddProductModal() {
    document.getElementById("addProductForm").style.display = "block";
}

// Panggil fetchProducts saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    fetchProducts(); // Mengambil data produk
});


// Fungsi untuk mengambil dan menampilkan data pesanan
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
    fetchOrders(); // Mengambil data pesanan
});