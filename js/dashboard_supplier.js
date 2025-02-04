// Mendapatkan supplier_id dari localStorage setelah login
const supplierId = localStorage.getItem('supplier_id');

// URL API kategori, produk, dan pesanan dengan menambahkan supplier_id

const productApiUrl = `http://127.0.0.1:8000/api/products/supplier/${supplierId}`; // Perbaikan URL produk


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
// Menambahkan produk
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

    fetch('http://127.0.0.1:8000/api/products', {
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

// Menambahkan kategori
function addCategory(event) {
    event.preventDefault();
    const categoryName = document.getElementById("categoryName").value;

    fetch('http://127.0.0.1:8000/api/categories', {
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

// URL API Produk


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

    const updatedProduct = {
        name: name,
        price: price,
        stock: stock,
        category_id: category_id
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
    document.getElementById("addProductForm").reset();
    document.getElementById("addProductForm").style.display = "none";
}

// Fungsi untuk menutup modal edit produk
function closeEditProductModal() {
    document.getElementById("editProductForm").reset();
    document.getElementById("editProductForm").style.display = "none";
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
function openAddProductModal() {
    // Your code to open the modal goes here
    document.getElementById('addProductModal').style.display = 'block'; // Example to show modal
}




// Fungsi untuk mengambil dan menampilkan data pesanan
function fetchOrders() {
    fetch(orderApiUrl)
        .then(response => response.json())
        .then(data => {
            const orderTableBody = document.querySelector("#orderDataTable tbody");
            orderTableBody.innerHTML = ''; // Reset table sebelum menambahkan data baru
            if (data.length === 0) {
                orderTableBody.innerHTML = '<tr><td colspan="7">No orders found.</td></tr>';
            } else {
                data.forEach(order => {
                    const productName = order.product_name || 'No product'; 


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
            }
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

// Fungsi untuk membuka modal
function openAddProductModal() {
    document.getElementById('addProductForm').style.display = 'block';
}

// Fungsi untuk menutup modal
function closeAddProductModal() {
    document.getElementById('addProductForm').style.display = 'none';
}

// Fungsi untuk menambahkan produk
function addProduct(event) {
    event.preventDefault();

    // Ambil data dari form
    const productName = document.getElementById('productName').value;
    const productImage = document.getElementById('productImage').files[0]; // Gambar produk
    const productPrice = document.getElementById('productPrice').value;
    const productStock = document.getElementById('productStock').value;
    const productCategory = document.getElementById('productCategory').value;

    // Buat elemen untuk menampilkan data produk di tabel
    const table = document.getElementById('productDataTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>1</td> <!-- Ini bisa diganti dengan ID dinamis -->
        <td>${productName}</td>
        <td><img src="${URL.createObjectURL(productImage)}" alt="${productName}" width="50"></td>
        <td>${productPrice}</td>
        <td>${productStock}</td>
        <td>${productCategory}</td>
        <td>
            <button onclick="editProduct(this)">Edit</button>
            <button onclick="deleteProduct(this)">Delete</button>
        </td>
    `;

    // Menutup modal setelah produk ditambahkan
    closeAddProductModal();
}

// Fungsi untuk mengedit produk
function editProduct(button) {
    const row = button.parentElement.parentElement;
    // Logika edit produk bisa ditambahkan di sini
    console.log('Edit product:', row);
}

// Fungsi untuk menghapus produk
function deleteProduct(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}




let currentEditingRow = null;

// Fungsi untuk membuka modal dengan data produk yang ada
function openEditProductModal(row) {
    currentEditingRow = row; // Menyimpan baris yang sedang diedit
    const cells = row.getElementsByTagName('td');

    // Memasukkan data produk yang ada ke dalam form modal
    document.getElementById('productName').value = cells[1].textContent;
    document.getElementById('productPrice').value = cells[3].textContent;
    document.getElementById('productStock').value = cells[4].textContent;
    document.getElementById('productCategory').value = cells[5].textContent;

    // Menampilkan modal
    document.getElementById('addProductForm').style.display = 'block';
}

// Fungsi untuk menutup modal
function closeAddProductModal() {
    document.getElementById('addProductForm').style.display = 'none';
    currentEditingRow = null; // Reset baris yang sedang diedit
}

// Fungsi untuk menyimpan perubahan produk
function saveEditedProduct(event) {
    event.preventDefault();

    // Ambil data dari form
    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productStock = document.getElementById('productStock').value;
    const productCategory = document.getElementById('productCategory').value;

    // Perbarui baris produk dengan data yang baru
    currentEditingRow.cells[1].textContent = productName;
    currentEditingRow.cells[3].textContent = productPrice;
    currentEditingRow.cells[4].textContent = productStock;
    currentEditingRow.cells[5].textContent = productCategory;

    // Menutup modal setelah menyimpan perubahan
    closeAddProductModal();
}

// Fungsi untuk menambahkan produk baru
// Fungsi untuk menambahkan produk melalui API
// Fungsi untuk menambahkan produk melalui API
async function addProduct(event) {
    event.preventDefault();

    // Ambil data user dari localStorage
    const user = localStorage.getItem("user");
    let supplierId = null;

    if (user) {
        const userData = JSON.parse(user); // Parse JSON ke objek
        supplierId = userData.id; // Ambil ID Supplier dari user
    } else {
        console.error("Data user tidak ditemukan di localStorage.");
        return; // Hentikan eksekusi jika tidak ada ID Supplier
    }

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value || null;
    const productPrice = document.getElementById('productPrice').value;
    const productStock = document.getElementById('productStock').value;
    const productImage = document.getElementById('productImage').files[0] || null;
    const productCategory = document.getElementById('productCategory').value;

    // Menambahkan data ke FormData
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('price', productPrice);
    formData.append('stock', productStock);
    if (productImage) {
        formData.append('image_url', productImage);
    }
    formData.append('supplier_id', supplierId);
    formData.append('category_id', productCategory);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/products', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Product added successfully:', result);
            alert('Produk berhasil ditambahkan!');
        } else {
            console.error('Error adding product:', result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// Fungsi untuk mendapatkan daftar kategori
async function getCategories() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/categories');
        const categories = await response.json();

        if (response.ok) {
            populateCategoryDropdown(categories);
        } else {
            console.error('Error fetching categories:', categories);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fungsi untuk mengisi dropdown kategori
function populateCategoryDropdown(categories) {
    const categoryDropdown = document.getElementById('productCategory');
    categoryDropdown.innerHTML = ''; // Kosongkan dropdown terlebih dahulu

    // Menambahkan opsi default
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Category';
    categoryDropdown.appendChild(defaultOption);

    // Menambahkan kategori ke dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryDropdown.appendChild(option);
    });
}

// Memanggil fungsi untuk mengambil kategori saat halaman dimuat
document.addEventListener('DOMContentLoaded', getCategories);

