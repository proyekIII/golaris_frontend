const categoryApiUrl = 'http://localhost:8000/api/categories';
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





//Fungsi untuk mengambil semua kategori
async function fetchCategories() {
  try {
    const response = await fetch(categoryApiUrl);
    const data = await response.json();
    renderCategories(data); // Menampilkan kategori dalam tabel
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Fungsi untuk menampilkan kategori dalam tabel
function renderCategories(categories) {
  const tableBody = document.querySelector('#categoryDataTable tbody');
  tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

  categories.forEach(category => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${category.id}</td> <!-- Menggunakan 'id' bukan 'category_id' -->
      <td>${category.name}</td>
      <td>
        <button onclick="showEditCategoryModal(${category.id})">Edit</button>
        <button onclick="deleteCategory(${category.id})">Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Fungsi untuk menampilkan modal tambah kategori
function showAddCategoryModal() {
  document.getElementById('addCategoryForm').style.display = 'block'; // Tampilkan modal
}

// Fungsi untuk menutup modal tambah kategori
function closeAddCategoryModal() {
  document.getElementById('addCategoryForm').style.display = 'none'; // Tutup modal
}

// Fungsi untuk menambah kategori
async function addCategory(event) {
  event.preventDefault(); // Mencegah form submit otomatis

  const categoryName = document.getElementById('categoryName').value;

  try {
    const response = await fetch(categoryApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      alert('Kategori berhasil ditambahkan');
      closeAddCategoryModal(); // Tutup modal
      const newCategory = { id: Date.now(), name: categoryName }; // Menambahkan kategori baru (id sementara)
      renderCategories([newCategory]); // Menampilkan kategori baru di tabel tanpa reload
    } else {
      alert('Gagal menambahkan kategori');
    }
  } catch (error) {
    console.error('Error adding category:', error);
  }
}

// Fungsi untuk menampilkan modal edit kategori
async function showEditCategoryModal(categoryId) {
  try {
    const response = await fetch(`${categoryApiUrl}/${categoryId}`);
    const category = await response.json();

    // Isi form dengan data kategori yang dipilih
    document.getElementById('editCategoryId').value = category.id; // Menggunakan 'id' bukan 'category_id'
    document.getElementById('editCategoryName').value = category.name;

    document.getElementById('editCategoryForm').style.display = 'block'; // Tampilkan modal
  } catch (error) {
    console.error('Error fetching category for editing:', error);
  }
}

// Fungsi untuk memperbarui kategori
async function updateCategory(event) {
  event.preventDefault();

  const categoryId = document.getElementById('editCategoryId').value;
  const categoryName = document.getElementById('editCategoryName').value;

  try {
    const response = await fetch(`${categoryApiUrl}/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      alert('Kategori berhasil diperbarui');
      closeEditCategoryModal(); // Tutup modal
      const updatedCategory = { id: categoryId, name: categoryName };

      // Memperbarui nama kategori di tabel
      const rows = document.querySelectorAll('#categoryDataTable tbody tr');
      rows.forEach(row => {
        if (row.children[0].textContent == categoryId) {
          row.children[1].textContent = categoryName; // Memperbarui nama kategori di tabel
        }
      });
    } else {
      alert('Gagal memperbarui kategori');
    }
  } catch (error) {
    console.error('Error updating category:', error);
  }
}

// Fungsi untuk menghapus kategori
async function deleteCategory(categoryId) {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    try {
      const response = await fetch(`${categoryApiUrl}/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Kategori berhasil dihapus');
        
        // Menghapus baris kategori dari tabel
        const rows = document.querySelectorAll('#categoryDataTable tbody tr');
        rows.forEach(row => {
          if (row.children[0].textContent == categoryId) {
            row.remove(); // Menghapus baris kategori dari tabel
          }
        });
      } else {
        alert('Gagal menghapus kategori');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
}

// Fungsi untuk menutup modal edit kategori
function closeEditCategoryModal() {
  document.getElementById('editCategoryForm').style.display = 'none'; // Tutup modal Edit
}

// Ambil data kategori saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchCategories);



