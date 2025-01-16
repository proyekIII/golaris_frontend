// Fungsi untuk mengambil dan menampilkan kategori
function fetchCategories() {
    fetch('http://localhost:8000/api/categories')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('categoryDataTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

            data.forEach(category => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${category.category_id}</td> <!-- Gunakan category_id sebagai ID -->
                    <td>${category.name}</td>
                    <td>
                        <button onclick="editCategory(${category.category_id})">Edit</button>
                        <button onclick="deleteCategory(${category.category_id})">Delete</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Fungsi untuk menampilkan form tambah kategori
function showAddCategoryForm() {
    document.getElementById('addCategoryForm').style.display = 'block';
}

// Fungsi untuk menyembunyikan form tambah kategori
function hideAddCategoryForm() {
    document.getElementById('addCategoryForm').style.display = 'none';
}

// Fungsi untuk menambah kategori
function addCategory(event) {
    event.preventDefault();
    
    const categoryName = document.getElementById('categoryName').value;

    fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
    })
    .then(response => response.json())
    .then(data => {
        alert('Category added successfully!');
        fetchCategories(); // Refresh data kategori setelah ditambah
        hideAddCategoryForm(); // Sembunyikan form tambah kategori
    })
    .catch(error => console.error('Error adding category:', error));
}

// Fungsi untuk menampilkan form edit kategori
function editCategory(categoryId) {
    fetch(`http://localhost:8000/api/categories/${categoryId}`)
        .then(response => {
            // Log the raw response to see if it's valid JSON
            console.log(response);
            return response.text(); // Ambil respons sebagai teks
        })
        .then(text => {
            try {
                const data = JSON.parse(text); // Parsing teks ke JSON
                document.getElementById('editCategoryId').value = data.category_id; // Gunakan category_id
                document.getElementById('editCategoryName').value = data.name;
                document.getElementById('editCategoryForm').style.display = 'block';
            } catch (error) {
                console.error('Error parsing JSON:', error); // Jika parsing gagal
                alert('Terjadi kesalahan saat mengambil data kategori');
            }
        })
        .catch(error => console.error('Error fetching category data for edit:', error));
}


// Fungsi untuk menyembunyikan form edit kategori
function hideEditCategoryForm() {
    document.getElementById('editCategoryForm').style.display = 'none';
}

// Fungsi untuk update kategori
function updateCategory(event) {
    event.preventDefault();
    
    const categoryId = document.getElementById('editCategoryId').value;
    const categoryName = document.getElementById('editCategoryName').value;

    fetch(`http://localhost:8000/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
    })
    .then(response => response.json())
    .then(data => {
        alert('Category updated successfully!');
        fetchCategories(); // Refresh data kategori setelah diupdate
        hideEditCategoryForm(); // Sembunyikan form edit kategori
    })
    .catch(error => console.error('Error updating category:', error));
}

// Fungsi untuk menghapus kategori
function deleteCategory(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        fetch(`http://localhost:8000/api/categories/${categoryId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Category deleted successfully');
            fetchCategories(); // Refresh data kategori setelah dihapus
        })
        .catch(error => console.error('Error deleting category:', error));
}

// Panggil fungsi fetchCategories saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    fetchCategories();
})};
