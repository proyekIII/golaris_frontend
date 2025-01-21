// URL API untuk operasi CRUD
const apiUrl = 'http://127.0.0.1:8000/api/products';

document.querySelectorAll(".navList").forEach(function(element) {
  element.addEventListener('click', function() {
    
      // Menghilangkan kelas 'active' dari semua menu item
      document.querySelectorAll(".navList").forEach(function(e) {
          e.classList.remove('active');
      });

      // Menambahkan kelas 'active' pada menu yang diklik
      this.classList.add('active');

      // Mendapatkan index dari elemen yang diklik
      var index = Array.from(this.parentNode.children).indexOf(this);

      // Menyembunyikan semua data-table dan modal yang ada
      document.querySelectorAll(".data-table").forEach(function(table) {
          table.style.display = 'none';
      });
      document.querySelectorAll(".modal-overlay").forEach(function(modal) {
          modal.style.display = 'none';
      });

      // Menampilkan bagian sesuai dengan index yang diklik
      var tables = document.querySelectorAll(".data-table");
      if (tables.length > index) {
          tables[index].style.display = 'block';
      }

      // Mengambil kategori hanya jika menu Category diklik
      if (index === 1) {
          fetchCategories(); // Mengambil kategori saat menu "Category" diklik
      }
      
      // Mengambil produk hanya jika menu Product diklik
      if (index === 2) {
          fetchProducts(); // Mengambil produk saat menu "Product" diklik
      }

      // Anda dapat menambahkan logika tambahan untuk menu lainnya sesuai dengan kebutuhan
  });
});

// Fungsi untuk mengambil kategori
async function fetchCategories() {
  try {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      categories = data; // Menyimpan kategori yang diambil
  } catch (error) {
      console.error('Error fetching categories:', error);
  }
}

// Fungsi untuk mengambil produk
async function fetchProducts() {
  try {
      const response = await fetch('http://localhost:8000/api/products');
      const data = await response.json();
      renderProducts(data); // Menampilkan produk dalam tabel
  } catch (error) {
      console.error("Error fetching products:", error);
  }
}



// Variabel untuk menyimpan kategori
let categories = [];

// Fungsi untuk mengambil kategori
async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:8000/api/categories');
    const data = await response.json();
    categories = data; // Simpan kategori yang didapat
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Fungsi untuk menampilkan produk
async function fetchProducts() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    renderProducts(data); // Menampilkan produk dengan kategori yang sesuai
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Fungsi untuk menampilkan produk dalam tabel
// Fungsi untuk menampilkan produk dalam tabel
function renderProducts(products) {
  const tableBody = document.querySelector('#productDataTable tbody');
  tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

  products.forEach(product => {
    const category = categories.find(cat => cat.id === product.category_id);
    const categoryName = category ? category.name : 'Tidak Diketahui'; // Menampilkan kategori berdasarkan ID

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td><img src="${product.image_url}" alt="${product.name}" width="50"></td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${categoryName}</td>
      <td>
        <button onclick="showEditProductModal(${product.id})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Fungsi untuk mengambil kategori dan produk
document.addEventListener('DOMContentLoaded', function () {
  fetchCategories().then(() => {
    fetchProducts(); // Setelah kategori diambil, baru ambil produk
  });
});

// Perbaikan nama fungsi dan pemanggilan
function showAddProductModal() {
  document.getElementById('addProductModal').style.display = 'block';
  fetchCategoriesForProduct();
}

function closeAddProductModal() {
  document.getElementById('addProductModal').style.display = 'none';
}


// Fungsi untuk menambah produk
async function addProduct(event) {
  event.preventDefault(); // Mencegah form submit otomatis

  const formData = new FormData(document.getElementById('productForm'));
  const productData = {
    name: formData.get('productName'),
    description: formData.get('productDescription'),
    price: formData.get('productPrice'),
    stock: formData.get('productStock'),
    category_id: formData.get('categoryId')
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      alert('Produk berhasil ditambahkan');
      hideAddProductForm();
      fetchProducts(); // Refresh data produk
    } else {
      alert('Gagal menambahkan produk');
    }
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

// Fungsi untuk menampilkan form edit produk
async function showEditProductModal(productId) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`);
    const product = await response.json();
    // Isi form dengan data produk yang dipilih
    document.getElementById('editProductId').value = product.product_id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    document.getElementById('editProductCategory').value = product.category_id;

    document.getElementById('editProductModal').style.display = 'block'; // Tampilkan modal
  } catch (error) {
    console.error('Error fetching product for editing:', error);
  }
}

// Fungsi untuk memperbarui produk
async function updateProduct(event) {
  event.preventDefault();

  const productId = document.getElementById('editProductId').value;
  const productName = document.getElementById('editProductName').value;
  const productPrice = document.getElementById('editProductPrice').value;
  const productCategory = document.getElementById('editProductCategory').value;
  const productDescription = document.getElementById('editProductDescription').value;

  const productData = {
    name: productName,
    price: productPrice,
    category_id: productCategory,
    description: productDescription
  };

  try {
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      alert('Produk berhasil diperbarui');
      fetchProducts(); // Refresh data produk setelah diupdate
      closeEditProductModal(); // Sembunyikan form edit produk
    } else {
      alert('Gagal memperbarui produk');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
}

// Fungsi untuk menghapus produk
async function deleteProduct(productId) {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    try {
      const response = await fetch(`${apiUrl}/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Produk berhasil dihapus');
        fetchProducts(); // Refresh data produk setelah dihapus
      } else {
        alert('Gagal menghapus produk');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}

// Fungsi untuk menutup modal form edit produk
function closeEditProductModal() {
  document.getElementById('editProductModal').style.display = 'none';
}

// Fungsi untuk menampilkan form tambah produk dalam modal
function showAddProductModal() {
  document.getElementById('addProductModal').style.display = 'block';
  fetchCategoriesForProduct(); // Fetch categories saat modal ditampilkan
}

// Fungsi untuk menutup modal form tambah produk
function closeAddProductModal() {
  document.getElementById('addProductModal').style.display = 'none';
}

// Fungsi untuk mengambil dan menampilkan kategori (untuk dropdown)
function fetchCategoriesForProduct() {
  fetch('http://localhost:8000/api/categories')
    .then(response => response.json())
    .then(data => {
      const productCategorySelect = document.getElementById('productCategory');
      const editProductCategorySelect = document.getElementById('editProductCategory');
      productCategorySelect.innerHTML = '';
      editProductCategorySelect.innerHTML = '';

      data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.name;
        productCategorySelect.appendChild(option);

        const editOption = option.cloneNode(true);
        editProductCategorySelect.appendChild(editOption);
      });
    })
    .catch(error => console.error('Error fetching categories for product:', error));
}

// Panggil fungsi fetchCategories saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
  fetchCategories().then(() => {
    fetchProducts(); // Setelah kategori diambil, baru ambil produk
  });
});
