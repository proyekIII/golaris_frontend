document.querySelectorAll(".navList").forEach(function(element) {
  element.addEventListener('click', function() {
    
      document.querySelectorAll(".navList").forEach(function(e) {
          e.classList.remove('active');
      });

      // Add active class to the clicked navList element
      this.classList.add('active');

      // Get the index of the clicked navList element
      var index = Array.from(this.parentNode.children).indexOf(this);

      // Hide all data-table elements
      document.querySelectorAll(".data-table").forEach(function(table) {
          table.style.display = 'none';
      });

      // Show the corresponding table based on the clicked index
      var tables = document.querySelectorAll(".data-table");
      if (tables.length > index) {
          tables[index].style.display = 'block';
      }

      // Handle the Category menu click (index 1 for "Category")
      if (index === 1) {
          fetchCategories();
      }
  });
});

// Fungsi untuk mengambil data kategori dari API
function fetchCategories() {
  fetch('http://localhost:8000/api/categories')
      .then(response => response.json())
      .then(data => {
          const tableBody = document.getElementById('categoryDataTable').getElementsByTagName('tbody')[0];
          tableBody.innerHTML = ''; // Kosongkan tabel sebelum menambahkan data baru

          // Menambahkan data kategori ke tabel
          data.forEach(category => {
              const row = tableBody.insertRow();
              row.innerHTML = `
                  <td>${category.id}</td>
                  <td>${category.name}</td>
                  <td>
                      <button onclick="editCategory(${category.id})">Edit</button>
                      <button class="delete" onclick="deleteCategory(${category.id})">Delete</button>
                  </td>
              `;
          });
      })
      .catch(error => {
          console.error('Error fetching categories:', error);
      });
}

// Fungsi untuk mengedit kategori
function editCategory(categoryId) {
  // Misalnya, kamu bisa membuka modal atau form untuk mengedit kategori
  alert('Edit category with ID: ' + categoryId);
  // Implementasikan logika edit kategori sesuai kebutuhanmu
}

// Fungsi untuk menghapus kategori
function deleteCategory(categoryId) {
  if (confirm('Are you sure you want to delete this category?')) {
      fetch(`http://localhost:8000/api/categories/${categoryId}`, {
          method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
          alert('Category deleted successfully');
          fetchCategories(); // Refresh data kategori setelah penghapusan
      })
      .catch(error => {
          console.error('Error deleting category:', error);
      });
  }
}


